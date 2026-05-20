import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import React from "react";
import { Box, Text } from "ink";
import { render } from "ink-testing-library";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

mock.module("ink-stepper", {
  namedExports: {
    Step: ({
      children,
    }: {
      children: React.ReactNode;
      name: string;
      canProceed?: boolean;
    }) => <>{children}</>,
    useStepperInput: () => ({
      disableNavigation: mock.fn(),
      enableNavigation: mock.fn(),
    }),
  },
});

mock.module("ink-scroll-view", {
  namedExports: {
    ScrollView: ({ children }: { children: React.ReactNode }) => (
      <Box flexDirection="column">{children}</Box>
    ),
  },
});

mock.module("ink-task-list", {
  namedExports: {
    TaskList: ({ children }: { children: React.ReactNode }) => (
      <Box flexDirection="column">{children}</Box>
    ),
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

mock.module("execa", {
  namedExports: {
    execa: mock.fn(async () => ({ stdout: "", exitCode: 0 })),
  },
});

// ---------------------------------------------------------------------------

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

void describe("SetupStep (index)", () => {
  void it("renders nothing visible when current=false", () => {
    const { lastFrame, unmount } = render(
      <SetupStep current={false} values={baseValues} />,
    );
    const frame = lastFrame() ?? "";
    assert.equal(frame.includes("Template setup"), false);
    unmount();
  });

  void it("renders task list items when current=true", () => {
    const { lastFrame, unmount } = render(
      <SetupStep current={true} values={baseValues} />,
    );
    const frame = lastFrame() ?? "";
    assert.match(frame, /Template setup/);
    assert.match(frame, /Git setup/);
    assert.match(frame, /Installing dependencies/);
    unmount();
  });
});
