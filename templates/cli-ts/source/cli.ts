#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
  `
  Usage
    $ hello-ink

  Options
    --name  Name to greet
`,
  {
    importMeta: import.meta,
    flags: {
      name: {
        type: 'string',
        default: 'World',
      },
    },
  },
);

const {waitUntilExit} = render(
  React.createElement(App, {name: cli.flags.name}),
);
await waitUntilExit();
