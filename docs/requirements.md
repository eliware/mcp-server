# Requirements and protocol limits

## Runtime

Use Node.js 26 or later. The package uses native ESM.
Use an MCP client that supports Streamable HTTP or stdio.

## HTTP behavior

The server uses the MCP SDK Streamable HTTP transport for network requests.
The default route is `/mcp`. The default transport is stateless.
Set `stateless: false` to use stateful transport.
Set `enableJsonResponse: false` to disable JSON responses.
Set `endpointPath` to change the MCP route.

## Network and access

HTTP is not encrypted. Use HTTPS for remote access that needs transport encryption.
HTTPS needs a TLS key and certificate. Use `httpRedirect` to redirect HTTP requests to HTTPS.
The package does not configure a firewall, proxy, domain, or deployment platform.
The package does not add authentication to application routes on a supplied Express app.

## Protocol features

The package exposes tools that tool files add at startup.
The MCP server reports its tools and resources through its capabilities.
The package does not scan for resource or prompt files.
Use the MCP SDK methods on the supplied server to add other supported features.
The package does not provide a client login page or an authorization server.

Read [configuration](configuration.md), [authentication](authentication.md), and [tools and schemas](tools.md) for setup details.
