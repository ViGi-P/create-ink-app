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

const { default: InstallStep } =
  (await import("../../../components/stepper-section/steps/install-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/install-step.tsx").default;
  };

void describe("InstallStep", () => {
  void it("renders 'Install dependencies?' label", () => {
    const { lastFrame, unmount } = render(<InstallStep onChange={() => {}} />);
    assert.match(lastFrame() ?? "", /Install dependencies\?/);
    unmount();
  });

  void it("renders all package manager options", () => {
    const { lastFrame, unmount } = render(<InstallStep onChange={() => {}} />);
    const frame = lastFrame() ?? "";
    assert.match(frame, /NPM/);
    assert.match(frame, /Yarn/);
    assert.match(frame, /PNPM/);
    assert.match(frame, /Skip/);
    unmount();
  });
});
