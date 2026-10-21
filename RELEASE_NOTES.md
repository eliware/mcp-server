# Release Notes

## 15.0.0 — 2026-10-21

### Changed

- Set the package version to 15.0.0 and the maintained specification versions to 15.0.
- Upgrade `@eliware/log`, `@eliware/path`, and `@eliware/test` to version 15.
- Update the lock file after the dependency updates.
- Move the migration guide to version 15 and update its OAuth guidance.
- Align repository documentation and indexes with Eliware Test 15 conventions.
- Move tool directory normalization into a focused module with a matching test.
- Remove repeated OAuth client validation assertions and keep response tests focused.

### Security

- Require a random session value before the client creates an OAuth authorization URL.
- Store the session value with each PKCE verifier and check it before a token request.
- Preserve a PKCE verifier when a callback has a mismatched session value.
- Consume a verifier once after the callback session value matches.
- Require applications to trust and allowlist OAuth issuers before client setup.

### Breaking changes

- Add required `sessionState` input to `authorizationUrl`.
- Change custom PKCE stores to validate `expectedState` in `consume(state, expectedState)`.

### Migration

- Save a random session value before calling `authorizationUrl` and pass it as `sessionState`.
- Update custom stores to preserve records on mismatches and remove matching records atomically.
- Keep the current `mcpServer` options and tool registration modules.

## 14.0.0 — 2026-10-21

### Added

- Require the OAuth callback state to match the state saved in the user session before a token request.
- Store each PKCE verifier with its state and remove it after one use.
- Add an in-memory PKCE store by default and allow consumers to provide a store for shared process state.
- Add deployment, Fastify customization, and testing guides.

### Changed

- Set the package version to 14.0.0 and the specification versions to 14.0.
- Upgrade `@eliware/log`, `@eliware/path`, and `@eliware/test` to version 14.
- Refresh the lock file with the latest dependency releases.
- Split server authentication, OAuth flows, token checks, and BigInt conversion into focused modules with focused tests.
- Share bearer parsing between server authentication and tool context helpers.
- Preserve provider query parameters when the client builds an OAuth authorization URL.
- Normalize string file URLs and Windows entrypoint paths.
- Read verified authentication data from the MCP request context supplied by the SDK.
- Preserve request metadata when no validated authentication data exists.
- Align specifications, repository guidance, and user documentation with Eliware Test 14 conventions.
- Rewrite and expand user documentation with setup, deployment, Fastify, authentication, API, and testing guidance.
- Remove duplicate BigInt conversion test cases while retaining cycle and conversion coverage.

### Security

- Reject OAuth callbacks when the returned state does not match the user session.
- Consume each PKCE verifier through one atomic store operation before the client sends a token request.
- Require custom PKCE stores to return and remove a verifier atomically across processes.

### Breaking changes

- Return a promise with the authorization URL and state from `authorizationUrl`.
- Remove caller-supplied PKCE verifiers from `exchangeCode`. Require `state` and `expectedState`.
- Add the optional `pkceStore` client option. Use a shared store when requests can run in multiple processes.
- Replace custom PKCE store `load` and `remove` functions with atomic `consume(state)`.

## 13.0.0 — 2026-10-19

### Added

- Allow callers to configure TLS on a supplied Fastify app.
- Export `createListenerErrorHandler` from the utilities entry point.
- Add Tools, Resources, Prompts, Transport, Authentication, and Schemas summaries to the README.
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
- Replace `@eliware/common` with direct `@eliware/log` and `@eliware/path` dependencies.
- Use `PORT` in the supplied environment and container examples.
- Split authentication context, OAuth client setup, and listener error handling into focused modules with matching tests.
- Move authentication, client, OAuth, PKCE, server, and tool modules into domain directories with matching tests.
- Update examples, API guidance, configuration guidance, and tool instructions for v13.
- Remove content from `AGENTS.md` and `README.md` that the shared conventions do not require.
- Rewrite repository and user documentation to follow ASD-STE100 language rules.
- Align CI with the shared test workflow and fetch full Git history for tag checks.
- Replace the publish workflow with the canonical npm workflow.
- Update Knit deployment commands to pull the current repository changes.

### Security

- Require HTTPS for OAuth issuer, introspection, authorization, registration, and token endpoints.
- Reject OAuth endpoint URLs with other schemes before a helper sends a request.

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
