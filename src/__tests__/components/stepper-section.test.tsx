import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

import "../shared-mocks/ink-stepper.tsx";
import "../shared-mocks/ink-scroll-view.tsx";
import "../shared-mocks/ink-text-input.tsx";
import "../shared-mocks/ink-select-input.tsx";
import "../shared-mocks/ink-task-list.tsx";
import "../shared-mocks/cli-spinners.ts";
import "../shared-mocks/make-dir.ts";
import "../shared-mocks/cpy.ts";

// ---------------------------------------------------------------------------

const { default: StepperSection } =
  (await import("../../components/stepper-section/index.tsx")) as unknown as {
    default: typeof import("../../components/stepper-section/index.tsx").default;
  };

const defaultArgValues = {
  projectName: "test-app",
  type: "cli" as const,
  language: "ts" as const,
  pm: "npm" as const,
  install: true as const,
  git: true,
};

void describe("StepperSection", () => {
  void it("renders without crashing", () => {
    const { lastFrame, unmount } = render(
      <StepperSection
        argValues={defaultArgValues}
        step={0}
        setStep={() => {}}
      />,
    );
    assert.ok(lastFrame() !== undefined);
    unmount();
  });

  void it("renders NameStep content at step 0", () => {
    const { lastFrame, unmount } = render(
      <StepperSection
        argValues={defaultArgValues}
        step={0}
        setStep={() => {}}
      />,
    );
    assert.match(lastFrame() ?? "", /Project name:/);
    unmount();
  });
});
