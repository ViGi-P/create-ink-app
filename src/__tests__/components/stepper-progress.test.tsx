import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";
import StepperProgress from "../../components/stepper-section/stepper-progress.tsx";

const makeSteps = (
  overrides: Partial<{ name: string; completed: boolean; current: boolean }>[],
) =>
  overrides.map((o) => ({
    name: o.name ?? "Step",
    completed: o.completed ?? false,
    current: o.current ?? false,
  }));

void describe("StepperProgress", () => {
  void it("renders all step names", () => {
    const steps = makeSteps([
      { name: "Name" },
      { name: "Type" },
      { name: "Language" },
    ]);
    const { lastFrame, unmount } = render(<StepperProgress steps={steps} />);
    const frame = lastFrame() ?? "";
    assert.match(frame, /Name/);
    assert.match(frame, /Type/);
    assert.match(frame, /Language/);
    unmount();
  });

  void it("shows ✔ for completed steps", () => {
    const steps = makeSteps([{ name: "Done", completed: true }]);
    const { lastFrame, unmount } = render(<StepperProgress steps={steps} />);
    assert.match(lastFrame() ?? "", /✔/);
    unmount();
  });

  void it("shows ● for the current step", () => {
    const steps = makeSteps([{ name: "Active", current: true }]);
    const { lastFrame, unmount } = render(<StepperProgress steps={steps} />);
    assert.match(lastFrame() ?? "", /●/);
    unmount();
  });

  void it("shows ○ for a future (pending) step", () => {
    const steps = makeSteps([{ name: "Pending" }]);
    const { lastFrame, unmount } = render(<StepperProgress steps={steps} />);
    assert.match(lastFrame() ?? "", /○/);
    unmount();
  });
});
