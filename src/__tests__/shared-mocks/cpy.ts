import { mock } from "node:test";

mock.module("cpy", {
  defaultExport: mock.fn(async () => undefined),
});
