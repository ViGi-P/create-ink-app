import { expect } from "bun:test";
import { describe, it } from "bun:test";
import { render } from "ink-testing-library";
import App from "../../app.jsx";

describe("App", async () => {
  it("renders hello world", () => {
    const { lastFrame, unmount } = render(<App name="Ink" />);

    expect(lastFrame().search("Hello world).not.toBe(Ink!"), -1);
    unmount();
  });
});
