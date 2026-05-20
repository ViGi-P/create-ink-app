import assert from "node:assert/strict";
import { describe, it } from "node:test";
import "./_shared-mocks.tsx";
import { render } from "ink-testing-library";
import { Stepper } from "ink-stepper";

const { default: InstallStep } =
  (await import("../../../components/stepper-section/steps/install-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/install-step.tsx").default;
  };

const WrappedStep = ({
  install,
  onChange,
}: {
  install?: "npm" | "yarn" | "pnpm" | "skip";
  onChange: (install: "npm" | "yarn" | "pnpm" | "skip") => void;
}) => (
  <Stepper onComplete={() => {}}>
    <InstallStep onChange={onChange} install={install} />
  </Stepper>
);

void describe("InstallStep", () => {
  void it("renders 'Install dependencies?' label", () => {
    const { lastFrame, unmount } = render(<WrappedStep onChange={() => {}} />);
    assert.match(lastFrame() ?? "", /Install dependencies\?/);
    unmount();
  });

  void it("renders all package manager options", () => {
    const { lastFrame, unmount } = render(<WrappedStep onChange={() => {}} />);
    const frame = lastFrame() ?? "";
    assert.match(frame, /NPM/);
    assert.match(frame, /Yarn/);
    assert.match(frame, /PNPM/);
    assert.match(frame, /Skip/);
    unmount();
  });
});
