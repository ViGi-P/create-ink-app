import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";

export default async function updateTsconfigTypesArray(
  projectPath: string,
  newTypes: string[],
): Promise<void> {
  const tsconfigPath = path.join(projectPath, "tsconfig.json");
  const tsconfigJson = JSON.parse(await readFile(tsconfigPath, "utf8")) as {
    compilerOptions?: {
      types?: string[];
    };
  };

  const newTsconfigJson = {
    ...tsconfigJson,
    compilerOptions: {
      ...tsconfigJson.compilerOptions,
      types: Array.from(
        new Set([...(tsconfigJson.compilerOptions?.types ?? []), ...newTypes]),
      ),
    },
  };

  await writeFile(
    tsconfigPath,
    `${JSON.stringify(newTsconfigJson, null, 2)}\n`,
  );
}
