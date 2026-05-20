import { existsSync } from "node:fs";
import path from "node:path";

export default function checkDirectoryExists(projectName: string) {
  const directoryPath = path.resolve(projectName);

  return existsSync(directoryPath);
}
