# AGENTS.md

## Purpose

`@eliware/mcp-server` is a minimal, pure-ESM Node.js MCP server.
It auto-discovers `.mjs` tools from a tools directory.

## Repository layout

- `index.mjs`: public package entrypoint.
- `index.d.ts`: TypeScript declarations.
- `src/`: small, independently testable implementation modules.
- `examples/tools/`: bundled example tools.
- `tests/`: one test file per tested source module/tool.
- `examples/basic.mjs`: minimal server entrypoint example.

## Tool contract

Every tool file must:

- Use the `.mjs` extension.
- Export one default async registration function.
- Accept `{ mcpServer, toolName, log, ...context }`.
- Register with `mcpServer.tool(...)`.
- Use Zod schemas for inputs.
- Return MCP-compatible results, preferably via `buildResponse()`.

## Development

```bash
npm install
npm run lint
npm test
```

`npm test` runs Jest with coverage. Coverage output is ignored.

## Design rules

- Pure ESM only; do not add CommonJS files or `require()` usage.
- Keep modules small and dependency-injectable.
- Preserve stateless Streamable HTTP behavior by default.
- Avoid global mutable MCP session state.
- Keep authentication and context injection explicit.
- Do not log bearer tokens or application secrets.
- Maintain TypeScript declarations when public APIs change.
- Keep README and `examples/` aligned with the public API.

## Testing rules

- Add/update the corresponding test file for every source change.
- Maintain 100% statements, branches, functions, and lines coverage.
- Test both success and failure paths.
- Run lint and the full test suite before reporting completion.

## Release/deployment

- Do not commit, tag, publish, or push unless explicitly requested.
- Package metadata, exports, README, declarations, and tests must agree.
- Verify the local MCP smoke test after transport changes.

## Configuration contract

Use the modern configuration API only:

- `httpPort` for HTTP, `httpsPort` plus `tls` for HTTPS, or `stdio: true`.
- `/mcp` is the only MCP endpoint.
- No `port`, `MCP_PORT`, root endpoint, or legacy compatibility aliases.
- TLS may use direct values or `keyFile`/`certFile`/`caFile`; environment file variables are supported.
- Keep credentials outside source control and containers; use environment variables or mounted secret files.
