# Repository Guidance

This package builds `@vigi-p/create-ink-app`, a small ESM CLI that scaffolds starter Ink apps from `templates/`.

## Commands

- Use `pnpm install` to install dependencies.
- Use `pnpm dev` to run a local tmux-based dev session.
- Use `pnpm build` before running the local CLI from `dist/cli.js`.
- Use `pnpm format`, `pnpm lint`, `pnpm typecheck`, and `pnpm test` before handing off changes.

## Scope Rules

- Keep generator behavior limited to selecting a project name, project type, template language, git initialization, and dependency installation (npm, yarn, pnpm).
- Keep templates as minimal Hello World Ink apps.
- Use concise imperative commit messages if commits are requested.

## Test Progress

Tests live under `src/__tests__/` and mirror the source tree. The test runner is
Node's built-in `node:test`; rendering uses `ink-testing-library`. Heavy I/O
(fs, execa, cpy) is stubbed with `node:test`'s `mock.module`.

| File | Test file | Status |
|------|-----------|--------|
| `src/utils/check-directory-exists.ts` | `src/__tests__/utils/check-directory-exists.test.ts` | ✅ done |
| `src/utils/initialize-git.ts` | `src/__tests__/utils/initialize-git.test.ts` | ✅ done |
| `src/utils/copy-template.ts` | `src/__tests__/utils/copy-template.test.ts` | ✅ done |
| `src/utils/update-package-json.ts` | `src/__tests__/utils/update-package-json.test.ts` | ✅ done |
| `src/utils/install-dependencies.ts` | `src/__tests__/utils/install-dependencies.test.ts` | ✅ done |
| `src/components/footer.tsx` | `src/__tests__/components/footer.test.tsx` | ✅ done |
| `src/components/header.tsx` | `src/__tests__/components/header.test.tsx` | ✅ done |
| `src/components/stepper-section/stepper-progress.tsx` | `src/__tests__/components/stepper-progress.test.tsx` | ✅ done |
| `src/components/stepper-section/steps/name-step.tsx` | `src/__tests__/components/steps/name-step.test.tsx` | ✅ done |
| `src/components/stepper-section/steps/type-step.tsx` | `src/__tests__/components/steps/type-step.test.tsx` | ✅ done |
| `src/components/stepper-section/steps/language-step.tsx` | `src/__tests__/components/steps/language-step.test.tsx` | ✅ done |
| `src/components/stepper-section/steps/install-step.tsx` | `src/__tests__/components/steps/install-step.test.tsx` | ✅ done |
| `src/components/stepper-section/steps/git-step.tsx` | `src/__tests__/components/steps/git-step.test.tsx` | ✅ done |
| `src/components/stepper-section/steps/setup-step/setup-dependencies.tsx` | `src/__tests__/components/steps/setup-step/setup-dependencies.test.tsx` | ✅ done |
| `src/components/stepper-section/steps/setup-step/setup-git.tsx` | `src/__tests__/components/steps/setup-step/setup-git.test.tsx` | ✅ done |
| `src/components/stepper-section/steps/setup-step/setup-template.tsx` | `src/__tests__/components/steps/setup-step/setup-template.test.tsx` | ✅ done |
| `src/components/stepper-section/steps/setup-step/index.tsx` | `src/__tests__/components/steps/setup-step/index.test.tsx` | ✅ done |
| `src/components/stepper-section/index.tsx` | `src/__tests__/components/stepper-section.test.tsx` | ✅ done |
| `src/app.tsx` | `src/__tests__/app.test.tsx` | ✅ done |
| `src/cli.ts` | `src/__tests__/cli.test.ts` | ✅ done |

## ESM Mocking (Node.js v24+)

To ensure that I/O operations (such as directory creation, copying template files, updating `package.json`, and running `git` or `install` commands) are completely mocked out during unit and integration testing without creating folders like `test-app-artefact` or `test-app`:
1. Use `namedExports`/`defaultExport` for mocking third-party packages (e.g. `make-dir` and `cpy`) as they are typesafe with the current `@types/node` and don't trigger linter errors (the deprecation warning is acceptable).
2. Avoid using relative utility mocks (`../../../../utils/*.js`) entirely to improve readability. The global third-party mocks correctly intercept all filesystem/execa calls from deep within the dependency graph.
3. Crucially, when writing high-level tests (like `app.test.tsx` and `stepper-section.test.tsx`), you **must** use dynamic imports (e.g. `const { default: App } = (await import("../app.tsx")) as any;`) *after* the `mock.module` registrations. If you use static imports, ESM hoisting will pre-load the dependency tree *before* your mocks can execute, causing the mocks to fail and actual filesystem modifications to happen.
