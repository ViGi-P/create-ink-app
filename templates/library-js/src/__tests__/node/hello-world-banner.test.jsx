import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";
import { HelloWorldBanner } from "../../index.js";

describe("HelloWorldBanner", async () => {
  it("renders", () => {
    const { lastFrame, unmount } = render(<HelloWorldBanner name="Ink" />);

    assert.notEqual(lastFrame().search(/Hello world, Ink!/), -1);
    unmount();
  });
});
