import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

import "../../shared-mocks/ink-stepper.tsx";
import "../../shared-mocks/ink-select-input.tsx";

// ---------------------------------------------------------------------------

const { default: TypeStep } =
  (await import("../../../components/stepper-section/steps/type-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/type-step.tsx").default;
  };

void describe("TypeStep", () => {
  void it("renders 'Template type:' label", () => {
    const { lastFrame, unmount } = render(<TypeStep onChange={() => {}} />);
    assert.match(lastFrame() ?? "", /Template type:/);
    unmount();
  });

  void it("renders Library and CLI options", () => {
    const { lastFrame, unmount } = render(<TypeStep onChange={() => {}} />);
    const frame = lastFrame() ?? "";
    assert.match(frame, /Library/);
    assert.match(frame, /CLI/);
    unmount();
  });
});
