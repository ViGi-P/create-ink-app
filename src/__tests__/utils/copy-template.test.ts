import assert from "node:assert/strict";

import { describe, it, mock } from "node:test";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Track calls to the progress callback.
let capturedProgress: number[] = [];

mock.module("node:fs/promises", {
  namedExports: {
    rm: mock.fn(async () => {}),
    rename: mock.fn(async () => {}),
    readdir: mock.fn(async () => {
      return ["test.ts"];
    }),
  },
});
mock.module("cpy", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultExport: mock.fn(async (_src: unknown, _dest: unknown, opts: any) => {
    // Simulate two file-copy progress events.
    opts.onProgress({ totalFiles: 2, completedFiles: 1 });
    opts.onProgress({ totalFiles: 2, completedFiles: 2 });
  }),
});

// ---------------------------------------------------------------------------

const { default: copyTemplate } = await import("../../utils/copy-template.ts");

void describe("copyTemplate", () => {
  void it("calls the progress callback with rounded percentages", async () => {
    capturedProgress = [];
    await copyTemplate("npm", "cli", "ts", "/tmp/dest", (pct) => {
      capturedProgress.push(pct);
    });

    assert.deepEqual(capturedProgress, [50, 100]);
  });

  void it("resolves for all valid type/language combinations", async () => {
    const combinations: Array<["library" | "cli", "js" | "ts"]> = [
      ["library", "js"],
      ["library", "ts"],
      ["cli", "js"],
      ["cli", "ts"],
    ];
    for (const [type, language] of combinations) {
      await assert.doesNotReject(() =>
        copyTemplate("npm", type, language, "/tmp/dest", () => {}),
      );
    }
  });
});
