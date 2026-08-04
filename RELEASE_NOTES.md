# Release Notes

## 1.1.2 — Current changes

This release modernizes the package into a minimal, pure-ESM MCP server.

### Added

- Stateless Streamable HTTP transport by default.
- Optional stateful transport mode.
- Automatic `.mjs` tool discovery from `tools/`.
- Zod schema support for tool inputs.
- Injectable application context for databases and services.
- Bearer-token and custom async authentication.
- Configurable MCP endpoint, CORS origins, and JSON responses.
- TypeScript declarations in `index.d.ts`.
- Minimal `example.mjs` entrypoint.
- Documented ideal tool template in `tools/echo.mjs`.
- Modular, dependency-injected implementation under `src/`.
- Oxlint integration.
- Full Jest coverage reporting.

### Changed

- Removed all CommonJS files and exports.
- Tool loading now accepts `.mjs` files only.
- README and package metadata rewritten around the minimal tool-first workflow.
- Tests reorganized into one test file per tested module/tool.
- Error handling and MCP session behavior improved for independent clients and replicas.
- Added HTTP/HTTPS listener selection, TLS file loading, HTTP redirect mode, and stdio transport.
- Removed legacy `port`, `MCP_PORT`, root endpoint, and compatibility routing.

### Verification

- Oxlint: 0 warnings/errors.
- Jest: 42 tests passed.
- Coverage: 100% statements, branches, functions, and lines.

## Historical tags

- `1.1.1` — previous repository baseline.
