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

- Serve MCP over Streamable HTTP or stdio.
- Discover tool files that end in `.mjs`.
- Define tool inputs with Zod.
- Use no auth, static bearer tokens, bearer passthrough, or OAuth2 introspection.
- Pass application values to each tool through `context`.
- Serve HTTP, HTTPS, or both.
- Add the MCP route to an Express app.
- Return JSON-safe values with `buildResponse()`.

## Requirements

- Use Node.js 26 or later.
- Use an MCP client that supports the selected transport.
- Set a tool directory or let the server use the directory beside its entry file.

## Setup

Install the package:

```sh
npm install @eliware/mcp-server
```

Create a server entry file:

```js
import { mcpServer } from "@eliware/mcp-server";

await mcpServer({
  httpPort: 1234,
  auth: { mode: "static", token: process.env.MCP_TOKEN },
});
```

Set `MCP_TOKEN` before you start a protected HTTP server. The default HTTP endpoint is `/mcp`.

## Usage

Put one `.mjs` file for each tool in the `tools/` directory beside the server entry file.
Each file must export one default async function. The server calls this function at startup.

```js
import { buildResponse, z } from "@eliware/mcp-server";

export default async function registerHello({ mcpServer, toolName, log }) {
  mcpServer.tool(toolName, "Say hello.", { name: z.string().min(1) }, async ({ name }) => {
    log.debug(`${toolName} request`, { name });
    return buildResponse({ message: `Hello, ${name}!` });
  });
}
```

Pass app values through `context`. Each tool receives them as named properties.

```js
await mcpServer({ context: { db, services } });
```

Read the [usage guide](docs/usage.md), [configuration guide](docs/configuration.md), and [auth guide](docs/authentication.md).
Browse the [docs index](docs/README.md) and [spec index](specs/README.md).
Read [release notes](RELEASE_NOTES.md) for released changes.

## Development

Install the locked dependencies with `npm ci`.
Run `npm run format` to format files.
Run `npm run typecheck` to check declarations.

## Testing

Run `npm test` for lint, format, audit, package, type, convention, and Jest checks.

## Troubleshooting

Send HTTP requests to `/mcp` unless you set `endpointPath`.
Set `stdio: true` for a local process client. Send logs to stderr in stdio mode.
Close the returned HTTP and HTTPS server instances during shutdown.
Read the [troubleshooting guide](docs/troubleshooting.md) for common setup faults.

## Security

Store tokens, OAuth client secrets, and TLS keys in environment variables or secret files.
Use HTTPS and explicit authentication for remote access.
Do not commit `.env` files, certificates, or private keys.
Read the [auth guide](docs/authentication.md) before you expose an endpoint.

## API

`mcpServer(options)` starts the server and returns its app, server instances, MCP server, and transport.
Set `auth` to `none`, `static`, `bearer-passthrough`, or `oauth2`.
Set `toolsDir` to select a tool directory. The default uses the entry file directory or bundled examples.
Set `context` to pass values to each tool. Set `name` and `version` to set MCP metadata.
`buildResponse(value)` returns an MCP text result. `convertBigIntToString(value)` converts BigInt values.
The package exports auth, OAuth, and PKCE helpers, plus the Zod namespace.
Read `src/index.d.ts` for option and result types.

## Packaging

The package includes `src/`, `docs/`, `examples/`, `specs/`, and package metadata.
Run `npm run pack` to check package contents. Publication follows the Eliware release process.

## Examples

Read [examples/README.md](examples/README.md) for server and tool examples.

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
