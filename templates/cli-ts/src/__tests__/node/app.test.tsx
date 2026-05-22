import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";
import App from "../../app.tsx";

void describe("App", async () => {
  void it("renders hello world", async () => {
    const { lastFrame, unmount } = render(<App name="Ink" />);

    assert.match(lastFrame() ?? "", /Hello world, Ink!/);
    unmount();
  });
});
