# Release Notes

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
