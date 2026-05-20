import assert from "node:assert/strict";
import { describe, it, mock, beforeEach } from "node:test";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const DEFAULT_VERSIONS: Record<string, string> = {
  npm: "10.9.2",
  yarn: "1.22.22",
  pnpm: "9.15.4",
  node: "22.13.0", // Changed from "v22.13.0" to match /\b\d+\.\d+\.\d+\b/ regex boundary
};

let currentVersions = { ...DEFAULT_VERSIONS };

function buildExeca() {
  function makeResult(stdout: string) {
    return Object.assign(Promise.resolve({ stdout }), {
      [Symbol.asyncIterator]: async function* () {
        // Yield nothing — install output isn't tested here.
      },
    });
  }

  function fakeExeca(
    stringsOrOpts: TemplateStringsArray | Record<string, unknown>,
    ...values: unknown[]
  ): ReturnType<typeof makeResult> | typeof fakeExeca {
    if (!Array.isArray(stringsOrOpts)) {
      return fakeExeca as typeof fakeExeca;
    }

    const cmd = (stringsOrOpts as TemplateStringsArray)
      .reduce((acc, part, i) => acc + part + (values[i] ?? ""), "")
      .trim();

    const firstWord = cmd.split(/\s+/)[0] ?? "";
    const stdout = currentVersions[firstWord] ?? "";
    return makeResult(stdout);
  }

  return fakeExeca;
}

mock.module("execa", {
  namedExports: { execa: buildExeca() },
});

const { default: installDependencies } =
  await import("../../utils/install-dependencies.ts");

// ---------------------------------------------------------------------------

void describe("installDependencies", () => {
  beforeEach(() => {
    currentVersions = { ...DEFAULT_VERSIONS };
  });

  void it("appends a version line for npm (js project)", async () => {
    const lines: string[] = [];
    await installDependencies("/tmp/proj", "npm", "js", (l) => lines.push(l));
    assert.ok(
      lines.some((l) => l.includes("npm") && l.includes("10.9.2")),
      `Expected npm version line; got: ${JSON.stringify(lines)}`,
    );
  });

  void it("appends a version line for yarn (ts project)", async () => {
    const lines: string[] = [];
    await installDependencies("/tmp/proj", "yarn", "ts", (l) => lines.push(l));
    assert.ok(lines.some((l) => l.includes("yarn") && l.includes("1.22.22")));
  });

  void it("appends a version line for pnpm (ts project)", async () => {
    const lines: string[] = [];
    await installDependencies("/tmp/proj", "pnpm", "ts", (l) => lines.push(l));
    assert.ok(lines.some((l) => l.includes("pnpm") && l.includes("9.15.4")));
  });

  void it("throws when the package manager version string is missing", async () => {
    currentVersions = {
      npm: "not-a-version",
      node: "22.13.0",
      yarn: "",
      pnpm: "",
    };
    await assert.rejects(
      () => installDependencies("/tmp/proj", "npm", "js", () => {}),
      /Failed to find npm version/,
    );
  });

  void it("throws when the node version string is missing", async () => {
    currentVersions = { npm: "10.9.2", node: "not-valid", yarn: "", pnpm: "" };
    await assert.rejects(
      () => installDependencies("/tmp/proj", "npm", "js", () => {}),
      /Failed to find node version/,
    );
  });
});
