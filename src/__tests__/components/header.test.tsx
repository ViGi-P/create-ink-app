import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";
import Header from "../../components/header.tsx";

void describe("Header", () => {
  void it("renders the text prop", () => {
    const { lastFrame, unmount } = render(
      <Header text="@vigi-p/create-ink-app" />,
    );
    assert.match(lastFrame() ?? "", /@vigi-p\/create-ink-app/);
    unmount();
  });

  void it("renders a version number from package.json", () => {
    const { lastFrame, unmount } = render(<Header text="test-app" />);
    assert.match(lastFrame() ?? "", /\(v\d+\.\d+\.\d+\)/);
    unmount();
  });

  void it("renders GitHub link text", () => {
    const { lastFrame, unmount } = render(<Header text="test" />);
    assert.match(lastFrame() ?? "", /github/i);
    unmount();
  });

  void it("renders NPM link text", () => {
    const { lastFrame, unmount } = render(<Header text="test" />);
    assert.match(lastFrame() ?? "", /npm/i);
    unmount();
  });
});
