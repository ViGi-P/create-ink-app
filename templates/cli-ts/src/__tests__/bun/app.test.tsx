import { expect } from "bun:test";
import { describe, it } from "bun:test";
import { render } from "ink-testing-library";
import App from "../app.tsx";

void describe("App", async () => {
  void it("renders hello world", async () => {
    const { lastFrame, unmount } = render(<App name="Ink" />);

    expect(lastFrame() ?? "").toMatch(/Hello world, Ink!/);
    unmount();
  });
});
