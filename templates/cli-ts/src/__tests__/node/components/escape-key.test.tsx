import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { render } from "ink-testing-library";
import { Router } from "@endernoke/wax";
import EscapeKey from "../../../components/escape-key.tsx";

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

void describe("Escape Key", async () => {
  void it("renders quit at root", async () => {
    const { lastFrame, unmount } = renderEscapeKey(["/"]);
    await delay();

    assert.notEqual(lastFrame()?.search(/\[ESC] - Quit/), -1);

    unmount();
  });

  void it("renders go back when history exists", async () => {
    const { lastFrame, unmount } = renderEscapeKey(["/", "/users/123"]);
    await delay();

    assert.notEqual(lastFrame()?.search(/\[ESC] - Go back/), -1);

    unmount();
  });

  void it("pressing escape goes back", async () => {
    const { lastFrame, stdin, unmount } = renderEscapeKey(["/", "/users/123"]);
    await delay();

    assert.notEqual(lastFrame()?.search(/\[ESC] - Go back/), -1);

    stdin.write("\u001B");
    await delay();

    assert.notEqual(lastFrame()?.search(/\[ESC] - Quit/), -1);

    unmount();
  });
});
