import assert from "node:assert/strict";
import { describe, it } from "node:test";
import "./_shared-mocks.tsx";
import { render } from "ink-testing-library";
import { Stepper } from "ink-stepper";

const { default: GitStep } =
  (await import("../../../components/stepper-section/steps/git-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/git-step.tsx").default;
  };

const WrappedStep = ({
  git,
  onChange,
}: {
  git?: boolean;
  onChange: (git: boolean) => void;
}) => (
  <Stepper onComplete={() => {}}>
    <GitStep onChange={onChange} git={git} />
  </Stepper>
);

void describe("GitStep", () => {
  void it("renders 'Initialize a git repository?' label", () => {
    const { lastFrame, unmount } = render(
      <WrappedStep git={false} onChange={() => {}} />,
    );
    assert.match(lastFrame() ?? "", /Initialize a git repository\?/);
    unmount();
  });

  void it("renders Yes and No options", () => {
    const { lastFrame, unmount } = render(
      <WrappedStep git={false} onChange={() => {}} />,
    );
    const frame = lastFrame() ?? "";
    assert.match(frame, /Yes/);
    assert.match(frame, /No/);
    unmount();
  });
});
