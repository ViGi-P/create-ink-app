import { execa } from "execa";
import type { AppProperties } from "../types/app-properties.type.ts";

export default async function installDependencies(
  projectPath: string,
  packageManager: Exclude<AppProperties["install"] & string, "skip">,
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

  let nodeMajorVersion: string | undefined;
  try {
    const { stdout: nodeVersionStdout } = await execa(`node`, ["-v"]);
    const nodeVersionMatch = nodeVersionStdout.match(/\d+\.\d+\.\d+/);
    const nodeVersion = nodeVersionMatch?.[0];
    nodeMajorVersion = nodeVersion?.split(".")[0];
    if (!nodeMajorVersion) {
      throw new Error(
        `Failed to find node version. Check if node is installed correctly.`,
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("ENOENT")) {
      throw new Error(
        `Failed to find node version. Check if node is installed correctly.`,
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
    switch (packageManager) {
      case "pnpm": {
        for await (const line of execa(
          packageManager,
          ["add", "-D", `@types/node@^${nodeMajorVersion}`],
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
          ["install", "-D", `@types/node@^${nodeMajorVersion}`],
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
          ["add", "-D", `@types/node@^${nodeMajorVersion}`],
          {
            cwd: projectPath,
          },
        )) {
          appendLine(line);
        }
        break;
      }
    }
  }
}
