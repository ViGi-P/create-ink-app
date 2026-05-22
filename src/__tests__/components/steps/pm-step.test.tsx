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

const { default: PMStep } =
  (await import("../../../components/stepper-section/steps/pm-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/pm-step.tsx").default;
  };

void describe("PMStep", () => {
  void it("renders 'Which package manager do you want to use??' label", () => {
    const { lastFrame, unmount } = render(<PMStep onChange={() => {}} />);
    assert.match(
      lastFrame() ?? "",
      /Which package manager do you want to use?\?/,
    );
    unmount();
  });

  void it("renders all package manager options", () => {
    const { lastFrame, unmount } = render(<PMStep onChange={() => {}} />);
    const frame = lastFrame() ?? "";
    assert.match(frame, /NPM/);
    assert.match(frame, /Yarn/);
    assert.match(frame, /PNPM/);
    assert.match(frame, /Bun/);
    unmount();
  });
});
