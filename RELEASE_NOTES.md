# Release Notes

## 1.1.10 — 2026-08-23

- Make CI fail when lint reports warnings on supported platforms.

## 1.1.9 — 2026-08-23
## 1.1.9 — 2026-08-23

- Fixed Windows path handling for URL-derived entrypoints and tool directories.
- Cached discovered tool files and imported modules during stateless requests.
- Added Ubuntu and Windows CI with publish gating on both platforms.
- Made package metadata and version reporting derive from `package.json`.
- Added a cross-platform coverage-gap checker and refreshed dependencies.

## 1.1.8 — 2026-08-07

- Standardized validation scripts, TypeScript checking, CI, and package metadata.
- Updated `@eliware/common` to 1.1.7.
- Expanded requirements, troubleshooting, development, and security documentation.

## 1.1.7 — August 7, 2026

- Updated `@eliware/common` to `^1.1.6`.
- Refreshed the npm lockfile.

## 1.1.6 — August 7, 2026

This release updates the shared Eliware common dependency and adds manual CI execution.

### Changed

- Updated `@eliware/common` from `^1.1.4` to `^1.1.5`.
- Regenerated the npm lockfile.
- Added manual GitHub Actions workflow dispatch support.

### Verification

- Jest: 116 tests passed.
- Coverage: 100% statements, branches, functions, and lines.
- Oxlint: 0 warnings/errors.

## 1.1.5 — August 6, 2026

This release standardizes project automation and documentation without changing runtime behavior.

### Changed

- Updated GitHub Actions to use Node.js 26 and current checkout/setup actions.
- Added lint execution to continuous integration.
- Added the `npm run test:gaps` coverage-gap helper.
- Added standardized Eliware branding, badges, support information, and project links to the README.
- Added `.agentx*` and Jest result files to `.gitignore`.
- Regenerated the npm lockfile.

### Verification

- Jest: 116 tests passed.
- Coverage: 100% statements, branches, functions, and lines.
- Oxlint: 0 warnings/errors.

## 1.1.4 — August 6, 2026

This release improves embedding the MCP server into existing Express applications.

### Added

- Support for supplying an existing Express application via `app`.
- Added `configureApp` for registering application middleware and routes during setup.
- Added an Express REST-plus-MCP example in `examples/express/server.mjs`.
- Documented unified REST and MCP listener usage.
- Updated TypeScript declarations and integration tests.

### Verification

- Jest: 116 tests passed.
- Coverage: 100% statements, branches, functions, and lines.
- Oxlint: 0 warnings/errors.

## 1.1.3 — Current changes

This release hardens OAuth2 authentication and improves Docker examples and test coverage.

### Changed

- Added `requiredScopes` as the preferred OAuth2 configuration, while retaining `scopes` as a backward-compatible alias.
- Added configurable OAuth2 `subjectClaim` support, defaulting to `sub` with `user_id` fallback.
- Strengthened resource and audience validation, including exact matching for audience arrays.
- Sanitized introspection claims before exposing them to MCP tools.
- Corrected Dockerfile example paths.
- Expanded authentication and authorization regression coverage.

### Verification

- Jest: 115 tests passed.
- Coverage: 100% statements, branches, functions, and lines.
- Oxlint: 0 warnings/errors.

## 1.1.2 — Current changes

This release expands the pure-ESM MCP server with production transports, authentication, OAuth2, containers, and examples.

### Added

- Streamable HTTP, HTTPS, and stdio transports.
- TLS certificate file loading and HTTP-to-HTTPS redirects.
- Stateless operation by default, with optional stateful mode.
- Automatic `.mjs` tool discovery and injectable application context.
- Zod schemas and BigInt-safe response helpers.
- Static bearer, bearer passthrough, and generic OAuth2 authentication.
- OAuth2 introspection, protected-resource metadata, PKCE, and client registration helpers.
- Static and dynamic OAuth client support with injectable durable stores.
- Dockerfile, Docker Compose, and TLS Compose examples.
- Examples for basic, static, passthrough, OAuth2, and stdio usage.
- TypeScript declarations and Oxlint integration.

### Changed

- Removed CommonJS files and legacy compatibility APIs.
- Moved examples and bundled tools under `examples/`.
- Removed legacy `port`, `MCP_PORT`, root endpoint, and compatibility routing.
- Refactored implementation into small dependency-injected modules under `src/`.
- Updated package metadata, npm file inclusion, README, and contributor guidance.
- Reorganized tests into one test file per tested module/tool.

### Verification

- Oxlint: 0 warnings/errors.
- Jest: 108 tests passed.
- Coverage: 100% statements, branches, functions, and lines.
- npm package contents verified with `npm pack --dry-run`.

## Historical tags

- `1.1.1` — previous repository baseline.
