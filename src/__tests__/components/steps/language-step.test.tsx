import assert from "node:assert/strict";
import { describe, it } from "node:test";
import "./_shared-mocks.tsx";
import { render } from "ink-testing-library";
import { Stepper } from "ink-stepper";

const { default: LanguageStep } =
  (await import("../../../components/stepper-section/steps/language-step.tsx")) as unknown as {
    default: typeof import("../../../components/stepper-section/steps/language-step.tsx").default;
  };

const WrappedStep = ({
  language,
  onChange,
}: {
  language?: "js" | "ts";
  onChange: (language: "js" | "ts") => void;
}) => (
  <Stepper onComplete={() => {}}>
    <LanguageStep onChange={onChange} language={language} />
  </Stepper>
);

void describe("LanguageStep", () => {
  void it("renders 'Template language:' label", () => {
    const { lastFrame, unmount } = render(<WrappedStep onChange={() => {}} />);
    assert.match(lastFrame() ?? "", /Template language:/);
    unmount();
  });

  void it("renders JavaScript and TypeScript options", () => {
    const { lastFrame, unmount } = render(<WrappedStep onChange={() => {}} />);
    const frame = lastFrame() ?? "";
    assert.match(frame, /JavaScript/);
    assert.match(frame, /TypeScript/);
    unmount();
  });
});
