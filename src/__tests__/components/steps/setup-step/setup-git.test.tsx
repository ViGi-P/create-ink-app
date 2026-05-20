import assert from "node:assert/strict";
import { describe, it } from "node:test";
import "../_shared-mocks.tsx";
import { render } from "ink-testing-library";
import { TaskList } from "ink-task-list";

const defaultProps = {
  projectName: "test-three",
  git: true,
  onFinish: () => {},
  start: false,
};

const { default: SetupGit } =
  (await import("../../../../components/stepper-section/steps/setup-step/setup-git.tsx")) as unknown as {
    default: typeof import("../../../../components/stepper-section/steps/setup-step/setup-git.tsx").default;
  };

const WrappedSetupGit = ({
  overrides = {},
}: {
  overrides?: Partial<typeof SetupGit>;
}) => {
  return (
    <TaskList>
      <SetupGit {...{ ...defaultProps, ...overrides }} />
    </TaskList>
  );
};

void describe("SetupGit", () => {
  void it("renders 'Git setup' task label", () => {
    const { lastFrame, unmount } = render(<WrappedSetupGit />);
    assert.match(lastFrame() ?? "", /Git setup/);
    unmount();
  });

  void it("renders in loading state initially", () => {
    const { lastFrame, unmount } = render(<WrappedSetupGit />);
    assert.match(lastFrame() ?? "", /\[loading\]/);
    unmount();
  });

  void it("calls onFinish after successful git init (start=true, git=true)", async () => {
    let finished = false;
    const { unmount } = render(
      <WrappedSetupGit
        overrides={{
          start: true,
          git: true,
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

  void it("calls onFinish and shows 'Skipped' when git=false", async () => {
    let finished = false;
    const { lastFrame, unmount } = render(
      <WrappedSetupGit
        overrides={{
          start: true,
          git: false,
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
