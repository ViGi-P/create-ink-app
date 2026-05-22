import { mock } from "node:test";

mock.module("cli-spinners", {
  defaultExport: { dots: { interval: 80, frames: ["."] } },
});
