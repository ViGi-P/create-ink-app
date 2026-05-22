import { expect } from "bun:test";
import { describe, it } from "bun:test";
import { Text } from "ink";
import { render } from "ink-testing-library";
import { FancyBox } from "../../index.ts";

void describe("FancyBox", async () => {
  void it("renders with children", () => {
    const { lastFrame, unmount } = render(
      <FancyBox>
        <Text>Hello FancyBox!</Text>
      </FancyBox>,
    );

    expect(lastFrame()?.search(/Hello FancyBox!/)).not.toBe(-1);
    unmount();
  });

  void it("null without children", () => {
    const { lastFrame, unmount } = render(<FancyBox />);

    expect(!lastFrame()).toBe(true);
    unmount();
  });
});
