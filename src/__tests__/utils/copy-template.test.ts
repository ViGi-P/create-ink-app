import assert from "node:assert/strict";

import path from "node:path";

import { beforeEach, describe, it, mock } from "node:test";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Track calls to the progress callback.
let capturedProgress: number[] = [];
let filesByPath = new Map<string, string>();
let writtenFiles: Array<[string, string]> = [];

const dirent = (name: string, type: "directory" | "file") => ({
  isDirectory: () => type === "directory",
  isFile: () => type === "file",
  name,
});

mock.module("node:fs/promises", {
  namedExports: {
    readFile: mock.fn(async (p: string) => filesByPath.get(p) ?? ""),
    readdir: mock.fn(
      async (p: string, options?: { withFileTypes?: boolean }) => {
        if (!options?.withFileTypes) {
          return ["app.test.tsx", "components"];
        }

        if (p.endsWith("src/__tests__")) {
          return [
            dirent("app.test.tsx", "file"),
            dirent("components", "directory"),
            dirent("node", "directory"),
          ];
        }

        if (p.endsWith("components")) {
          return [dirent("escape-key.test.tsx", "file")];
        }

        return [];
      },
    ),
    rm: mock.fn(async () => {}),
    rename: mock.fn(async () => {}),
    writeFile: mock.fn(async (p: string, data: string) => {
      writtenFiles.push([p, data]);
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
  void beforeEach(() => {
    capturedProgress = [];
    writtenFiles = [];
    filesByPath = new Map([
      [
        path.join("/tmp/dest", "src/__tests__/app.test.tsx"),
        [
          'import App from "../../app.tsx";',
          'const fixture = "../../fixtures/app.tsx";',
        ].join("\n"),
      ],
      [
        path.join("/tmp/dest", "src/__tests__/components/escape-key.test.tsx"),
        'import EscapeKey from "../../../components/escape-key.tsx";',
      ],
    ]);
  });

  void it("calls the progress callback with rounded percentages", async () => {
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

  void it("shortens relative import paths in moved test files by one parent directory", async () => {
    await copyTemplate("npm", "cli", "ts", "/tmp/dest", () => {});

    assert.deepEqual(writtenFiles, [
      [
        path.join("/tmp/dest", "src/__tests__/app.test.tsx"),
        [
          'import App from "../app.tsx";',
          'const fixture = "../../fixtures/app.tsx";',
        ].join("\n"),
      ],
      [
        path.join("/tmp/dest", "src/__tests__/components/escape-key.test.tsx"),
        'import EscapeKey from "../../components/escape-key.tsx";',
      ],
    ]);
  });
});
