import cpy from "cpy";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import type { AppProperties } from "../types/app-properties.type.ts";

export default async function copyTemplate(
  pm: AppProperties["pm"] & string,
  type: AppProperties["type"] & string,
  language: AppProperties["language"] & string,
  projectPath: string,
  setProgress: (percent: number) => void,
): Promise<void> {
  const templatePath = path.join(
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../templates",
    ),
    `${type}-${language}`,
  );

  await cpy("**/*", projectPath, {
    base: "cwd",
    cwd: templatePath,
    dot: true,
    onProgress: ({ totalFiles, completedFiles }) =>
      setProgress(Math.round((completedFiles / totalFiles) * 100)),
  });

  const runtime = pm === "bun" ? "bun" : "node";
  const testsPath = path.join(projectPath, "src/__tests__");
  const runtimeTestsPath = path.join(testsPath, runtime);

  // Clean up the tests that are not for the chosen runtime
  const otherRuntime = runtime === "bun" ? "node" : "bun";
  await rm(path.join(testsPath, otherRuntime), {
    recursive: true,
    force: true,
  });

  // Move tests up one directory
  const testFiles = await readdir(runtimeTestsPath);
  for (const file of testFiles) {
    await rename(path.join(runtimeTestsPath, file), path.join(testsPath, file));
  }

  const testFilesToEdit = await getTestFiles(testsPath);
  for (const file of testFilesToEdit) {
    const content = await readFile(file, "utf8");
    const updatedContent = content.replace(/^.*\bimport\b.*$/gm, (line) =>
      line.replace(/(?:\.\.\/){2,}/g, (parentPath) => parentPath.slice(3)),
    );

    if (updatedContent !== content) {
      await writeFile(file, updatedContent);
    }
  }

  // Remove the now-empty runtime directory
  await rm(runtimeTestsPath, { recursive: true, force: true });
}

async function getTestFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await getTestFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && /\.test\.[cm]?[jt]sx?$/.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}
