import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";
import App from "../../app.jsx";

describe("App", async () => {
  it("renders hello world", () => {
    const { lastFrame, unmount } = render(<App name="Ink" />);

    assert.notEqual(lastFrame().search("Hello world, Ink!"), -1);
    unmount();
  });
});
