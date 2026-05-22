#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import packageJson from "../package.json" with { type: "json" };
import App from "./app.tsx";

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
        default: "Ink",
      },
    },
  },
);

const { waitUntilExit } = render(
  React.createElement(App, { name: cli.flags.name }),
);
await waitUntilExit();
