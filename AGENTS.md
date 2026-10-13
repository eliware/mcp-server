# AGENTS.md

## Project

Build `@eliware/mcp-server` with Node.js 26 or later and native ESM.

## Scope and boundaries

Provide a reusable MCP server package. Keep application tools and user data outside this repo.
Do not publish or deploy during validation.

## Layout

Keep runtime code in `src/`, tests in `tests/`, docs in `docs/`, examples in `examples/`, and specs in `specs/`.

## Development

Keep each source module at 100 lines or less. Keep each test module at 200 lines or less.
Mirror each source module with one test module.

## Validation

Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for package audit checks.
Run `npm run format` to format files.
Run `npm run format:check` to check file format.
Run `npm run typecheck` to check declarations.
Run `npm run pack` to check package contents.

## Security

Keep credentials, tokens, secrets, and private data out of logs.
Use HTTPS and authentication for remote access.

## Changes

Keep docs and examples current. Follow shared repo conventions.

## Library

Keep public runtime code and declarations under `src/`. Export supported APIs only.
Keep one test module for each source module.

## npm publication

The public package is `@eliware/mcp-server`. Include required runtime files and metadata.
Run `npm run pack` before publication review. Follow the release process.
