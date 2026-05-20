import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import React from "react";
import { Text } from "ink";
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

mock.module("ink-text-input", {
  defaultExport: ({
    value,
  }: {
    value: string;
    onChange: (v: string) => void;
    onSubmit?: (v: string) => void;
  }) => <Text>{value}</Text>,
});

const { default: NameStep } =
  (await import("../../../components/stepper-section/steps/name-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/name-step.tsx").default;
  };

void describe("NameStep", () => {
  void it("renders 'Project name:' label", () => {
    const { lastFrame, unmount } = render(<NameStep onChange={() => {}} />);
    assert.match(lastFrame() ?? "", /Project name:/);
    unmount();
  });

  void it("shows slugified name when a non-empty projectName is provided", () => {
    const { lastFrame, unmount } = render(
      <NameStep onChange={() => {}} projectName="My Awesome App" />,
    );
    assert.match(lastFrame() ?? "", /my-awesome-app/);
    unmount();
  });
});
