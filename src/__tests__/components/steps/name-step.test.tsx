import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

import "../../shared-mocks/ink-stepper.tsx";
import "../../shared-mocks/ink-text-input.tsx";

// ---------------------------------------------------------------------------

const { default: NameStep } =
  (await import("../../../components/stepper-section/steps/name-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/name-step.tsx").default;
  };

void describe("NameStep", () => {
  void it("renders 'Project name:' label", () => {
    const { lastFrame, unmount } = render(<NameStep onChange={() => {}} />);
    assert.match(lastFrame() ?? "", /Project name:/);
    unmount();
  });

  void it("shows slugified name when a non-empty projectName is provided", () => {
    const { lastFrame, unmount } = render(
      <NameStep onChange={() => {}} projectName="My Awesome App" />,
    );
    assert.match(lastFrame() ?? "", /my-awesome-app/);
    unmount();
  });
});
