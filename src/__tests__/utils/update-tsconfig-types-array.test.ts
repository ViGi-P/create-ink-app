import assert from "node:assert/strict";
import { describe, it } from "node:test";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

import { fakeFiles } from "../shared-mocks/node:fs-promises.ts";

// ---------------------------------------------------------------------------

const { default: updateTsconfigTypesArray } =
  await import("../../utils/update-tsconfig-types-array.ts");

void describe("updateTsconfigTypesArray", () => {
  void it('sets the types field in tsconfig.json "compilerOptions"', async () => {
    const projectPath = "/tmp/my-project";
    const tsconfigPath = `${projectPath}/tsconfig.json`;
    fakeFiles.set(
      tsconfigPath,
      JSON.stringify({ compilerOptions: { types: [] } }),
    );

    await updateTsconfigTypesArray(projectPath, ["bun"]);

    const updated = JSON.parse(fakeFiles.get(tsconfigPath) ?? "{}") as {
      compilerOptions: { types: string[] };
    };
    assert.equal(updated.compilerOptions.types.includes("bun"), true);
  });

  void it("preserves other fields when updating types", async () => {
    const projectPath = "/tmp/preserve-project";
    const tsconfigPath = `${projectPath}/tsconfig.json`;
    fakeFiles.set(
      tsconfigPath,
      JSON.stringify({
        compilerOptions: {
          types: [],
          outDir: "dist",
        },
      }),
    );

    await updateTsconfigTypesArray(projectPath, ["bun"]);

    const updated = JSON.parse(fakeFiles.get(tsconfigPath) ?? "{}") as {
      compilerOptions: {
        types: string[];
        outDir: string;
      };
    };

    assert.equal(updated.compilerOptions.outDir, "dist");
    assert.equal(updated.compilerOptions.types.includes("bun"), true);
  });

  void it("writes valid JSON with a trailing newline", async () => {
    const projectPath = "/tmp/newline-project";
    const tsconfigPath = `${projectPath}/tsconfig.json`;
    fakeFiles.set(
      tsconfigPath,
      JSON.stringify({
        compilerOptions: {
          types: [],
          outDir: "dist",
        },
      }),
    );

    await updateTsconfigTypesArray(projectPath, ["bun"]);

    const raw = fakeFiles.get(tsconfigPath) ?? "";

    assert.ok(raw.endsWith("\n"), "file should end with a newline");
    assert.doesNotThrow(() => JSON.parse(raw));
  });
});
