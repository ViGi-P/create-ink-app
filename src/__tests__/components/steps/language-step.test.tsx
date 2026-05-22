import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

import "../../shared-mocks/ink-stepper.tsx";
import "../../shared-mocks/ink-select-input.tsx";

// ---------------------------------------------------------------------------

const { default: LanguageStep } =
  (await import("../../../components/stepper-section/steps/language-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/language-step.tsx").default;
  };

void describe("LanguageStep", () => {
  void it("renders 'Template language:' label", () => {
    const { lastFrame, unmount } = render(<LanguageStep onChange={() => {}} />);
    assert.match(lastFrame() ?? "", /Template language:/);
    unmount();
  });

  void it("renders JavaScript and TypeScript options", () => {
    const { lastFrame, unmount } = render(<LanguageStep onChange={() => {}} />);
    const frame = lastFrame() ?? "";
    assert.match(frame, /JavaScript/);
    assert.match(frame, /TypeScript/);
    unmount();
  });
});
