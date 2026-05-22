import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

import "../../../shared-mocks/ink-task-list.tsx";
import "../../../shared-mocks/cli-spinners.ts";

// ---------------------------------------------------------------------------

const defaultProps = {
  projectName: "test-two",
  pm: "npm" as const,
  install: false as const,
  language: "ts" as const,
  onFinish: () => {},
  scrollDown: () => {},
  start: false,
};

const { default: SetupDependencies } =
  (await import("../../../../components/stepper-section/steps/setup-step/setup-dependencies.tsx")) as unknown as {
    default: typeof import("../../../../components/stepper-section/steps/setup-step/setup-dependencies.tsx").default;
  };

void describe("SetupDependencies", () => {
  void it("renders 'Installing dependencies' task label", () => {
    const { lastFrame, unmount } = render(
      <SetupDependencies {...defaultProps} />,
    );
    assert.match(lastFrame() ?? "", /Installing dependencies/);
    unmount();
  });

  void it("renders in loading state initially", () => {
    const { lastFrame, unmount } = render(
      <SetupDependencies {...defaultProps} />,
    );
    assert.match(lastFrame() ?? "", /\[loading\]/);
    unmount();
  });

  void it("calls onFinish and shows 'Skipped' when install=skip", async () => {
    let finished = false;
    const { lastFrame, unmount } = render(
      <SetupDependencies
        {...defaultProps}
        start
        onFinish={() => {
          finished = true;
        }}
      />,
    );
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(finished, true);
    assert.match(lastFrame() ?? "", /Skipped/);
    unmount();
  });
});
