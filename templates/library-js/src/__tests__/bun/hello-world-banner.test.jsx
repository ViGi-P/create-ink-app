import { expect } from "bun:test";
import { describe, it } from "bun:test";
import { render } from "ink-testing-library";
import { HelloWorldBanner } from "../index.js";

describe("HelloWorldBanner", async () => {
  it("renders", () => {
    const { lastFrame, unmount } = render(<HelloWorldBanner name="Ink" />);

    expect(lastFrame()?.search(/Hello world, Ink!/)).not.toBe(-1);
    unmount();
  });
});
