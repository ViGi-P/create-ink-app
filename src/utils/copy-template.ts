import cpy from "cpy";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AppProperties } from "../types/app-properties.type.ts";

import { rm, rename } from "node:fs/promises";

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
  const { readdir } = await import("node:fs/promises");
  const testFiles = await readdir(runtimeTestsPath);
  for (const file of testFiles) {
    await rename(path.join(runtimeTestsPath, file), path.join(testsPath, file));
  }

  // Remove the now-empty runtime directory
  await rm(runtimeTestsPath, { recursive: true, force: true });
}
