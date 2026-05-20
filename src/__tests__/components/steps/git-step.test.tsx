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
  },
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

// ---------------------------------------------------------------------------

const { default: GitStep } =
  (await import("../../../components/stepper-section/steps/git-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/git-step.tsx").default;
  };

void describe("GitStep", () => {
  void it("renders 'Initialize a git repository?' label", () => {
    const { lastFrame, unmount } = render(
      <GitStep git={false} onChange={() => {}} />,
    );
    assert.match(lastFrame() ?? "", /Initialize a git repository\?/);
    unmount();
  });

  void it("renders Yes and No options", () => {
    const { lastFrame, unmount } = render(
      <GitStep git={false} onChange={() => {}} />,
    );
    const frame = lastFrame() ?? "";
    assert.match(frame, /Yes/);
    assert.match(frame, /No/);
    unmount();
  });
});
