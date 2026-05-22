import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

import "../../../shared-mocks/ink-task-list.tsx";
import "../../../shared-mocks/cli-spinners.ts";
import "../../../shared-mocks/make-dir.ts";
import "../../../shared-mocks/cpy.ts";
import "../../../shared-mocks/node:fs-promises.ts";

// ---------------------------------------------------------------------------

const defaultProps = {
  projectName: "test-four",
  type: "cli" as const,
  language: "ts" as const,
  git: true,
  pm: "npm" as const,
  install: true as const,
  onFinish: () => {},
  start: false,
};

const { default: SetupTemplate } =
  (await import("../../../../components/stepper-section/steps/setup-step/setup-template.tsx")) as unknown as {
    default: typeof import("../../../../components/stepper-section/steps/setup-step/setup-template.tsx").default;
  };

void describe("SetupTemplate", () => {
  void it("renders 'Template setup' task label", () => {
    const { lastFrame, unmount } = render(<SetupTemplate {...defaultProps} />);
    assert.match(lastFrame() ?? "", /Template setup/);
    unmount();
  });

  void it("shows 'Creating directory' in initial output", () => {
    const { lastFrame, unmount } = render(<SetupTemplate {...defaultProps} />);
    assert.match(lastFrame() ?? "", /Creating directory/);
    unmount();
  });

  void it("renders in loading state initially", () => {
    const { lastFrame, unmount } = render(<SetupTemplate {...defaultProps} />);
    assert.match(lastFrame() ?? "", /\[loading\]/);
    unmount();
  });

  void it("calls onFinish after running (start=true)", async () => {
    let finished = false;
    const { unmount } = render(
      <SetupTemplate
        {...defaultProps}
        start
        onFinish={() => {
          finished = true;
        }}
      />,
    );
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(finished, true);
    unmount();
  });
});
