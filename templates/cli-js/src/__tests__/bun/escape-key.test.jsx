import { expect } from "bun:test";
import { describe, it } from "bun:test";
import { render } from "ink-testing-library";
import { Router } from "@endernoke/wax";
import EscapeKey from "../../components/escape-key.jsx";

const renderEscapeKey = (initialHistory = ["/"]) =>
  render(
    <Router initialHistory={initialHistory}>
      <EscapeKey />
    </Router>,
  );

const delay = async (ms = 20) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

describe("EscapeKey", async () => {
  it("renders quit at root", async () => {
    const { lastFrame, unmount } = renderEscapeKey(["/"]);
    await delay();

    expect(lastFrame()?.search(/\[ESC] - Quit/)).not.toBe(-1);

    unmount();
  });

  it("renders go back when history exists", async () => {
    const { lastFrame, unmount } = renderEscapeKey(["/", "/users/123"]);
    await delay();

    expect(lastFrame()?.search(/\[ESC] - Go back/)).not.toBe(-1);

    unmount();
  });

  it("pressing escape goes back", async () => {
    const { lastFrame, stdin, unmount } = renderEscapeKey(["/", "/users/123"]);
    await delay();

    expect(lastFrame()?.search(/\[ESC] - Go back/)).not.toBe(-1);

    stdin.write("\u001B");
    await delay();

    expect(lastFrame()?.search(/\[ESC] - Quit/)).not.toBe(-1);

    unmount();
  });
});
