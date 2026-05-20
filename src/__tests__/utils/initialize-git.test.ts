import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

// ---------------------------------------------------------------------------
// Mock execa before importing the module under test.
// ---------------------------------------------------------------------------

mock.module("execa", {
  namedExports: {
    execa: mock.fn(() => Promise.resolve({ stdout: "", stderr: "" })),
  },
});

// ---------------------------------------------------------------------------

const { default: initializeGit } =
  await import("../../utils/initialize-git.ts");

void describe("initializeGit", () => {
  void it("resolves without throwing for a valid project path", async () => {
    await assert.doesNotReject(() => initializeGit("/tmp/my-project"));
  });

  void it("resolves for any path string", async () => {
    await assert.doesNotReject(() =>
      initializeGit("/home/user/projects/test-app"),
    );
  });
});
