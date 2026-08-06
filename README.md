# @eliware/mcp-server

A minimal, pure-ESM MCP server for Node.js. Drop `.mjs` tools into an entrypoint-adjacent `tools/` directory, start one entrypoint, and the library discovers and registers them automatically.

## Features

- Stateless Streamable HTTP by default.
- Optional stdio transport for local MCP clients.
- Optional stateful transport mode.
- Automatic `.mjs` tool discovery.
- Zod input schemas.
- None, static bearer, bearer passthrough, and OAuth2 authentication modes.
- Injectable application context for databases and services.
- BigInt-safe `buildResponse()` helper.
- Express HTTP integration.
- HTTP, HTTPS, or both, with optional HTTP-to-HTTPS redirects.
- TypeScript declarations.

## Install

```bash
npm install @eliware/mcp-server
```

## Minimal server

```js
// server.mjs
import { mcpServer } from '@eliware/mcp-server';

await mcpServer({
  auth: { mode: 'static', token: process.env.MCP_TOKEN },
});
```

Put tools in `./tools/`. The MCP endpoint is `/mcp` only. There is no root or legacy compatibility endpoint.

See `examples/basic.mjs` for a complete entrypoint example. Put application tools in a `tools/` folder beside that entrypoint.

## Local stdio mode

For local clients that launch the server as a child process:

```js
await mcpServer({ stdio: true });
```

stdio uses stdin/stdout for MCP JSON-RPC. Do not write logs to stdout; use stderr instead. HTTP remains the default for remote deployments.

## Tool template

Create `tools/hello.mjs` beside your entrypoint:

```js
import { z, buildResponse } from '@eliware/mcp-server';

export default async function registerHello({ mcpServer, toolName, log, db }) {
  mcpServer.tool(
    toolName,
    'Say hello.',
    { name: z.string().min(1) },
    async ({ name }) => {
      log.debug(`${toolName} request`, { name });
      // `db` and other values come from mcpServer({ context: { db } }).
      void db;
      return buildResponse({ message: `Hello, ${name}!` });
    },
  );
}
```

Tool requirements:

1. File ends in `.mjs`.
2. File exports one default async registration function.
3. The function receives `{ mcpServer, toolName, log, ...context }`.
4. Call `mcpServer.tool(name, description, inputSchema, handler)`.
5. Define handler inputs with Zod (`z.string()`, `z.number()`, `z.object()`, etc.).
6. Return an MCP result, normally using `buildResponse(value)`.

## Injected context

```js
await mcpServer({
  context: { db, config, services },
});
```

Every tool receives those values as properties of its registration argument.

## Configuration

`mcpServer(options)` supports:

- `auth`: `{ mode: 'none' | 'static' | 'bearer-passthrough' | 'oauth2', ... }`.
- `toolsDir`: custom tool directory. Defaults to `<entrypoint-directory>/tools/`; when no entrypoint is available, uses the bundled `examples/tools/` directory.
- `httpPort`: HTTP listener port; set `null`/`false` to disable HTTP.
- `httpsPort`: HTTPS listener port. Requires TLS key/certificate material or file paths.
- `tls`: Node HTTPS TLS options (`key`, `cert`, optional `ca`) or file paths (`keyFile`, `certFile`, `caFile`). If omitted, `TLS_KEY_FILE`, `TLS_CERT_FILE`, and `TLS_CA_FILE` are used.
- `httpRedirect`: when true, HTTP redirects to HTTPS instead of serving MCP.
- `context`: values injected into every tool.
- `stateless`: defaults to `true`; creates a fresh server/transport per request.
- `endpointPath`: defaults to `/mcp`; use one explicit endpoint path per deployment.
- `enableJsonResponse`: defaults to `true`.
- `allowedOrigins`: optional CORS allowlist.
- `entrypoint`: entrypoint path used to resolve the default sibling `tools/` directory.
- `app`: optional caller-supplied Express application. When omitted, the server creates one as before.
- `configureApp`: optional callback invoked with the application after built-in HTTP middleware is installed and before the MCP route.

### Existing Express application

Embed MCP in an existing Express app by supplying `app`. Use `configureApp` for application-specific middleware or routes:

```js
await mcpServer({
  app,
  configureApp: configuredApp => {
    configuredApp.use(requestIdMiddleware);
  },
});
```

Both options are optional; without them, `mcpServer` creates and configures its own app.

## API helpers

- `buildResponse(value)`: returns `{ content: [{ type: 'text', text }] }`.
- `convertBigIntToString(value)`: recursively converts BigInts to strings.
- `z`: re-exported Zod namespace.

## TypeScript

Type declarations are included in `index.d.ts`.

## Development

```bash
npm install
npm run lint
npm test
```

## License

MIT © Eli Sterling, eliware.org

## HTTPS

HTTPS only:

```js
await mcpServer({
  httpPort: null,
  httpsPort: 443,
  tls: { key: process.env.TLS_KEY, cert: process.env.TLS_CERT },
});
```

Both listeners, redirecting HTTP to HTTPS:

```js
await mcpServer({
  httpPort: 80,
  httpsPort: 443,
  httpRedirect: true,
  tls: { key: process.env.TLS_KEY, cert: process.env.TLS_CERT },
});
```

Set `httpRedirect: false` to serve MCP over both listeners. The returned result exposes `httpInstance` and `httpsInstance`.

## Containers

Local HTTP test:

```bash
cp .env.example .env
# set MCP_TOKEN in .env
docker compose up --build
```

HTTPS automatically loads TLS files from `tls.keyFile`/`certFile`/`caFile`, or `TLS_KEY_FILE`/`TLS_CERT_FILE`/`TLS_CA_FILE`; mount certificates read-only and never commit them. `docker-compose.tls.yml` exposes ports 80 and 443 for that deployment pattern.

The container uses `container.mjs` so the local package source resolves correctly. Local stdio remains a process mode, not a Docker network service:

```bash
docker run --rm -i -e MCP_TOKEN=test ghcr.io/eliware/mcp-server node examples/basic.mjs --stdio
```

## Authentication modes

Unauthenticated:

```js
auth: { mode: 'none' }
```

Static token:

```js
auth: { mode: 'static', token: process.env.MCP_TOKEN }
```

Bearer passthrough validates that a bearer exists and exposes it to tools through request metadata for backend API calls:

```js
auth: { mode: 'bearer-passthrough' }
```

OAuth2 uses the same request-scoped auth context as the other modes. Tools should use `requireAuth(extra)` or `requireBearer(extra)` rather than reading raw request headers.


OAuth2 resource-server mode validates introspection results and injects sanitized request identity plus granted scopes into tool metadata. `requiredScopes` defines the minimum scopes a token must grant; the complete granted scope list remains available to tools:

```js
auth: {
  mode: 'oauth2',
  issuer: 'https://auth.example',
  resource: 'https://app.example/mcp',
  requiredScopes: ['app:read'],
  introspect: token => introspectToken(token),
}
```

The introspection function is application-provided so the library does not hard-code an identity provider or persistence system. Static and dynamic OAuth client registration are available through the client-side helpers below.


## OAuth client registration

The package exports provider discovery and dynamic registration helpers. Applications choose static credentials or persist dynamically registered credentials through an injected store; the library does not require a database.

```js
const provider = await discoverOAuthProvider({ issuer });
const client = await registerOAuthClient({
  registrationEndpoint: provider.registration_endpoint,
  metadata: { client_name: 'my-app', redirect_uris: ['https://app.example/callback'] },
});
```

Use `createClientStore({ load, save, remove })` with MySQL, Kubernetes secrets, or another durable store.


OAuth2 mode also publishes protected-resource metadata at:

- `/.well-known/oauth-protected-resource`
- `/.well-known/oauth-protected-resource/mcp`

Unauthorized OAuth2 responses include `WWW-Authenticate` resource metadata and required scopes.

For backward compatibility, `scopes` is accepted as an alias for `requiredScopes`, but new integrations should use `requiredScopes`.


Dynamic client registration is resolved once and cached through the injected client store. Static registration bypasses registration and returns configured credentials. The store must be durable when running multiple replicas.


For app-side OAuth login, `createOAuthClient()` combines provider discovery and static/dynamic client resolution, then provides PKCE authorization URL creation and authorization-code exchange. Applications remain responsible for state/verifier persistence and user sessions.


Auth helper exports:

- `requireScope(extra, scope)` — throws a 403-style error when absent.
- `hasScope(extra, scope)` — boolean scope check.
- `getUser(extra)` — sanitized request identity.
- `getAccessToken(extra)` — explicit backend passthrough accessor.

OAuth2 may use the generic introspection adapter with `auth.introspection.endpoint` and optional client credentials, or an injected `auth.introspect` function.


PKCE helpers provide S256 verifier/challenge generation and one-time state consumption. Applications should persist PKCE records through a durable store and delete them after callback validation.
