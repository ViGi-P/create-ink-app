#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readdir, readFile, rename, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import {text} from 'node:stream/consumers';
import {fileURLToPath} from 'node:url';
import cpy from 'cpy';
import {execa} from 'execa';
import {makeDirectory} from 'make-dir';
import meow from 'meow';

type ProjectType = 'library' | 'cli';
type TemplateLanguage = 'js' | 'ts';
type InstallChoice = 'npm' | 'yarn' | 'pnpm' | 'skip';

const cli = meow(
  `
  Usage
    $ create-ink-app <project-name>

  Options
    --type       Project type: library or cli
    --template   Template language: js or ts
    --install    Install dependencies with npm, yarn, pnpm, or skip
    --git        Initialize a git repository
    --no-git     Skip git initialization
`,
  {
    importMeta: import.meta,
    flags: {
      type: {
        type: 'string',
      },
      template: {
        type: 'string',
      },
      install: {
        type: 'string',
      },
      git: {
        type: 'boolean',
      },
    },
  },
);

const prompt = process.stdin.isTTY
  ? readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  : undefined;
const standardInput = process.stdin.isTTY
  ? undefined
  : await text(process.stdin);
const pipedAnswers = standardInput?.split(/\r?\n/);

try {
  await run();
} catch (error) {
  process.exitCode = 1;

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Failed to create Ink app.');
  }
} finally {
  prompt?.close();
}

async function run(): Promise<void> {
  const projectName = await getProjectName(cli.input[0]);
  const projectType = await getProjectType(cli.flags.type);
  const templateLanguage = await getTemplateLanguage(cli.flags.template);
  const installChoiceFromFlag = getInstallChoiceFromFlag(cli.flags.install);
  const gitChoice = getGitFlag();
  const projectPath = path.resolve(projectName);

  await ensureEmptyDirectory(projectPath);
  await copyTemplate(projectType, templateLanguage, projectPath);
  await restoreGitignore(projectPath);
  await updatePackageName(projectPath, path.basename(projectPath));

  const gitInitialized = existsSync(path.join(projectPath, '.git'));
  const shouldInitializeGit = gitInitialized
    ? false
    : (gitChoice ?? (await confirm('Initialize a git repository?', true)));

  if (shouldInitializeGit) {
    await execa('git', ['init'], {cwd: projectPath, stdio: 'inherit'});
  }

  const installChoice = installChoiceFromFlag ?? (await chooseInstallChoice());

  if (installChoice !== 'skip') {
    await installDependencies(projectPath, installChoice);
  }

  console.log(`Created ${projectName}.`);
}

async function getProjectName(
  initialName: string | undefined,
): Promise<string> {
  if (initialName) {
    const confirmed = await confirm(
      `Create project named "${initialName}"?`,
      true,
    );

    if (confirmed) {
      return initialName;
    }
  }

  const projectName = await ask('Project name');

  if (!projectName) {
    throw new Error('Project name is required.');
  }

  return projectName;
}

async function getProjectType(flagValue: unknown): Promise<ProjectType> {
  const parsed = parseProjectType(flagValue);

  if (parsed) {
    return parsed;
  }

  if (flagValue) {
    throw new Error('The --type flag must be "library" or "cli".');
  }

  return choose('Project type', ['library', 'cli'], 'library');
}

async function getTemplateLanguage(
  flagValue: unknown,
): Promise<TemplateLanguage> {
  const parsed = parseTemplateLanguage(flagValue);

  if (parsed) {
    return parsed;
  }

  if (flagValue) {
    throw new Error('The --template flag must be "js" or "ts".');
  }

  return choose('Template', ['js', 'ts'], 'ts');
}

function getInstallChoiceFromFlag(
  flagValue: unknown,
): InstallChoice | undefined {
  const parsed = parseInstallChoice(flagValue);

  if (parsed) {
    return parsed;
  }

  if (flagValue) {
    throw new Error(
      'The --install flag must be "npm", "yarn", "pnpm", or "skip".',
    );
  }
}

async function chooseInstallChoice(): Promise<InstallChoice> {
  return choose(
    'Install dependencies',
    ['npm', 'yarn', 'pnpm', 'skip'],
    'pnpm',
  );
}

function getGitFlag(): boolean | undefined {
  if (process.argv.includes('--git')) {
    return true;
  }

  if (process.argv.includes('--no-git')) {
    return false;
  }
}

async function ask(message: string, defaultValue?: string): Promise<string> {
  const suffix = defaultValue ? ` (${defaultValue})` : '';
  const question = `${message}${suffix}: `;

  if (!prompt) {
    process.stdout.write(question);
    return applyDefault(pipedAnswers?.shift() ?? '', defaultValue);
  }

  const answer = await prompt.question(question);

  return applyDefault(answer, defaultValue);
}

function applyDefault(answer: string, defaultValue?: string): string {
  const trimmedAnswer = answer.trim();

  if (trimmedAnswer) {
    return trimmedAnswer;
  }

  return defaultValue ?? '';
}

async function confirm(
  message: string,
  defaultValue: boolean,
): Promise<boolean> {
  const marker = defaultValue ? 'Y/n' : 'y/N';
  const rawAnswer = await ask(`${message} [${marker}]`);
  const answer = rawAnswer.toLowerCase();

  if (!answer) {
    return defaultValue;
  }

  if (['y', 'yes'].includes(answer)) {
    return true;
  }

  if (['n', 'no'].includes(answer)) {
    return false;
  }

  return confirm(message, defaultValue);
}

async function choose<const T extends string>(
  message: string,
  choices: readonly T[],
  defaultValue: T,
): Promise<T> {
  const rawAnswer = await ask(
    `${message} (${choices.join('/')})`,
    defaultValue,
  );
  const answer = rawAnswer.toLowerCase();

  if (choices.includes(answer as T)) {
    return answer as T;
  }

  return choose(message, choices, defaultValue);
}

function parseProjectType(value: unknown): ProjectType | undefined {
  if (value === 'library' || value === 'cli') {
    return value;
  }
}

function parseTemplateLanguage(value: unknown): TemplateLanguage | undefined {
  if (value === 'js' || value === 'ts') {
    return value;
  }
}

function parseInstallChoice(value: unknown): InstallChoice | undefined {
  if (
    value === 'npm' ||
    value === 'yarn' ||
    value === 'pnpm' ||
    value === 'skip'
  ) {
    return value;
  }
}

async function ensureEmptyDirectory(projectPath: string): Promise<void> {
  if (!existsSync(projectPath)) {
    await makeDirectory(projectPath);
    return;
  }

  const entries = await readdir(projectPath);

  if (entries.length > 0) {
    throw new Error(
      `Directory already exists and is not empty: ${projectPath}`,
    );
  }
}

async function copyTemplate(
  projectType: ProjectType,
  templateLanguage: TemplateLanguage,
  projectPath: string,
): Promise<void> {
  const templatePath = path.join(
    getTemplatesDirectory(),
    `${projectType}-${templateLanguage}`,
  );

  await cpy('**/*', projectPath, {
    base: 'cwd',
    cwd: templatePath,
    dot: true,
  });
}

function getTemplatesDirectory(): string {
  const currentFile = fileURLToPath(import.meta.url);

  return path.resolve(path.dirname(currentFile), '../templates');
}

async function updatePackageName(
  projectPath: string,
  packageName: string,
): Promise<void> {
  const packagePath = path.join(projectPath, 'package.json');
  const packageJson = JSON.parse(await readFile(packagePath, 'utf8')) as {
    name?: string;
  };
  packageJson.name = packageName;
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

async function restoreGitignore(projectPath: string): Promise<void> {
  const placeholderPath = path.join(projectPath, 'gitignore');

  if (existsSync(placeholderPath)) {
    await rename(placeholderPath, path.join(projectPath, '.gitignore'));
  }
}

async function installDependencies(
  projectPath: string,
  manager: Exclude<InstallChoice, 'skip'>,
): Promise<void> {
  const installArguments = manager === 'yarn' ? [] : ['install'];
  await execa(manager, installArguments, {cwd: projectPath, stdio: 'inherit'});
}
