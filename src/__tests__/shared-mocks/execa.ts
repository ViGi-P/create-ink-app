import { mock } from "node:test";

mock.module("execa", {
  namedExports: {
    execa: mock.fn(() => ({ stdout: "execa output", exitCode: 0 })),
  },
});
