# Migration to version 13

Version 13 replaces the MCP SDK v1 and Express setup with the official MCP TypeScript SDK v2 and Fastify.
Update the server entry point, each tool handler, and custom HTTP integrations.
Use an MCP client that supports protocol revision `2026-07-28`.
The SDK rejects earlier revisions and requests without the required `2026-07-28` metadata and HTTP headers.
The stdio transport rejects legacy `initialize` requests. Each HTTP request creates a new server instance.

## Update the server options

Replace `httpPort` with `port`. Replace `app` with a Fastify instance. Replace `configureApp` with `configureFastify`.

```js
await mcpServer({
  host: "127.0.0.1",
  port: 1234,
  configureFastify(fastify) {
    fastify.get("/health", async () => ({ status: "ok" }));
  },
});
```

Install Fastify in the application when it creates a custom instance. Configure TLS on that instance before you pass it to `mcpServer`.

## Update tool registration

Replace the v1 `mcpServer.tool()` call with the v2 `mcpServer.registerTool()` call.
Use a configuration object for the description and input schema:

```js
mcpServer.registerTool(
  toolName,
  { description: "Return a greeting.", inputSchema: { name: z.string() } },
  async ({ name }) => buildResponse({ message: `Hello, ${name}` }),
);
```

Keep each tool in one module under `tools/`.
Move the tool registration function into that module and remove its re-export adapter.
Read injected application values through the registration function's `context` property.

## Update transports and results

Keep Streamable HTTP or stdio. Version 13 does not support HTTP with SSE.
Send `MCP-Protocol-Version`, `Mcp-Method`, and `Mcp-Name` headers that match each HTTP request.
Call `close()` on each server result to stop its active transport.
Use the optional `app` property for advanced HTTP configuration.
The HTTP result does not expose an MCP SDK server or a transport instance because the SDK creates one server for each request.

## Update metadata and OAuth imports

The server reads its default name and version from the consumer package manifest.
Set both values in the server options when the application has no readable manifest.
Import OAuth and PKCE helpers from `@eliware/mcp-server/oauth`.
Import general response and logging helpers from `@eliware/mcp-server/utilities`.

## Update custom authorization

Add custom Fastify authentication in a request callback. Set validated authentication data on the raw request as `auth` so the SDK adapter can pass it to request handlers.
Keep tokens out of logs. Test both allowed and rejected requests.

## Remove v1 dependencies

Remove `@modelcontextprotocol/sdk` and Express from the application. Install the v2 packages that the application imports.
Use the v2 SDK types and methods in declarations and tests.
