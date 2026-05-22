import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

import "../../shared-mocks/ink-stepper.tsx";
import "../../shared-mocks/ink-select-input.tsx";

// ---------------------------------------------------------------------------

const { default: PMStep } =
  (await import("../../../components/stepper-section/steps/pm-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/pm-step.tsx").default;
  };

void describe("PMStep", () => {
  void it("renders 'Which package manager do you want to use??' label", () => {
    const { lastFrame, unmount } = render(<PMStep onChange={() => {}} />);
    assert.match(
      lastFrame() ?? "",
      /Which package manager do you want to use?\?/,
    );
    unmount();
  });

  void it("renders all package manager options", () => {
    const { lastFrame, unmount } = render(<PMStep onChange={() => {}} />);
    const frame = lastFrame() ?? "";
    assert.match(frame, /NPM/);
    assert.match(frame, /Yarn/);
    assert.match(frame, /PNPM/);
    assert.match(frame, /Bun/);
    unmount();
  });
});
