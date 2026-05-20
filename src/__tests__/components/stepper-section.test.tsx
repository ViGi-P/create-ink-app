import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import React from "react";
import { Text, Box } from "ink";
import { render } from "ink-testing-library";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

mock.module("ink-stepper", {
  namedExports: {
    Stepper: ({
      children,
      renderProgress,
    }: {
      children: React.ReactNode;
      step: number;
      onStepChange: (n: number) => void;
      renderProgress: (args: {
        steps: { name: string; completed: boolean; current: boolean }[];
      }) => React.ReactNode;
      onComplete: () => void;
      onCancel: () => void;
    }) => (
      <>
        {renderProgress({ steps: [] })}
        {children}
      </>
    ),
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
      <>{children}</>
    ),
    useStepperInput: () => ({
      disableNavigation: mock.fn(),
      enableNavigation: mock.fn(),
    }),
  },
});

mock.module("ink-text-input", {
  defaultExport: ({
    value,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => <Text>{value}</Text>,
});

mock.module("ink-select-input", {
  defaultExport: ({
    items,
  }: {
    items: { value: unknown; label: string }[];
    initialIndex?: number;
    onSelect: (item: { value: unknown; label: string }) => void;
  }) => (
    <Box flexDirection="column">
      {items.map((item, i) => (
        <Text key={i}>{item.label}</Text>
      ))}
    </Box>
  ),
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
  namedExports: { makeDirectory: mock.fn(async () => undefined) },
});
mock.module("cpy", {
  defaultExport: mock.fn(async () => undefined),
});

// ---------------------------------------------------------------------------

const { default: StepperSection } =
  (await import("../../components/stepper-section/index.tsx")) as unknown as {
    default: typeof import("../../components/stepper-section/index.tsx").default;
  };

const defaultArgValues = {
  projectName: "test-app",
  type: "cli" as const,
  language: "ts" as const,
  install: "npm" as const,
  git: true,
};

void describe("StepperSection", () => {
  void it("renders without crashing", () => {
    const { lastFrame, unmount } = render(
      <StepperSection
        argValues={defaultArgValues}
        step={0}
        setStep={() => {}}
      />,
    );
    assert.ok(lastFrame() !== undefined);
    unmount();
  });

  void it("renders NameStep content at step 0", () => {
    const { lastFrame, unmount } = render(
      <StepperSection
        argValues={defaultArgValues}
        step={0}
        setStep={() => {}}
      />,
    );
    assert.match(lastFrame() ?? "", /Project name:/);
    unmount();
  });
});
