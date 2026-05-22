import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

import "../../shared-mocks/ink-stepper.tsx";
import "../../shared-mocks/ink-select-input.tsx";

// ---------------------------------------------------------------------------

const { default: GitStep } =
  (await import("../../../components/stepper-section/steps/git-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/git-step.tsx").default;
  };

void describe("GitStep", () => {
  void it("renders 'Initialize a git repository?' label", () => {
    const { lastFrame, unmount } = render(
      <GitStep git={false} onChange={() => {}} />,
    );
    assert.match(lastFrame() ?? "", /Initialize a git repository\?/);
    unmount();
  });

  void it("renders Yes and No options", () => {
    const { lastFrame, unmount } = render(
      <GitStep git={false} onChange={() => {}} />,
    );
    const frame = lastFrame() ?? "";
    assert.match(frame, /Yes/);
    assert.match(frame, /No/);
    unmount();
  });
});
