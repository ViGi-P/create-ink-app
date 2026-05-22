import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Text } from "ink";
import { render } from "ink-testing-library";
import { FancyBox } from "../index.ts";

void describe("FancyBox", async () => {
  void it("renders with children", () => {
    const { lastFrame, unmount } = render(
      <FancyBox>
        <Text>Hello FancyBox!</Text>
      </FancyBox>,
    );

    assert.notEqual(lastFrame()?.search(/Hello FancyBox!/), -1);
    unmount();
  });

  void it("null without children", () => {
    const { lastFrame, unmount } = render(<FancyBox />);

    assert.equal(!lastFrame(), true);
    unmount();
  });
});
