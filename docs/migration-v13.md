# Migration to version 13

Version 13 replaces the MCP SDK v1 and Express setup with the official MCP TypeScript SDK v2 and Fastify.
Update the server entry point, each tool handler, and custom HTTP integrations.
Use an MCP client that supports protocol revision `2026-07-28`.
The server rejects earlier revisions and requests without the `2026-07-28` envelope.

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

Keep each handler in `src/tools/`. Add the matching re-export adapter in `tools/`.

## Update transports and results

Keep Streamable HTTP or stdio. Version 13 does not support HTTP with SSE.
Close the returned Fastify app with `app.close()`. Close the stdio result with `transport.close()`.
The HTTP result does not expose an MCP SDK server or a transport instance because the SDK creates one server for each request.

## Update custom authorization

Add custom Fastify authentication in a request callback. Set validated authentication data on the raw request as `auth` so the SDK adapter can pass it to request handlers.
Keep tokens out of logs. Test both allowed and rejected requests.

## Remove v1 dependencies

Remove `@modelcontextprotocol/sdk` and Express from the application. Install the v2 packages that the application imports.
Use the v2 SDK types and methods in declarations and tests.
