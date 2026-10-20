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

Create MCP servers with Streamable HTTP or stdio, discovered tool modules, Zod input schemas, shared context, and optional authentication.

## Requirements

Use Node.js 26 or later. Use an MCP client that supports protocol revision `2026-07-28` and the selected transport.

## Setup

Install the package with `npm install @eliware/mcp-server`. Read the [setup guide](docs/usage.md) before you create a server.

## Usage

Create a server with `mcpServer()` and add tool modules in `tools/`. Read the [usage guide](docs/usage.md), [configuration guide](docs/configuration.md), and [authentication guide](docs/authentication.md).

Browse the [documentation index](docs/README.md), [specifications index](specs/README.md), and [release notes](RELEASE_NOTES.md).

## Development

Run `npm ci` to install locked dependencies. Run `npm run format` to format files. Run `npm run format:check` to check file formatting.

Run `npm run lint` for lint checks. Run `npm run audit` for dependency checks. Run `npm run typecheck` to check TypeScript declarations.

## Testing

Run `npm test` for aggregate validation. Run `npm run pack` to check package contents.

## Troubleshooting

Read the [troubleshooting guide](docs/troubleshooting.md) for setup and runtime issues.

## Security

Keep tokens, OAuth client secrets, and TLS keys in environment variables or secret files. Use HTTPS and explicit authentication for remote access.

## API

Import `mcpServer` and `z` from `@eliware/mcp-server`. Import `buildResponse` and `convertBigIntToString` from `@eliware/mcp-server/utilities`.

Import OAuth and PKCE helpers from `@eliware/mcp-server/oauth`. Read the [API reference](docs/api.md) for exported functions, options, and result types.

## Packaging

The npm package includes `src/`, `docs/`, `README.md`, `AGENTS.md`, `LICENSE`, `RELEASE_NOTES.md`, `examples/`, `specs/`, and `.env.example`.

Use numeric `MAJOR.MINOR.PATCH` versions and a `v<version>` tag for each release. Run `npm run pack` to check package contents. The [npm workflow](.github/workflows/npm.yaml) publishes approved tagged releases.

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
