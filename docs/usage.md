# Usage

## Install

Install the package in an application that uses Node.js 26 or later:

```sh
npm install @eliware/mcp-server
```

## Start an HTTP server

Create an `.mjs` entry file. Set a listener number and a token for protected HTTP access:

```js
import { mcpServer } from "@eliware/mcp-server";

await mcpServer({
  port: 1234,
  auth: { mode: "static", token: process.env.MCP_TOKEN },
});
```

Set `MCP_TOKEN` in the process environment before startup. In PowerShell, run `$env:MCP_TOKEN = "your-secret"`. In a POSIX shell, run `export MCP_TOKEN="your-secret"`. The server accepts MCP requests at `/mcp` by default.
Set `endpointPath` to use a different route. See [configuration](configuration.md).

## Start a stdio server

Use stdio when the MCP client starts the server as a local process:

```js
import { mcpServer } from "@eliware/mcp-server";

await mcpServer({ stdio: true });
```

The process connects to the MCP client through stdin and stdout. It does not require an HTTP token.
Send application logs to stderr. Do not write other data to stdout.

## Stop a server

Call `close()` when the host process stops. The HTTP result also contains a Fastify app:

```js
const server = await mcpServer({ port: 1234 });
const closeServer = () => server.close();

process.once("SIGTERM", closeServer);
process.once("SIGINT", closeServer);
```

The stdio result has the same `close()` method. Call it when the client session ends.

## Select an example

Use [examples/README.md](../examples/README.md) to find a runnable server example.
Use [tools and schemas](tools.md) to add a tool.
