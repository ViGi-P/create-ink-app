import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// In-memory package.json stored per path.
const fakeFiles = new Map<string, string>();

mock.module("node:fs/promises", {
  namedExports: {
    readFile: mock.fn(async (p: string) => {
      const content = fakeFiles.get(p);
      if (content === undefined) throw new Error(`File not found: ${p}`);
      return content;
    }),
    writeFile: mock.fn(async (p: string, data: string) => {
      fakeFiles.set(p, data);
    }),
  },
});

// ---------------------------------------------------------------------------

const { default: updatePackageJSON } =
  await import("../../utils/update-package-json.ts");

void describe("updatePackageJSON", () => {
  void it("sets the name field in package.json", async () => {
    const projectPath = "/tmp/my-project";
    const pkgPath = `${projectPath}/package.json`;
    fakeFiles.set(
      pkgPath,
      JSON.stringify({ name: "old-name", version: "1.0.0" }),
    );

    await updatePackageJSON(projectPath, "new-name");

    const updated = JSON.parse(fakeFiles.get(pkgPath) ?? "{}") as {
      name: string;
    };
    assert.equal(updated.name, "new-name");
  });

  void it("preserves other fields when updating name", async () => {
    const projectPath = "/tmp/preserve-project";
    const pkgPath = `${projectPath}/package.json`;
    fakeFiles.set(
      pkgPath,
      JSON.stringify({
        name: "old",
        version: "2.0.0",
        scripts: { start: "node index.js" },
      }),
    );

    await updatePackageJSON(projectPath, "preserved");

    const updated = JSON.parse(fakeFiles.get(pkgPath) ?? "{}") as {
      name: string;
      version: string;
      scripts: Record<string, string>;
    };
    assert.equal(updated.name, "preserved");
    assert.equal(updated.version, "2.0.0");
    assert.equal(updated.scripts.start, "node index.js");
  });

  void it("writes valid JSON with a trailing newline", async () => {
    const projectPath = "/tmp/newline-project";
    const pkgPath = `${projectPath}/package.json`;
    fakeFiles.set(pkgPath, JSON.stringify({ name: "x" }));

    await updatePackageJSON(projectPath, "y");

    const raw = fakeFiles.get(pkgPath) ?? "";
    assert.ok(raw.endsWith("\n"), "file should end with a newline");
    assert.doesNotThrow(() => JSON.parse(raw));
  });
});
