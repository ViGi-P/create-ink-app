import assert from "node:assert/strict";
import { describe, it } from "node:test";
import "./_shared-mocks.tsx";
import { render } from "ink-testing-library";
import { Stepper } from "ink-stepper";

const { default: TypeStep } =
  (await import("../../../components/stepper-section/steps/type-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/type-step.tsx").default;
  };

const WrappedStep = ({ onChange }: { onChange: (type: string) => void }) => (
  <Stepper onComplete={() => {}}>
    <TypeStep onChange={onChange} />
  </Stepper>
);

void describe("TypeStep", () => {
  void it("renders 'Template type:' label", () => {
    const { lastFrame, unmount } = render(<WrappedStep onChange={() => {}} />);
    assert.match(lastFrame() ?? "", /Template type:/);
    unmount();
  });

  void it("renders Library and CLI options", () => {
    const { lastFrame, unmount } = render(<WrappedStep onChange={() => {}} />);
    const frame = lastFrame() ?? "";
    assert.match(frame, /Library/);
    assert.match(frame, /CLI/);
    unmount();
  });
});
