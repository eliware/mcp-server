# AGENTS.md

## Project

Build `@eliware/mcp-server` with Node.js 26 or later and native ESM.

## Scope and boundaries

Provide an MCP server package for use. Keep application tools and user data outside this repository.
Do not publish or deploy during validation.

## Layout

Keep runtime code in `src/`, tests in `tests/`, docs in `docs/`, examples in `examples/`, and specs in `specs/`.

## Development

Keep each source module at 100 lines or less. Keep each test module at 200 lines or less.
Keep one test module for each source module.

## Validation

Run focused tests first during development. Pass one or more test paths to `npm test` for focused testing.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development. Run the full `npm test` suite for final validation before a commit, milestone, or release.

Run `npm run lint` for lint checks. Run `npm run audit` for package audit checks.
Run `npm run format` to format files. Run `npm run format:check` to check file format.
Run `npm run typecheck` to check declarations. Run `npm run pack` to check package contents.

## Security

Keep credentials, tokens, secrets, and private data out of logs.
Use HTTPS and authentication for remote access.

## Changes

Keep docs and examples current. Follow shared repo conventions.

## Library

Keep public runtime code and declarations under `src/`. Export supported APIs only.

Run focused tests first during development. Pass one or more test paths to `npm test` for focused testing.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development. Run the full `npm test` suite for final validation before a commit, milestone, or release.

Keep one test module for each source module.

## npm publication

The public package is `@eliware/mcp-server`. Include required runtime files and metadata.

Run `eliware-test --pack` before release checks. Follow the release process.
