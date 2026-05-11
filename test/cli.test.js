import assert from 'node:assert/strict';
import {mkdtemp, readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import process from 'node:process';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {execa} from 'execa';

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const cliPath = path.join(rootDirectory, 'dist/index.js');

test('scaffolds a TypeScript library from flags', async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), 'create-ink-app-'));

  const result = await execa(
    process.execPath,
    [
      cliPath,
      'ink-library',
      '--type',
      'library',
      '--template',
      'ts',
      '--no-git',
      '--install',
      'skip',
    ],
    {
      cwd,
      input: 'y\n',
    },
  );

  const packageJson = JSON.parse(
    await readFile(path.join(cwd, 'ink-library/package.json'), 'utf8'),
  );

  assert.match(result.stdout, /Created ink-library\./);
  assert.equal(packageJson.name, 'ink-library');
  assert.equal(packageJson.main, './dist/index.js');
  assert.equal(packageJson.scripts.build, 'tsc');
  assert.match(
    await readFile(path.join(cwd, 'ink-library/.gitignore'), 'utf8'),
    /node_modules/,
  );
});

test('prompts for project type and JavaScript CLI template', async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), 'create-ink-app-'));

  await execa(
    process.execPath,
    [cliPath, 'ink-cli', '--no-git', '--install', 'skip'],
    {
      cwd,
      input: 'y\ncli\njs\n',
    },
  );

  const packageJson = JSON.parse(
    await readFile(path.join(cwd, 'ink-cli/package.json'), 'utf8'),
  );

  assert.equal(packageJson.name, 'ink-cli');
  assert.equal(packageJson.bin, './bin/cli.js');
  assert.ok(packageJson.dependencies.meow);
});
