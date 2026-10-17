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

- Run MCP with Streamable HTTP or stdio.
- Load tool files that end in `.mjs`.
- Define tool inputs with Zod.
- Select no authentication, a static bearer token, bearer passthrough, or OAuth2 introspection.
- Pass application values to each tool through `context`.
- Start an HTTP server with Fastify.
- Supply a Fastify instance for HTTPS or custom plugins.
- Return JSON-safe values with `buildResponse()`.

## Requirements

- Use Node.js 26 or later.
- Use an MCP client that supports protocol revision `2026-07-28` and the selected transport.
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
  port: 1234,
  auth: { mode: "static", token: process.env.MCP_TOKEN },
});
```

Set `MCP_TOKEN` before you start a protected HTTP server. In PowerShell, run `$env:MCP_TOKEN = "your-secret"`. In a POSIX shell, run `export MCP_TOKEN="your-secret"`. The default HTTP endpoint is `/mcp`.

## Usage

Put one `.mjs` adapter in `tools/` and one matching handler in `src/tools/` for each tool.
The adapter re-exports the handler. The server loads the handler when it creates an SDK server.

```js
import { z } from "@eliware/mcp-server";
import { buildResponse } from "@eliware/mcp-server/utilities";

export default async function registerHello({ mcpServer, toolName, log }) {
  mcpServer.registerTool(
    toolName,
    { description: "Say hello.", inputSchema: { name: z.string().min(1) } },
    async ({ name }) => {
      log.debug(`${toolName} request`, { name });
      return buildResponse({ message: `Hello, ${name}!` });
    },
  );
}
```

Create `tools/hello.mjs` with `export { default } from "../src/tools/hello.mjs";`.

### Tools

Add each tool handler and its matching adapter.

### Resources

Add resources through the MCP SDK. The package does not scan resource files.

### Prompts

Add prompts through the MCP SDK. The package does not scan prompt files.

### Transport

Use Streamable HTTP or stdio. The package does not support HTTP with SSE.

### Authentication

Select no authentication, a static bearer token, bearer passthrough, or OAuth introspection.

### Schemas

Use the exported `z` value to define tool input schemas.

Pass app values through `context`. Each tool receives them as named properties.

```js
await mcpServer({ context: { db, services } });
```

Read the [usage guide](docs/usage.md), [configuration guide](docs/configuration.md), and [auth guide](docs/authentication.md).
Browse the [docs index](docs/README.md) and [spec index](specs/README.md).
Read [release notes](RELEASE_NOTES.md) for released changes.

## Development

Install the locked dependencies with `npm ci`.
Run `eliware-test --format` to format files.
Run `npm run typecheck` to check declarations.

## Testing

Run `eliware-test` for lint, format, audit, package, type, convention, and Jest checks.

## Troubleshooting

Send HTTP requests to `/mcp` unless you set `endpointPath`.
Set `stdio: true` for a local process client. Send logs to stderr in stdio mode.
Close the Fastify app during shutdown.
Read the [troubleshooting guide](docs/troubleshooting.md) for frequent setup faults.

## Security

Store tokens, OAuth client secrets, and TLS keys in environment variables or secret files.
Use HTTPS and explicit authentication for remote access.
Do not commit `.env` files, certificates, or private keys.
Read the [auth guide](docs/authentication.md) before you expose an endpoint.

## API

`mcpServer(options)` starts Fastify or stdio and returns an object with the active app or transport.

Set `auth` to `none`, `static`, `bearer-passthrough`, or `oauth2`.

Set `toolsDir` to point to a tool directory. The default uses the entry file directory or bundled examples.

Set `context` to pass values to each tool. Set `name` and `version` to set MCP metadata.

Import `buildResponse` and `convertBigIntToString` from `@eliware/mcp-server/utilities`.

The package exports auth, OAuth, and PKCE helpers, plus the Zod namespace.

Read `src/index.d.ts` for option and result types.

## Packaging

The package includes `src/`, `docs/`, `examples/`, `specs/`, and package metadata.
Run `eliware-test --pack` to check package contents. Publication follows the Eliware release process.

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
