import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";

import type { AppProperties } from "../types/app-properties.type.ts";

export default async function updatePackageJSON(
  projectPath: string,
  packageName: string,
  pm: AppProperties["pm"] & string,
): Promise<void> {
  const packagePath = path.join(projectPath, "package.json");
  const packageJson = JSON.parse(await readFile(packagePath, "utf8")) as {
    name?: string;
    packageManager?: string;
    scripts?: Record<string, string>;
  };
  packageJson.name = packageName;

  if (pm === "bun" && packageJson.scripts) {
    packageJson.scripts["test"] = "bun test";
    if (packageJson.scripts["pretest"]) {
      delete packageJson.scripts["pretest"];
    }
  }

  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}
