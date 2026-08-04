# @eliware/mcp-server

A minimal, pure-ESM MCP server for Node.js. Drop `.mjs` tools into `tools/`, start one entrypoint, and the library discovers and registers them automatically.

## Features

- Stateless Streamable HTTP by default.
- Optional stdio transport for local MCP clients.
- Optional stateful transport mode.
- Automatic `.mjs` tool discovery.
- Zod input schemas.
- Bearer-token or custom async authentication.
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
  authToken: process.env.MCP_TOKEN,
});
```

Put tools in `./tools/`. The MCP endpoint is `/mcp` only. There is no root or legacy compatibility endpoint.

See `example.mjs` for a complete entrypoint example. Put application tools in a `tools/` folder beside that entrypoint.

## Local stdio mode

For local clients that launch the server as a child process:

```js
await mcpServer({ stdio: true });
```

stdio uses stdin/stdout for MCP JSON-RPC. Do not write logs to stdout; use stderr instead. HTTP remains the default for remote deployments.

## Tool template

Create `tools/hello.mjs`:

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

- `authToken`: static bearer token; defaults to `MCP_TOKEN`.
- `authCallback(token)`: custom async authentication.
- `toolsDir`: custom tool directory. Defaults to `<entrypoint-directory>/tools/`; when no entrypoint is available, uses the bundled `tools/` directory.
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
docker run --rm -i -e MCP_TOKEN=test ghcr.io/eliware/mcp-server node example.mjs --stdio
```
