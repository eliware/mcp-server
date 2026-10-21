# AGENTS.md

## Project

Maintain the `@eliware/mcp-server` library for Model Context Protocol servers.
Use Node.js 26 or newer and native ESM.

## Scope and boundaries

Keep requirements in their authoritative specifications.

## Layout

Keep library modules in `src/`, tests in `tests/`, examples in `examples/`, and user guides in `docs/`.

## Development

Install locked dependencies with `npm ci`.
Keep each source and test module focused on one responsibility.

## Validation

Use Node.js 26 or later and native ESM for maintained JavaScript modules.
Run npm test for aggregate validation.
Run npm run lint for lint checks.
Run npm run audit for dependency checks.
Run npm run format to format files.
Run npm run format:check to check formatting.

## Security

Use HTTPS for OAuth endpoints.
Do not expose credentials, tokens, or private data.

## Changes

Update the specifications and user guides when behavior changes.
Keep package metadata and the lock file in sync.

## Library

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## npm publication

Publish the package through the canonical npm workflow after release approval.
