import cpy from "cpy";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AppProperties } from "../types/app-properties.type.ts";

export default async function copyTemplate(
  pm: AppProperties["pm"] & string,
  type: AppProperties["type"] & string,
  language: AppProperties["language"] & string,
  projectPath: string,
  setProgress: (percent: number) => void,
): Promise<void> {
  const runtime = pm === "bun" ? "bun" : "node";
  const templatePath = path.join(
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../templates",
    ),
    `${runtime}-${type}-${language}`,
  );

  await cpy("**/*", projectPath, {
    base: "cwd",
    cwd: templatePath,
    dot: true,
    onProgress: ({ totalFiles, completedFiles }) =>
      setProgress(Math.round((completedFiles / totalFiles) * 100)),
  });
}
