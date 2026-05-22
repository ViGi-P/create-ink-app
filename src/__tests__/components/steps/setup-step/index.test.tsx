import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

import "../../../shared-mocks/ink-stepper.tsx";
import "../../../shared-mocks/ink-scroll-view.tsx";
import "../../../shared-mocks/ink-task-list.tsx";
import "../../../shared-mocks/cli-spinners.ts";
import "../../../shared-mocks/make-dir.ts";
import "../../../shared-mocks/cpy.ts";
import "../../../shared-mocks/node:fs-promises.ts";
import "../../../shared-mocks/execa.ts";

// ---------------------------------------------------------------------------

const baseValues = {
  projectName: "test-one",
  type: "cli" as const,
  language: "ts" as const,
  pm: "npm" as const,
  install: false as const,
  git: true,
};

const { default: SetupStep } =
  (await import("../../../../components/stepper-section/steps/setup-step/index.tsx")) as unknown as {
    default: typeof import("../../../../components/stepper-section/steps/setup-step/index.tsx").default;
  };

void describe("SetupStep (index)", () => {
  void it("renders nothing visible when current=false", () => {
    const { lastFrame, unmount } = render(
      <SetupStep current={false} values={baseValues} />,
    );
    const frame = lastFrame() ?? "";
    assert.equal(frame.includes("Template setup"), false);
    unmount();
  });

  void it("renders task list items when current=true", () => {
    const { lastFrame, unmount } = render(
      <SetupStep current={true} values={baseValues} />,
    );
    const frame = lastFrame() ?? "";
    assert.match(frame, /Template setup/);
    assert.match(frame, /Git setup/);
    assert.match(frame, /Installing dependencies/);
    unmount();
  });
});
