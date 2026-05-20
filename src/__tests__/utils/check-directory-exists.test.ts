import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

// ---------------------------------------------------------------------------
// Mock fs.existsSync
// ---------------------------------------------------------------------------

mock.module("node:fs", {
  namedExports: {
    // Stub: return true for paths containing "existing", false otherwise.
    existsSync: mock.fn((p: string) => p.includes("existing")),
  },
});

// ---------------------------------------------------------------------------

const { default: checkDirectoryExists } =
  await import("../../utils/check-directory-exists.ts");

void describe("checkDirectoryExists", () => {
  void it("returns true when the directory exists", () => {
    // path.resolve("existing-project") → some absolute path containing "existing"
    assert.equal(checkDirectoryExists("existing-project"), true);
  });

  void it("returns false when the directory does not exist", () => {
    assert.equal(checkDirectoryExists("new-project"), false);
  });

  void it("returns false for a path that is not marked as existing", () => {
    assert.equal(checkDirectoryExists("my-brand-new-app"), false);
  });
});
