# Repository Guidance

This package builds `@vigi-p/create-ink-app`, a small ESM CLI that scaffolds starter Ink apps from `templates/`.

## Commands

- Use `pnpm install` to install dependencies.
- Use `pnpm build` before running the local CLI from `dist/index.js`.
- Use `pnpm lint`, `pnpm typecheck`, and `pnpm test` before handing off changes.

## Scope Rules

- Keep generator behavior limited to selecting a project name, project type, template language, git initialization, and dependency installation.
- Keep templates as minimal Hello World Ink apps.
- Use concise imperative commit messages if commits are requested.
