# Usage

## Install

Install the package in an application that uses Node.js 26 or later:

```sh
npm install @eliware/mcp-server
```

## Start an HTTP server

Create an ESM entry file. Use `.mjs`, or use `.js` in a package with `"type": "module"`.
This example starts a protected HTTP server on port `1234`:

```js
import { mcpServer } from "@eliware/mcp-server";

const token = process.env.MCP_TOKEN;
if (!token) throw new Error("Set MCP_TOKEN before you start the server.");

const server = await mcpServer({
  port: 1234,
  auth: { mode: "static", token },
});
```

Set `MCP_TOKEN` before startup. In PowerShell, run `$env:MCP_TOKEN = "your-secret"`.
In a POSIX shell, run `export MCP_TOKEN="your-secret"`.
The server accepts requests at `/mcp` by default. Set `endpointPath` to change this route.

Read [configuration](configuration.md) for all options.
Add tool modules under `tools/` beside the entry file. Start the server with `node server.mjs`.

## Start a stdio server

Use stdio when the MCP client starts the server as a local process:

```js
import { mcpServer } from "@eliware/mcp-server";

await mcpServer({ stdio: true });
```

The process connects to the MCP client through stdin and stdout.
Stdio mode does not use HTTP authentication. Send logs to stderr.
Do not write application data to stdout.

## Stop a server

Call `close()` when the host process stops. The HTTP result also contains a Fastify app for advanced use:

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
