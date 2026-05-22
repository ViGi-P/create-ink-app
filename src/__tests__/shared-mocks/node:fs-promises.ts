import { mock } from "node:test";

const fakeFiles = new Map<string, string>();

mock.module("node:fs/promises", {
  namedExports: {
    rm: mock.fn(async () => {}),
    rename: mock.fn(async () => {}),
    readdir: mock.fn(async () => {
      return ["test.ts"];
    }),
    readFile: mock.fn(async (p: string) => {
      const content = fakeFiles.get(p);
      if (content !== undefined) return content;
      // return JSON.stringify({ name: "template" });
      throw new Error(`File not found: ${p}`);
    }),
    writeFile: mock.fn(async (p: string, data: string) => {
      fakeFiles.set(p, data);
    }),
  },
});

export { fakeFiles };
