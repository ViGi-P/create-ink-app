import { mock } from "node:test";

mock.module("make-dir", {
  namedExports: { makeDirectory: mock.fn(async () => undefined) },
});
