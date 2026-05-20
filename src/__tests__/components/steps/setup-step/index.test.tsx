import assert from "node:assert/strict";
import { describe, it } from "node:test";
import "../_shared-mocks.tsx";
import { render } from "ink-testing-library";
import { Stepper } from "ink-stepper";

const baseValues = {
  projectName: "test-one",
  type: "cli" as const,
  language: "ts" as const,
  install: "skip" as const,
  git: true,
};

const { default: SetupStep } =
  (await import("../../../../components/stepper-section/steps/setup-step/index.tsx")) as unknown as {
    default: typeof import("../../../../components/stepper-section/steps/setup-step/index.tsx").default;
  };

const WrappedStep = ({
  current,
  values,
}: {
  current: boolean;
  values: typeof baseValues;
}) => (
  <Stepper onComplete={() => {}}>
    <SetupStep current={current} values={values} />
  </Stepper>
);

void describe("SetupStep (index)", () => {
  void it("renders nothing visible when current=false", () => {
    const { lastFrame, unmount } = render(
      <WrappedStep current={false} values={baseValues} />,
    );
    const frame = lastFrame() ?? "";
    assert.equal(frame.includes("Template setup"), false);
    unmount();
  });

  void it("renders task list items when current=true", () => {
    const { lastFrame, unmount } = render(
      <WrappedStep current={true} values={baseValues} />,
    );
    const frame = lastFrame() ?? "";
    assert.match(frame, /Template setup/);
    assert.match(frame, /Git setup/);
    assert.match(frame, /Installing dependencies/);
    unmount();
  });
});
