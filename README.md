# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/mcp-server [![npm](https://img.shields.io/npm/v/@eliware/mcp-server)](https://www.npmjs.com/package/@eliware/mcp-server) [![License](https://img.shields.io/github/license/eliware/mcp-server)](https://github.com/eliware/mcp-server/blob/main/LICENSE) [![CI](https://github.com/eliware/mcp-server/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/mcp-server/actions/workflows/ci.yaml)

Pure-ESM Node.js MCP server with automatic tool discovery, Streamable HTTP and stdio transports, TLS, Zod schemas, injectable context, bearer authentication, and generic OAuth2 support.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [API](#api)
- [Packaging](#packaging)
- [Examples](#examples)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

- Serve MCP with stateless Streamable HTTP by default.
- Use stdio for local MCP clients.
- Discover `.mjs` tool files beside the server entry point.
- Define tool input schemas with Zod.
- Select no authentication, static bearer tokens, bearer passthrough, or OAuth2 introspection.
- Pass application context to each tool.
- Serve HTTP, HTTPS, or both.
- Embed the MCP endpoint in an Express application.
- Return JSON-safe values with `buildResponse()`.

## Requirements

- Use Node.js 26 or later.
- Use an MCP client for HTTP, HTTPS, or stdio requests.

## Setup

Install the package:

```sh
npm install @eliware/mcp-server
```

Import `mcpServer` and start the server:

```js
import { mcpServer } from "@eliware/mcp-server";

await mcpServer({ auth: { mode: "static", token: process.env.MCP_TOKEN } });
```

Place application tools in a `tools/` folder beside the entry point. The MCP endpoint is `/mcp`.

## Usage

Each tool file must end in `.mjs`. Each file must export one default async registration function.
The function receives `mcpServer`, `toolName`, `log`, and injected context values.

```js
import { buildResponse, z } from "@eliware/mcp-server";

export default async function registerHello({ mcpServer, toolName, log }) {
  mcpServer.tool(toolName, "Say hello.", { name: z.string().min(1) }, async ({ name }) => {
    log.debug(`${toolName} request`, { name });
    return buildResponse({ message: `Hello, ${name}!` });
  });
}
```

Pass database and service values through `context`. Each tool receives those values.

```js
await mcpServer({ context: { db, services } });
```

Set `stdio: true` to use local stdio transport. Do not write logs to stdout in this mode.
Set `httpPort: null` or `httpPort: false` to disable HTTP. Set `httpsPort` to enable HTTPS.
HTTPS requires a TLS key and certificate. Set `tls.key` and `tls.cert`, or set their file paths.
Set `httpRedirect: true` to redirect HTTP requests to HTTPS.
Use `app` to supply an Express app. Use `configureApp` to add middleware before the MCP route.
Use `stateless: false` for stateful transport. The default is stateless transport.
Use `endpointPath` to set the MCP route. The default is `/mcp`.
Use `allowedOrigins` to set allowed CORS origins. Use `entrypoint` to set the tool folder base.
Use `enableJsonResponse: false` to disable JSON responses.

The container example reads `MCP_HTTP_PORT` and `MCP_TOKEN`. TLS file paths use `TLS_KEY_FILE`,
`TLS_CERT_FILE`, and optional `TLS_CA_FILE` when the caller enables HTTPS.

Read [usage notes](docs/usage.md), [troubleshooting notes](docs/troubleshooting.md), and [specifications](specs/README.md).
Read [release notes](RELEASE_NOTES.md) for version changes.

## Development

Install dependencies with `npm ci`. Run `npm run format` to format files.
Run `npm run typecheck` to check declarations.

## Testing

Run `npm test` for lint, format, audit, package, type, convention, and Jest checks.

## Troubleshooting

The server accepts MCP traffic at `/mcp`. Use `stdio: true` for local process clients.
Write logs to stderr in stdio mode. Close server resources during shutdown.

## Security

Keep tokens, OAuth credentials, TLS keys, certificates, and client secrets in environment variables or mounted secret files.
Use HTTPS and explicit authentication for remote deployments. Do not commit `.env` files or certificates.

## API

`mcpServer(options)` starts the server and returns its app, server instances, MCP server, and transport.
Set `auth` to `none`, `static`, `bearer-passthrough`, or `oauth2`. Static mode requires a token.
OAuth2 mode requires an issuer, resource, and introspection function or endpoint settings.
Set `toolsDir` to choose a tool folder. The default uses the entrypoint folder or bundled examples.
Set `context` to pass values to each tool. Set `name` and `version` to override package metadata.
`buildResponse(value)` returns an MCP text result.
`convertBigIntToString(value)` converts BigInt values to strings.
The package exports OAuth helpers, PKCE helpers, authentication helpers, and the Zod namespace.
Read `src/index.d.ts` for option and result types.

## Packaging

The package contains `src/`, `docs/`, `examples/`, `specs/`, and its public metadata files.
Run `npm run pack` to check package contents. Do not publish without the Eliware release process.

## Examples

Read [examples/README.md](examples/README.md) for server and tool examples.
Read [docs/README.md](docs/README.md) for documentation links.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/mcp-server)
- [Bug Reports](https://github.com/eliware/mcp-server/issues)
- [npm](https://www.npmjs.com/package/@eliware/mcp-server)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
