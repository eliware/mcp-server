# Release Notes

## 13.0.0 — 2026-10-19

### Added

- Allow callers to configure TLS on a supplied Fastify app.
- Add Fastify and stdio examples for the SDK v2 server setup.
- Add a v13 migration guide and specifications for API, authentication, documentation, modules, tool setup, and transports.

### Changed

- Load each tool from one module in the consumer tools directory.
- Pass injected application values under the tool registration `context` property.
- Return a shared `close()` method for HTTP and stdio servers.
- Read default server metadata from the consumer package manifest and require explicit values when it cannot be read.
- Resolve JavaScript entry files without requiring the `.mjs` extension and stop loading bundled example tools as a fallback.
- Move OAuth and PKCE helpers to the `@eliware/mcp-server/oauth` subpath.
- Upgrade the package and lock file to version 13.0.0 and the official MCP TypeScript SDK v2 packages.
- Use Fastify for HTTP requests and server lifecycle management.
- Use the SDK v2 request handler to create Streamable HTTP sessions.
- Require protocol revision `2026-07-28` and reject earlier revisions or requests without its envelope.
- Use SDK v2 `registerTool()` for tool setup.
- Keep static bearer checks and OAuth resource metadata routes in Fastify.
- Use a stateless request handler that builds an MCP server for each HTTP request.
- Return an object with the active Fastify app or stdio transport from server startup.
- Rename `httpPort` to `port`, replace Express options with Fastify options, and update declarations.
- Move authentication, client, OAuth, PKCE, server, and tool modules into domain directories with matching tests.
- Update examples, API guidance, configuration guidance, and tool instructions for v13.
- Rewrite repository and user documentation to follow ASD-STE100 language rules.
- Align CI with the shared test workflow and fetch full Git history for tag checks.
- Replace the publish workflow with the canonical npm workflow.
- Update Knit deployment commands to pull the current repository changes.

### Breaking changes

- Replace the two-file tool adapter and handler pattern with one tool module.
- Replace flattened tool context properties with the `context` property.
- Replace transport-specific result properties with the shared `close()` method.
- Remove OAuth and PKCE helpers from the root and utility exports. Import them from `@eliware/mcp-server/oauth`.
- Remove Express support and Express examples.
- Remove the SDK v1 dependency and compatibility paths.
- Remove built-in TLS file loading and HTTP-to-HTTPS redirect support. Configure TLS on a supplied Fastify app.
- Remove stateful transport options and JSON response configuration.
- Remove the returned MCP server, listener, and transport details that are not active for the selected mode.

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
