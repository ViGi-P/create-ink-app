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

const { default: TypeStep } =
  (await import("../../../components/stepper-section/steps/type-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/type-step.tsx").default;
  };

void describe("TypeStep", () => {
  void it("renders 'Template type:' label", () => {
    const { lastFrame, unmount } = render(<TypeStep onChange={() => {}} />);
    assert.match(lastFrame() ?? "", /Template type:/);
    unmount();
  });

  void it("renders Library and CLI options", () => {
    const { lastFrame, unmount } = render(<TypeStep onChange={() => {}} />);
    const frame = lastFrame() ?? "";
    assert.match(frame, /Library/);
    assert.match(frame, /CLI/);
    unmount();
  });
});
