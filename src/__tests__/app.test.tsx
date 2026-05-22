import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

import "./shared-mocks/ink-stepper.tsx";
import "./shared-mocks/ink-text-input.tsx";
import "./shared-mocks/ink-select-input.tsx";
import "./shared-mocks/ink-task-list.tsx";
import "./shared-mocks/cli-spinners.ts";
import "./shared-mocks/make-dir.ts";
import "./shared-mocks/cpy.ts";
import "./shared-mocks/ink-gradient.tsx";
import "./shared-mocks/ink-link.tsx";
import "./shared-mocks/execa.ts";

// ---------------------------------------------------------------------------

const { default: App } = (await import("../app.tsx")) as unknown as {
  default: typeof import("../app.tsx").default;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

void describe("App", () => {
  void it("renders without crashing with empty argValues", async () => {
    const { lastFrame, unmount } = render(<App argValues={{}} />);
    await delay(50);
    assert.ok((lastFrame() ?? "").length > 0);
    unmount();
  });

  void it("renders the header text", async () => {
    const { lastFrame, unmount } = render(<App argValues={{}} />);
    await delay(50);
    assert.match(lastFrame() ?? "", /@vigi-p\/create-ink-app/);
    unmount();
  });

  void it("renders [ENTER] navigation hint in footer", async () => {
    const { lastFrame, unmount } = render(<App argValues={{}} />);
    await delay(50);
    assert.match(lastFrame() ?? "", /\[ENTER\]/);
    unmount();
  });

  void it("starts at step 0 (NameStep) when projectName is absent", async () => {
    const { lastFrame, unmount } = render(<App argValues={{}} />);
    await delay(50);
    assert.match(lastFrame() ?? "", /Project name:/);
    unmount();
  });

  void it("starts at step 1 (TypeStep) when projectName is present but type is absent", async () => {
    const { lastFrame, unmount } = render(
      <App argValues={{ projectName: "test-app" }} />,
    );
    await delay(50);
    assert.match(lastFrame() ?? "", /Template type:/);
    unmount();
  });

  void it("starts at step 2 (LanguageStep) when projectName+type present but language absent", async () => {
    const { lastFrame, unmount } = render(
      <App argValues={{ projectName: "test-app", type: "cli" }} />,
    );
    await delay(50);
    assert.match(lastFrame() ?? "", /Template language:/);
    unmount();
  });

  void it("starts at step 3 (InstallStep) when projectName+type+language present but install absent", async () => {
    const { lastFrame, unmount } = render(
      <App
        argValues={{
          projectName: "test-app",
          type: "cli",
          language: "ts",
        }}
      />,
    );
    await delay(50);
    assert.match(lastFrame() ?? "", /Install dependencies\?/);
    unmount();
  });

  void it("starts at step 4 (GitStep) when all fields present but git is absent", async () => {
    const { lastFrame, unmount } = render(
      <App
        argValues={{
          projectName: "test-app",
          type: "cli",
          language: "ts",
          pm: "npm",
          install: true,
        }}
      />,
    );
    await delay(50);
    assert.match(lastFrame() ?? "", /Initialize a git repository\?/);
    unmount();
  });

  void it("starts at step 0 (NameStep) when directory with projectName already exists", async () => {
    const { lastFrame, unmount } = render(
      <App
        argValues={{
          projectName: "src",
          type: "cli",
          language: "ts",
          pm: "npm",
          install: true,
        }}
      />,
    );
    await delay(50);
    assert.match(lastFrame() ?? "", /Project name:/);
    unmount();
  });

  void it("starts at step 5 (SetupStep) when all args are present", async () => {
    const { lastFrame, unmount } = render(
      <App
        argValues={{
          projectName: "test-app",
          type: "cli",
          language: "ts",
          pm: "npm",
          install: true,
          git: true,
        }}
      />,
    );
    await delay(50);
    assert.ok((lastFrame() ?? "").length > 0);
    unmount();
  });
});
