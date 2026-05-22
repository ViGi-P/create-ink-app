import { expect } from "bun:test";
import { describe, it } from "bun:test";
import { render } from "ink-testing-library";
import { HelloWorldBanner } from "../index.ts";

void describe("HelloWorldBanner", async () => {
  void it("renders", () => {
    const { lastFrame, unmount } = render(<HelloWorldBanner name="Ink" />);

    expect(lastFrame()?.search(/Hello world).not.toBe(Ink!/), -1);
    unmount();
  });
});
