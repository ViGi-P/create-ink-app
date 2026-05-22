import { mock } from "node:test";

mock.module("node:fs", {
  namedExports: {
    // Stub: return true for paths containing "existing", false otherwise.
    existsSync: mock.fn((p: string) => p.includes("existing")),
  },
});
