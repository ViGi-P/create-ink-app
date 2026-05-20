/**
 * Shared mock setup for step component tests.
 *
 * Must be imported BEFORE any component import so that mock.module runs first.
 * All step tests in this directory share these mocks through the module cache.
 *
 * NOTE: Only mocks for npm packages are registered here (the specifiers are
 * stable regardless of which file imports them). Relative-path mocks (e.g.
 * utils) must be registered in each individual test file.
 */
import { mock } from "node:test";
import React from "react";
import { Text, Box } from "ink";

// ---------------------------------------------------------------------------
// ink-stepper – Step and Stepper just render children; useStepperInput noop.
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
      <Box flexDirection="column">
        {renderProgress({ steps: [] })}
        {children}
      </Box>
    ),

    useStepperInput: () => ({
      disableNavigation: mock.fn(),
      enableNavigation: mock.fn(),
    }),
  },
});

// ---------------------------------------------------------------------------
// ink-text-input – render the current value as plain text.
// ---------------------------------------------------------------------------
mock.module("ink-text-input", {
  defaultExport: ({
    value,
  }: {
    value: string;
    onChange: (v: string) => void;
    onSubmit?: (v: string) => void;
  }) => <Text>{value}</Text>,
});

// ---------------------------------------------------------------------------
// ink-select-input – render all item labels in a column.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// ink-task-list – minimal wrappers.
// ---------------------------------------------------------------------------
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

// cli-spinners stub (used by setup-step components)
mock.module("cli-spinners", {
  defaultExport: { dots: { interval: 80, frames: ["."] } },
});

// make-dir stub (used by setup-template)
mock.module("make-dir", {
  namedExports: {
    makeDirectory: mock.fn(async () => undefined),
  },
});

mock.module("cpy", {
  defaultExport: mock.fn(async () => undefined),
});

mock.module("execa", {
  namedExports: {
    execa: mock.fn(() => ({
      // Just a stub
      stdout: "v12.32.99",
      exitCode: 0,
    })),
  },
});

export {};
