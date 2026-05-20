import { execa } from "execa";

export default async function initializeGit(
  projectPath: string,
): Promise<void> {
  await execa("git", ["init"], { cwd: projectPath, stdio: "ignore" });
}
