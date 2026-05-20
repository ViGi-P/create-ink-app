import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { Text } from "ink";
import { render } from "ink-testing-library";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

mock.module("ink-task-list", {
  namedExports: {
    Task: ({
      label,
      state,
    }: {
      label: string;
      state: string;
      spinner?: unknown;
    }) => <Text>{`${label} [${state}]`}</Text>,
  },
});

mock.module("cli-spinners", {
  defaultExport: { dots: { interval: 80, frames: ["."] } },
});

// ---------------------------------------------------------------------------

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

void describe("SetupDependencies", () => {
  void it("renders 'Installing dependencies' task label", () => {
    const { lastFrame, unmount } = render(
      <SetupDependencies {...defaultProps} />,
    );
    assert.match(lastFrame() ?? "", /Installing dependencies/);
    unmount();
  });

  void it("renders in loading state initially", () => {
    const { lastFrame, unmount } = render(
      <SetupDependencies {...defaultProps} />,
    );
    assert.match(lastFrame() ?? "", /\[loading\]/);
    unmount();
  });

  void it("calls onFinish and shows 'Skipped' when install=skip", async () => {
    let finished = false;
    const { lastFrame, unmount } = render(
      <SetupDependencies
        {...defaultProps}
        start
        onFinish={() => {
          finished = true;
        }}
      />,
    );
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(finished, true);
    assert.match(lastFrame() ?? "", /Skipped/);
    unmount();
  });
});
