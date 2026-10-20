# API reference

Import server and auth functions from `@eliware/mcp-server`.
Import OAuth and PKCE functions from `@eliware/mcp-server/oauth`.
Import low-level helpers from `@eliware/mcp-server/utilities`.
Use [configuration](configuration.md) for server options and [authentication](authentication.md) for auth setup.
Read `src/index.d.ts` for exact TypeScript signatures.

## Server and tools

| Export               | Use                                                                            |
| -------------------- | ------------------------------------------------------------------------------ |
| `mcpServer(options)` | Start the server. Return an object with `close()` and an optional Fastify app. |
| `z`                  | Define tool input schemas with Zod.                                            |

## Authentication

| Export                       | Use                                                         |
| ---------------------------- | ----------------------------------------------------------- |
| `normalizeAuth(auth)`        | Validate and normalize an auth mode.                        |
| `requireAuth(extra)`         | Return auth data or throw when the caller has no auth data. |
| `requireBearer(extra)`       | Return the caller token or throw when it is missing.        |
| `getAccessToken(extra)`      | Return the caller token or `null`.                          |
| `getUser(extra)`             | Return user details or `null`.                              |
| `hasScope(extra, scope)`     | Check if auth data has a scope.                             |
| `requireScope(extra, scope)` | Throw when auth data lacks a scope.                         |

## OAuth exports

Import OAuth, introspection, and PKCE helpers from `@eliware/mcp-server/oauth`.
Use this subpath for advanced authentication and client workflows.

| Export                                     | Use                                                                    |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `createOAuthIntrospector(options)`         | Check bearer tokens with an OAuth introspection endpoint.              |
| `createOAuthClient(options)`               | Create an OAuth client with provider and authorization code functions. |
| `discoverOAuthProvider(options)`           | Read provider metadata from an issuer.                                 |
| `registerOAuthClient(options)`             | Send client data to an OAuth endpoint.                                 |
| `createClientStore(options)`               | Create storage for OAuth client data.                                  |
| `resolveOAuthClient(options)`              | Find or add an OAuth client through a store.                           |
| `createPkceState(options)`                 | Create a PKCE verifier, state, and challenge.                          |
| `createPkceStore(options)`                 | Create storage for one-time PKCE state.                                |
| `consumePkceState(options)`                | Read and validate a PKCE state value.                                  |
| `setOAuthChallenge(response, options)`     | Set the OAuth resource challenge header.                               |
| `mountOAuthResourceMetadata(app, options)` | Add OAuth protected resource metadata routes to Fastify.               |

## Utility exports

Import each function in this section from `@eliware/mcp-server/utilities`.

| Export                             | Use                                                           |
| ---------------------------------- | ------------------------------------------------------------- |
| `buildResponse(value)`             | Return a value as MCP text. Convert BigInt values to strings. |
| `convertBigIntToString(value)`     | Convert BigInt values in supported data to strings.           |
| `stderrLogger`                     | Use the default logger that writes to stderr.                 |
| `createListeningHandler(context)`  | Create a listener callback that writes its network number.    |
| `listeningCallback(context, port)` | Write that a server listens on a network number.              |

## Types

The package exports `AuthMode`, `AuthConfig`, `McpServerOptions`, `McpServerResult`, and `ToolRegistrationContext`.
The result type has `close()` and an optional Fastify app.
The `McpServerOptions` type lists supported network, transport, auth, context, and logger values.
