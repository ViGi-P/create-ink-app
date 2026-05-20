import assert from "node:assert/strict";
import { describe, it } from "node:test";
import "./_shared-mocks.tsx";
import { render } from "ink-testing-library";
import { Stepper } from "ink-stepper";

const { default: NameStep } =
  (await import("../../../components/stepper-section/steps/name-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/name-step.tsx").default;
  };

const WrappedStep = ({
  onChange,
  projectName,
}: {
  onChange: (name: string) => void;
  projectName?: string;
}) => (
  <Stepper onComplete={() => {}}>
    <NameStep onChange={onChange} projectName={projectName} />
  </Stepper>
);

void describe("NameStep", () => {
  void it("renders 'Project name:' label", () => {
    const { lastFrame, unmount } = render(<WrappedStep onChange={() => {}} />);
    assert.match(lastFrame() ?? "", /Project name:/);
    unmount();
  });

  void it("shows slugified name when a non-empty projectName is provided", () => {
    const { lastFrame, unmount } = render(
      <WrappedStep onChange={() => {}} projectName="My Awesome App" />,
    );
    assert.match(lastFrame() ?? "", /my-awesome-app/);
    unmount();
  });
});
