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
      <Box flexDirection="column">
        {renderProgress({ steps: [] })}
        {children}
      </Box>
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
    Task: ({ label, state }: { label: string; state: string }) => (
      <Text>{`${label} [${state}]`}</Text>
    ),
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

// ink-gradient – render children as-is
mock.module("ink-gradient", {
  defaultExport: ({
    children,
  }: {
    children: React.ReactNode;
    name?: string;
  }) => <>{children}</>,
});

// ink-link – render children (or fallback url) as Text
mock.module("ink-link", {
  defaultExport: ({
    children,
    fallback,
    url,
  }: {
    children: React.ReactNode;
    url: string;
    fallback?: (_text: React.ReactNode, url: string) => string;
  }) => <Text>{fallback ? fallback(children, url) : children}</Text>,
});

mock.module("execa", {
  namedExports: {
    execa: mock.fn(() => ({ stdout: "execa output", exitCode: 0 })),
  },
});

// ---------------------------------------------------------------------------

const { default: App } = (await import("../app.tsx")) as unknown as {
  default: typeof import("../app.tsx").default;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

void describe("App", () => {
  void it("renders without crashing with empty argValues", async () => {
    const { lastFrame, unmount } = render(<App argValues={{}} />);
    await delay(50);
    assert.ok((lastFrame() ?? "").length > 0);
    unmount();
  });

  void it("renders the header text", async () => {
    const { lastFrame, unmount } = render(<App argValues={{}} />);
    await delay(50);
    assert.match(lastFrame() ?? "", /@vigi-p\/create-ink-app/);
    unmount();
  });

  void it("renders [ENTER] navigation hint in footer", async () => {
    const { lastFrame, unmount } = render(<App argValues={{}} />);
    await delay(50);
    assert.match(lastFrame() ?? "", /\[ENTER\]/);
    unmount();
  });

  void it("starts at step 0 (NameStep) when projectName is absent", async () => {
    const { lastFrame, unmount } = render(<App argValues={{}} />);
    await delay(50);
    assert.match(lastFrame() ?? "", /Project name:/);
    unmount();
  });

  void it("starts at step 1 (TypeStep) when projectName is present but type is absent", async () => {
    const { lastFrame, unmount } = render(
      <App argValues={{ projectName: "test-app" }} />,
    );
    await delay(50);
    assert.match(lastFrame() ?? "", /Template type:/);
    unmount();
  });

  void it("starts at step 2 (LanguageStep) when projectName+type present but language absent", async () => {
    const { lastFrame, unmount } = render(
      <App argValues={{ projectName: "test-app", type: "cli" }} />,
    );
    await delay(50);
    assert.match(lastFrame() ?? "", /Template language:/);
    unmount();
  });

  void it("starts at step 3 (InstallStep) when projectName+type+language present but install absent", async () => {
    const { lastFrame, unmount } = render(
      <App
        argValues={{
          projectName: "test-app",
          type: "cli",
          language: "ts",
        }}
      />,
    );
    await delay(50);
    assert.match(lastFrame() ?? "", /Install dependencies\?/);
    unmount();
  });

  void it("starts at step 4 (GitStep) when all fields present but git is absent", async () => {
    const { lastFrame, unmount } = render(
      <App
        argValues={{
          projectName: "test-app",
          type: "cli",
          language: "ts",
          pm: "npm",
          install: true,
        }}
      />,
    );
    await delay(50);
    assert.match(lastFrame() ?? "", /Initialize a git repository\?/);
    unmount();
  });

  void it("starts at step 0 (NameStep) when directory with projectName already exists", async () => {
    const { lastFrame, unmount } = render(
      <App
        argValues={{
          projectName: "src",
          type: "cli",
          language: "ts",
          pm: "npm",
          install: true,
        }}
      />,
    );
    await delay(50);
    assert.match(lastFrame() ?? "", /Project name:/);
    unmount();
  });

  void it("starts at step 5 (SetupStep) when all args are present", async () => {
    const { lastFrame, unmount } = render(
      <App
        argValues={{
          projectName: "test-app",
          type: "cli",
          language: "ts",
          pm: "npm",
          install: true,
          git: true,
        }}
      />,
    );
    await delay(50);
    assert.ok((lastFrame() ?? "").length > 0);
    unmount();
  });
});
