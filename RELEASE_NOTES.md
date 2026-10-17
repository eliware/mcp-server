# Release Notes

## 13.0.0 — 2026-10-17

### Changed

- Set the package version to 13.0.0 and sync the npm lock file.
- Move auth, client, OAuth, PKCE, redirect, server, and tool modules into domain directories.
- Move each matching test into the same domain layout and update module imports.
- Replace the publish workflow file with the canonical npm workflow.
- Use `git pull` in the Knit deployment commands.
- Rewrite project prose to follow ASD-STE100 language rules.
- Add focused test instructions and full-suite validation rules to `AGENTS.md`.

## 12.0.0 — 2026-10-13

### Added

- Provide HTTP, HTTPS, and stdio transports with TLS support.
- Add Express app support and REST-plus-MCP examples.
- Add static bearer tokens, bearer passthrough, OAuth2 introspection, scopes, and subject claims.
- Add OAuth client setup, authorization code flow, PKCE, and client storage.
- Add tool file loading, injected context, Zod schemas, response helpers, and TypeScript declarations.
- Add Docker, Express, stdio, static token, passthrough, and OAuth examples.
- Add setup, configuration, tools, authentication, API, requirements, and troubleshooting guides.

### Changed

- Move runtime code and declarations into `src/`. Move examples into `examples/`.
- Use native ESM and require Node.js 26 or later.
- Keep stateless Streamable HTTP as the default. Support stateful HTTP and stdio modes.
- Cache tool loading in stateless mode and refresh tool lists between server builds.
- Use package metadata for server names and versions.
- Add lint, TypeScript, format, audit, package, and coverage checks to validation.
- Update dependencies, npm metadata, CI workflows, and the lock file.

### Fixed

- Check OAuth tokens, scopes, client IDs, endpoints, and redirect hosts.
- Remove OAuth state after use and reject empty state values.
- Clean token claims before tools receive them.
- Support Windows entry file paths and keep loaded tool modules in cache.
- Stop listeners after startup failures and contain listener error output.
- Fail startup when a tool file cannot load or add its tool.
- Convert BigInt response values and reject circular response data.
- Make CI fail when lint reports warnings on supported platforms.
