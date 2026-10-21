# AGENTS.md

## Project

Eliware maintains the `@eliware/mcp-server` library for Model Context Protocol servers.
Use Node.js 26 or newer and native ESM.

## Scope and boundaries

Keep repository requirements in their authoritative specifications.

## Layout

Use README.md and specs/README.md to find maintained files.

## Development

Read specs/README.md before you change code.

## Validation

Use Node.js 26 or later and native ESM for maintained JavaScript modules.
Run npm test for aggregate validation.
Run npm run lint for lint checks.
Run npm run audit for dependency checks.
Run npm run format to format files.
Run npm run format:check to check formatting.

## Security

Keep credentials, secret values, private data, and runtime state out of Git.

## Changes

Update specifications and user guides when package behavior changes.

## Library

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## npm publication

Follow Eliware Operations procedures for release approval.
