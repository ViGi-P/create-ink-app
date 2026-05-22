import { execa } from "execa";
import type { AppProperties } from "../types/app-properties.type.ts";
import updateTsconfigTypesArray from "./update-tsconfig-types-array.ts";

export default async function installDependencies(
  projectPath: string,
  packageManager: AppProperties["pm"] & string,
  language: AppProperties["language"] & string,
  appendLine: (line: string) => void,
): Promise<void> {
  try {
    const { stdout: packageManagerVersionStdout } = await execa(
      packageManager,
      ["-v"],
    );
    const packageManagerVersionMatch =
      packageManagerVersionStdout.match(/\d+\.\d+\.\d+/);
    const packageManagerVersion = packageManagerVersionMatch?.[0];
    if (!packageManagerVersion) {
      throw new Error(
        `Failed to find ${packageManager} version. Check if ${packageManager} is installed correctly.`,
      );
    }

    appendLine(`Using ${packageManager} version ${packageManagerVersion}`);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("ENOENT")) {
      throw new Error(
        `Failed to find ${packageManager} version. Check if ${packageManager} is installed correctly.`,
      );
    }
    throw error;
  }

  let runtimeMajorVersion: string | undefined;
  try {
    const { stdout: runtimeVersionStdout } = await execa(
      packageManager === "bun" ? "bun" : "node",
      ["-v"],
    );
    const runtimeVersionMatch = runtimeVersionStdout.match(/\d+\.\d+\.\d+/);
    const runtimeVersion = runtimeVersionMatch?.[0];
    if (packageManager === "bun") {
      runtimeMajorVersion = runtimeVersion; // Bun versions are usually full versions for @types/bun (e.g. ^1.1.0)
    } else {
      runtimeMajorVersion = runtimeVersion?.split(".")[0];
    }
    if (!runtimeMajorVersion) {
      throw new Error(
        `Failed to find ${packageManager === "bun" ? "bun" : "node"} version. Check if it is installed correctly.`,
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("ENOENT")) {
      throw new Error(
        `Failed to find ${packageManager === "bun" ? "bun" : "node"} version. Check if it is installed correctly.`,
      );
    }
    throw error;
  }

  const installArgs = packageManager === "yarn" ? [] : ["install"];

  for await (const line of execa(packageManager, installArgs, {
    cwd: projectPath,
  })) {
    appendLine(line);
  }

  if (language === "ts") {
    const typesPackage =
      packageManager === "bun"
        ? `@types/bun@^${runtimeMajorVersion}`
        : `@types/node@^${runtimeMajorVersion}`;

    switch (packageManager) {
      case "pnpm": {
        for await (const line of execa(
          packageManager,
          ["add", "-D", typesPackage],
          {
            cwd: projectPath,
          },
        )) {
          appendLine(line);
        }
        break;
      }

      case "npm": {
        for await (const line of execa(
          packageManager,
          ["install", "-D", typesPackage],
          {
            cwd: projectPath,
          },
        )) {
          appendLine(line);
        }
        break;
      }

      case "yarn": {
        for await (const line of execa(
          packageManager,
          ["add", "-D", typesPackage],
          {
            cwd: projectPath,
          },
        )) {
          appendLine(line);
        }
        break;
      }

      case "bun": {
        for await (const line of execa(
          packageManager,
          ["add", "-D", typesPackage],
          {
            cwd: projectPath,
          },
        )) {
          appendLine(line);
        }
        await updateTsconfigTypesArray(projectPath, ["bun"]);
        break;
      }
    }
  }
}
