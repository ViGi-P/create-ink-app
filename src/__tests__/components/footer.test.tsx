import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";
import { Box } from "ink";
import Footer from "../../components/footer.tsx";

void describe("Footer", () => {
  void it("renders [ENTER] - Next when not the last step", () => {
    const { lastFrame, unmount } = render(
      // Wrap in box for components that have position "absolute"
      <Box height={5}>
        <Footer isFirst={false} isLast={false} />
      </Box>,
    );
    assert.match(lastFrame() ?? "", /\[ENTER\].*Next/);
    unmount();
  });

  void it("renders [ENTER] - Leave when it is the last step", () => {
    const { lastFrame, unmount } = render(
      <Box height={5}>
        <Footer isFirst={false} isLast={true} />
      </Box>,
    );
    assert.match(lastFrame() ?? "", /\[ENTER\].*Leave/);
    unmount();
  });

  void it("renders [ESC] - Leave on the first step", () => {
    const { lastFrame, unmount } = render(
      <Box height={5}>
        <Footer isFirst={true} isLast={false} />
      </Box>,
    );
    assert.match(lastFrame() ?? "", /\[ESC\].*Leave/);
    unmount();
  });

  void it("renders [ESC] - Back on a middle step", () => {
    const { lastFrame, unmount } = render(
      <Box height={5}>
        <Footer isFirst={false} isLast={false} />
      </Box>,
    );
    assert.match(lastFrame() ?? "", /\[ESC\].*Back/);
    unmount();
  });

  void it("does not render [ESC] on the last step", () => {
    const { lastFrame, unmount } = render(
      <Box height={5}>
        <Footer isFirst={false} isLast={true} />
      </Box>,
    );
    assert.equal(lastFrame()?.includes("[ESC]"), false);
    unmount();
  });
});
