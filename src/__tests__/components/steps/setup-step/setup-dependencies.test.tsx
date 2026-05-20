import assert from "node:assert/strict";
import { describe, it } from "node:test";
import "../_shared-mocks.tsx";
import { render } from "ink-testing-library";
import { TaskList } from "ink-task-list";

const defaultProps = {
  projectName: "test-two",
  install: "skip" as const,
  language: "ts" as const,
  onFinish: () => {},
  start: false,
};

const { default: SetupDependencies } =
  (await import("../../../../components/stepper-section/steps/setup-step/setup-dependencies.tsx")) as unknown as {
    default: typeof import("../../../../components/stepper-section/steps/setup-step/setup-dependencies.tsx").default;
  };

const WrappedSetupDependencies = ({
  overrides = {},
}: {
  overrides?: Partial<typeof SetupDependencies>;
}) => (
  <TaskList>
    <SetupDependencies {...defaultProps} {...overrides} />
  </TaskList>
);

void describe("SetupDependencies", () => {
  void it("renders 'Installing dependencies' task label", () => {
    const { lastFrame, unmount } = render(<WrappedSetupDependencies />);
    assert.match(lastFrame() ?? "", /Installing dependencies/);
    unmount();
  });

  void it("renders in loading state initially", () => {
    const { lastFrame, unmount } = render(<WrappedSetupDependencies />);
    assert.match(lastFrame() ?? "", /\[loading\]/);
    unmount();
  });

  void it("calls onFinish and shows 'Skipped' when install=skip", async () => {
    let finished = false;
    const { lastFrame, unmount } = render(
      <WrappedSetupDependencies
        overrides={{
          start: true,
          onFinish: () => {
            finished = true;
          },
        }}
      />,
    );
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(finished, true);
    assert.match(lastFrame() ?? "", /Skipped/);
    unmount();
  });
});
