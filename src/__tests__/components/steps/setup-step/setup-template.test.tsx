import assert from "node:assert/strict";
import { describe, it } from "node:test";
import "../_shared-mocks.tsx";
import { TaskList } from "ink-task-list";
import { render } from "ink-testing-library";

const defaultProps = {
  projectName: "test-four",
  type: "cli" as const,
  language: "ts" as const,
  git: true,
  install: "npm" as const,
  onFinish: () => {},
  start: false,
};

const { default: SetupTemplate } =
  (await import("../../../../components/stepper-section/steps/setup-step/setup-template.tsx")) as unknown as {
    default: typeof import("../../../../components/stepper-section/steps/setup-step/setup-template.tsx").default;
  };

const WrappedSetupTemplate = ({
  overrides = {},
}: {
  overrides?: Partial<typeof SetupTemplate>;
}) => (
  <TaskList>
    <SetupTemplate {...defaultProps} {...overrides} />
  </TaskList>
);

void describe("SetupTemplate", () => {
  void it("renders 'Template setup' task label", () => {
    const { lastFrame, unmount } = render(<WrappedSetupTemplate />);
    assert.match(lastFrame() ?? "", /Template setup/);
    unmount();
  });

  void it("shows 'Creating directory' in initial output", () => {
    const { lastFrame, unmount } = render(<WrappedSetupTemplate />);
    assert.match(lastFrame() ?? "", /Creating directory/);
    unmount();
  });

  void it("renders in loading state initially", () => {
    const { lastFrame, unmount } = render(<WrappedSetupTemplate />);
    assert.match(lastFrame() ?? "", /\[loading\]/);
    unmount();
  });

  void it("calls onFinish after running (start=true)", async () => {
    let finished = false;
    const { unmount } = render(
      <WrappedSetupTemplate
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
    unmount();
  });
});
