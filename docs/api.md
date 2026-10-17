# API reference

Import server, auth, and OAuth workflow functions from `@eliware/mcp-server`.
Import low-level helpers from `@eliware/mcp-server/utilities`.
Use [configuration](configuration.md) for server options and [authentication](authentication.md) for auth setup.
Read `src/index.d.ts` for exact TypeScript signatures.

## Server and tools

| Export               | Use                                                                         |
| -------------------- | --------------------------------------------------------------------------- |
| `mcpServer(options)` | Start the MCP server. Return the app, listeners, MCP server, and transport. |
| `z`                  | Define tool input schemas with Zod.                                         |

## Authentication

| Export                             | Use                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `normalizeAuth(auth)`              | Validate and normalize an auth mode.                                      |
| `requireAuth(extra)`               | Return auth data or throw when the caller has no auth data.               |
| `requireBearer(extra)`             | Return the caller token or throw when it is missing.                      |
| `getAccessToken(extra)`            | Return the caller token or `null`.                                        |
| `getUser(extra)`                   | Return user details or `null`.                                            |
| `hasScope(extra, scope)`           | Check if auth data has a scope.                                           |
| `requireScope(extra, scope)`       | Throw when auth data lacks a scope.                                       |
| `createOAuthIntrospector(options)` | Create a function that checks tokens at an OAuth2 introspection endpoint. |

## OAuth client helpers

| Export                       | Use                                                                |
| ---------------------------- | ------------------------------------------------------------------ |
| `createOAuthClient(options)` | Create an OAuth client from an issuer, client, and optional store. |

`createOAuthClient()` returns provider metadata and client credentials.
It also returns `authorizationUrl()` and `exchangeCode()` functions for the PKCE authorization code flow.
Use a saved store when you select dynamic client registration.
`resolveOAuthClient()` supports static credentials and dynamic registration through a store.

## Utility exports

Import each function in this section from `@eliware/mcp-server/utilities`.

| Export                                        | Use                                                                  |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `buildResponse(value)`                        | Return a value as MCP text. Convert BigInt values to strings.        |
| `convertBigIntToString(value)`                | Convert BigInt values in supported data to strings.                  |
| `stderrLogger`                                | Use the default logger that writes to stderr.                        |
| `discoverOAuthProvider(options)`              | Read provider metadata from an issuer.                               |
| `registerOAuthClient(options)`                | Send client data to an OAuth endpoint.                               |
| `createClientStore(options)`                  | Create a client store from load, save, and remove functions.         |
| `resolveOAuthClient(options)`                 | Find or add an OAuth client through a store.                         |
| `createPkceState(options)`                    | Create a PKCE verifier, state, and challenge.                        |
| `createPkceStore(options)`                    | Create a store with `save`, `load`, and one-time `remove` functions. |
| `consumePkceState(options)`                   | Read and validate a PKCE state value from a store.                   |
| `setOAuthChallenge(response, options)`        | Set the OAuth resource challenge response header.                    |
| `mountOAuthResourceMetadata(app, options)`    | Add OAuth protected resource metadata routes to an app.              |
| `handleRequestFailure(context, error)`        | Write a request error and send an HTTP error response.               |
| `requestEndpoint(context, request, response)` | Call the MCP request handler and report a failure.                   |
| `createPostHandler(context)`                  | Create an Express handler for MCP POST requests.                     |
| `createListeningHandler(context)`             | Create a listener callback that writes its network number.           |
| `listeningCallback(context, port)`            | Write that a server listens on a network number.                     |
| `createRedirectApp(options)`                  | Create an Express app that redirects requests to HTTPS.              |

## Types

The package exports `AuthMode`, `AuthConfig`, `McpServerOptions`, `McpServerResult`, and `ToolRegistrationContext`.
It also exports `NextFunction` from Express.
The `McpServerOptions` type lists supported network, transport, auth, TLS, context, and logger values.
