import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";

export default async function updatePackageJSON(
  projectPath: string,
  packageName: string,
): Promise<void> {
  const packagePath = path.join(projectPath, "package.json");
  const packageJson = JSON.parse(await readFile(packagePath, "utf8")) as {
    name?: string;
    packageManager?: string;
    scripts?: Record<string, string>;
  };
  packageJson.name = packageName;
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}
