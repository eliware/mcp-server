# Release Notes

## 12.0.0 — 2026-10-12

### Changed

Move runtime code and TypeScript declarations under `src/`. Keep package imports stable.
Update dependencies and package metadata for version 12 and Node.js 26.
Split server, transport, auth, and request handling into focused modules.
Expand tests to cover server setup, transports, tool discovery, authentication, OAuth2, and PKCE.
Update server examples and add container, Express, static token, bearer passthrough, and OAuth2 examples.

### Added

Add CI checks and npm package validation for the current repository conventions.
Add repository specification indexes and schema checks.
Add user guides for setup, configuration, tools, authentication, and troubleshooting.

## 1.1.10 — 2026-08-23

### Fixed

Make CI fail when lint reports warnings on supported platforms.

## 1.1.9 — 2026-08-23

### Changed

Handle Windows entrypoint paths. Cache tool discovery and imports in stateless mode.
Use package metadata for server names and versions. Add a coverage gap check.

## 1.1.8 — 2026-08-07

### Changed

Standardize validation scripts, TypeScript checks, CI, and package metadata.
Expand requirements, troubleshooting, development, and security docs.

## 1.1.7 — 2026-08-07

### Changed

Update `@eliware/common` and refresh the npm lockfile.

## 1.1.6 — 2026-08-07

### Changed

Update `@eliware/common` and add manual CI execution.

## 1.1.5 — 2026-08-06

### Changed

Use Node.js 26 in CI. Add lint checks, Eliware README content, and coverage checks.

## 1.1.4 — 2026-08-06

### Added

Support an existing Express app and add a REST-plus-MCP example.

## 1.1.3 — 2026-08-06

### Changed

Harden OAuth2 checks. Add required scopes and a configurable subject claim.
Sanitize token claims before tools receive them.

## 1.1.2 — 2026-08-05

### Added

Add HTTP, HTTPS, stdio, TLS, authentication, OAuth2, PKCE, client registration, and Docker support.
Add tool discovery, injected context, Zod schemas, response helpers, examples, and TypeScript declarations.

### Changed

Remove CommonJS and legacy routes. Move runtime code into `src/` and examples into `examples/`.
