#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { render } from "ink";
import meow from "meow";
import App from "./app.jsx";

const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const cli = meow(
  `
  Usage
    $ ${packageJson.name} [options]

  Options
    --name  Name to greet
`,
  {
    importMeta: import.meta,
    flags: {
      name: {
        type: "string",
        default: "from Ink",
      },
    },
  },
);

const { waitUntilExit } = render(<App name={cli.flags.name} />);
await waitUntilExit();
