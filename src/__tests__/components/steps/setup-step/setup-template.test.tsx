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

mock.module("make-dir", {
  namedExports: {
    makeDirectory: mock.fn(async () => undefined),
  },
});

mock.module("cpy", {
  defaultExport: mock.fn(async () => undefined),
});

const fakeFiles = new Map<string, string>();

mock.module("node:fs/promises", {
  namedExports: {
    readFile: mock.fn(async (p: string) => {
      const content = fakeFiles.get(p);
      if (content !== undefined) return content;
      return JSON.stringify({ name: "template" });
    }),
    writeFile: mock.fn(async (p: string, data: string) => {
      fakeFiles.set(p, data);
    }),
  },
});

// ---------------------------------------------------------------------------

const defaultProps = {
  projectName: "test-four",
  type: "cli" as const,
  language: "ts" as const,
  git: true,
  pm: "npm" as const,
  install: true as const,
  onFinish: () => {},
  start: false,
};

const { default: SetupTemplate } =
  (await import("../../../../components/stepper-section/steps/setup-step/setup-template.tsx")) as unknown as {
    default: typeof import("../../../../components/stepper-section/steps/setup-step/setup-template.tsx").default;
  };

void describe("SetupTemplate", () => {
  void it("renders 'Template setup' task label", () => {
    const { lastFrame, unmount } = render(<SetupTemplate {...defaultProps} />);
    assert.match(lastFrame() ?? "", /Template setup/);
    unmount();
  });

  void it("shows 'Creating directory' in initial output", () => {
    const { lastFrame, unmount } = render(<SetupTemplate {...defaultProps} />);
    assert.match(lastFrame() ?? "", /Creating directory/);
    unmount();
  });

  void it("renders in loading state initially", () => {
    const { lastFrame, unmount } = render(<SetupTemplate {...defaultProps} />);
    assert.match(lastFrame() ?? "", /\[loading\]/);
    unmount();
  });

  void it("calls onFinish after running (start=true)", async () => {
    let finished = false;
    const { unmount } = render(
      <SetupTemplate
        {...defaultProps}
        start
        onFinish={() => {
          finished = true;
        }}
      />,
    );
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(finished, true);
    unmount();
  });
});
