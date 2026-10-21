# API reference

Import server and auth functions from `@eliware/mcp-server`.
Import OAuth and PKCE functions from `@eliware/mcp-server/oauth`.
Import low-level helpers from `@eliware/mcp-server/utilities`.
Use [configuration](configuration.md) for server options and [authentication](authentication.md) for auth setup.
The package includes TypeScript declarations for its public API.

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

| Export                                     | Use                                                       |
| ------------------------------------------ | --------------------------------------------------------- |
| `createOAuthIntrospector(options)`         | Check bearer tokens with an OAuth introspection endpoint. |
| `createOAuthClient(options)`               | Create a state-checked OAuth authorization code flow.     |
| `discoverOAuthProvider(options)`           | Read provider metadata from an issuer.                    |
| `registerOAuthClient(options)`             | Send client data to an OAuth endpoint.                    |
| `createClientStore(options)`               | Create storage for OAuth client data.                     |
| `resolveOAuthClient(options)`              | Find or add an OAuth client through a store.              |
| `createPkceState(options)`                 | Create a PKCE verifier, state, and challenge.             |
| `createPkceStore(options)`                 | Create storage with atomic PKCE state consumption.        |
| `consumePkceState(options)`                | Validate and atomically consume a PKCE state value.       |
| `setOAuthChallenge(response, options)`     | Set the OAuth resource challenge header.                  |
| `mountOAuthResourceMetadata(app, options)` | Add OAuth protected resource metadata routes to Fastify.  |

The OAuth client stores each PKCE verifier with a session value until it exchanges the matching code.
Save a random session value before you start OAuth.
Set the `sessionState` option in `authorizationUrl` to that value.
Pass the callback state and the saved session value to `exchangeCode`.
The client checks the saved value against the value stored with the PKCE verifier.
The client rejects a missing or mismatched value before it sends a token request.

Pass a shared `pkceStore` to `createOAuthClient` when requests can run in multiple processes.
A shared store must save the session value with each verifier.
A shared store must return and remove each record in one atomic `consume(state)` call.

## Utility exports

Import each function in this section from `@eliware/mcp-server/utilities`.

| Export                                | Use                                                           |
| ------------------------------------- | ------------------------------------------------------------- |
| `buildResponse(value)`                | Return a value as MCP text. Convert BigInt values to strings. |
| `convertBigIntToString(value)`        | Convert BigInt values in supported data to strings.           |
| `stderrLogger`                        | Use the default logger that writes to stderr.                 |
| `createListenerErrorHandler(context)` | Create a callback that logs listener errors.                  |
| `createListeningHandler(context)`     | Create a callback that logs when the server starts.           |
| `listeningCallback(context, port)`    | Log that the server listens on the supplied port.             |

## Types

The package exports `AuthMode`, `AuthConfig`, `McpServerOptions`, `McpServerResult`, and `ToolRegistrationContext`.
The result type has an asynchronous `close()` method and an optional Fastify app.
The `McpServerOptions` type lists supported network, transport, auth, context, and logger values.
The `ToolRegistrationContext` type describes values that the server passes to a tool module.
