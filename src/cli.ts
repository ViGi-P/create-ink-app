#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import slugify from "slugify";
import App from "./app.tsx";

const cli = meow(
  `
  Usage
    $ create-ink-app <project-name> [options]

  Options
    --type       Template type: library or cli
    --language   Template language: js or ts
    --git        Initialize a git repo
    --no-git     Skip git repo initialization
    --install    Install dependencies with npm, yarn, pnpm, or skip
`,
  {
    importMeta: import.meta,
    booleanDefault: undefined,
    flags: {
      type: {
        type: "string",
      },
      language: {
        type: "string",
      },
      install: {
        type: "string",
      },
      git: {
        type: "boolean",
      },
    },
  },
);

const errors = [];
if (
  typeof cli.flags.type === "string" &&
  !["library", "cli"].includes(cli.flags.type)
) {
  errors.push(`--type=${cli.flags.type}`);
}
if (
  typeof cli.flags.language === "string" &&
  !["js", "ts"].includes(cli.flags.language)
) {
  errors.push(`--language=${cli.flags.language}`);
}
if (
  typeof cli.flags.install === "string" &&
  !["npm", "yarn", "pnpm", "skip"].includes(cli.flags.install)
) {
  errors.push(`--install=${cli.flags.install}`);
}
if (errors.length > 0) {
  console.error(`Invalid options: ${errors.join(", ")}`);
  process.exit(1);
} else {
  const argValues = {
    projectName: slugify(cli.input[0] ?? "", { lower: true, strict: true }),
    type: cli.flags.type as "library" | "cli" | undefined,
    language: cli.flags.language as "js" | "ts" | undefined,
    install: cli.flags.install as "npm" | "yarn" | "pnpm" | "skip" | undefined,
    git: cli.flags.git,
  };

  const { waitUntilExit } = render(React.createElement(App, { argValues }), {
    alternateScreen: true,
  });

  await waitUntilExit();
}
