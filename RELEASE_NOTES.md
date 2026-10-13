# Release Notes

## 12.0.0 — 2026-10-13

### Added

- Add end-user guides for setup, configuration, tools, authentication, APIs, requirements, and troubleshooting.
- Add OAuth client helpers for provider discovery, client registration, authorization code exchange, and PKCE.
- Add auth helpers for static tokens, bearer passthrough, OAuth introspection, scopes, and user data.
- Add Docker, Express, stdio, static token, passthrough, and OAuth2 examples.
- Add CI and npm publish workflows, a Knit deployment workflow, and repository specification files.
- Add type declarations for the server, transports, auth, OAuth, PKCE, tools, and utilities.

### Changed

- Move runtime code and declarations to `src/`. Export the server API and utility API from package entry points.
- Set package version 12.0.0. Require Node.js 26 or later. Update dependencies and package metadata.
- Split server, auth, OAuth, HTTP, transport, and tool discovery code into focused modules.
- Keep stateless Streamable HTTP as the default. Support stateful HTTP and stdio transport modes.
- Refresh tool discovery during stateless server builds. Reuse loaded tool modules.
- Update the README, examples, container setup, release workflow, and validation rules.

### Fixed

- Validate OAuth state, scopes, client IDs, registration endpoints, and public redirect hosts and ports.
- Escape OAuth challenge values. Reject unsafe redirect request targets.
- Require PKCE stores to remove state after use. Reject empty OAuth state values.
- Close listeners after startup failures. Contain runtime listener logging errors.
- Fail server startup when a tool module fails to load or register.
- Convert BigInt response values and reject circular response data.
- Sanitize OAuth claims before tools receive them. Preserve the stdio transport type in the API declarations.

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
