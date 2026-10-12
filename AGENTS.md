# AGENTS.md

## Project

Build `@eliware/mcp-server` with Node.js 26 or later. Use native ESM.

## Scope and boundaries

This repo owns a reusable MCP server package. It does not own application tools or user data.
Do not publish, deploy, or change external services during validation.

## Layout

Keep library code in `src/`. Keep matching tests in `tests/`.
Keep documentation in `docs/`, examples in `examples/`, and specifications in `specs/`.

## Development

Give each source and test module one clear purpose. Keep each source module at 100 lines or less.
Keep each test module at 200 lines or less. Match each source module with one test module.

## Validation

Use Node.js 26 or later and native ESM.
Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for package audit checks.
Run `npm run format` to format files.
Run `npm run format:check` to check file format.
Run `npm run typecheck` to check declarations.
Run `npm run pack` to check package contents.

## Security

Protect credentials, tokens, secrets, and private data. Keep secret values out of logs.
Use HTTPS and explicit authentication for remote deployments.

## Changes

Keep docs and examples current. Follow shared conventions and the Eliware Operations approval process.

## Library

Keep public runtime code and declarations under `src/`. Export only supported APIs.
Keep one test module for each source module.

## npm publication

The public package is `@eliware/mcp-server`. Include `src/`, `docs/`, `examples/`, `specs/`, and required metadata.
Run `npm run pack` before publication review. Follow the Eliware Operations publication process.
