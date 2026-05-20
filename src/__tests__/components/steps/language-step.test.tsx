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

const { default: LanguageStep } =
  (await import("../../../components/stepper-section/steps/language-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/language-step.tsx").default;
  };

void describe("LanguageStep", () => {
  void it("renders 'Template language:' label", () => {
    const { lastFrame, unmount } = render(<LanguageStep onChange={() => {}} />);
    assert.match(lastFrame() ?? "", /Template language:/);
    unmount();
  });

  void it("renders JavaScript and TypeScript options", () => {
    const { lastFrame, unmount } = render(<LanguageStep onChange={() => {}} />);
    const frame = lastFrame() ?? "";
    assert.match(frame, /JavaScript/);
    assert.match(frame, /TypeScript/);
    unmount();
  });
});
