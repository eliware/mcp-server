# Requirements and protocol limits

## Runtime

Use Node.js 26 or later. The package uses native ESM.
Use an MCP client that supports Streamable HTTP or stdio.

## HTTP behavior

The server uses the official MCP TypeScript SDK v2 for Streamable HTTP requests.
The default route is `/mcp`. Set `endpointPath` to change the MCP route.
The server accepts protocol revision `2026-07-28` only.
The server rejects requests that use an earlier revision or omit the modern request envelope.

## Network and access

HTTP is not encrypted. Use a Fastify app with TLS for remote access that requires transport encryption.
The package does not configure a firewall, proxy, domain, or deployment platform.
The package applies MCP authentication only to the MCP route on a supplied Fastify app.

## Protocol features

The package exposes tools that tool files add at startup.
The MCP server reports tools and resources through its capabilities.
The package does not scan for resource or prompt files.
Use the MCP SDK methods on the supplied server to add other supported features.
The package does not provide a client login page or an authorization server.

Read [configuration](configuration.md), [authentication](authentication.md), and [tools and schemas](tools.md) for setup details.
