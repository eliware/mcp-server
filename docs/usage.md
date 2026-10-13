# Usage

## Install

Install the package in an application that uses Node.js 26 or later:

```sh
npm install @eliware/mcp-server
```

## Start an HTTP server

Create an `.mjs` entry file. Set a port, a token, and a tool directory:

```js
import { mcpServer } from "@eliware/mcp-server";

await mcpServer({
  httpPort: 1234,
  auth: { mode: "static", token: process.env.MCP_TOKEN },
});
```

Set `MCP_TOKEN` in the process environment before startup. The server accepts MCP requests at `/mcp` by default.
Set `endpointPath` to use a different route. See [configuration](configuration.md).

## Start a stdio server

Use stdio when the MCP client starts the server as a local process:

```js
import { mcpServer } from "@eliware/mcp-server";

await mcpServer({ stdio: true });
```

The process connects to the MCP client through stdin and stdout.
Send application logs to stderr. Do not write other data to stdout.

## Stop a server

The HTTP server result contains `httpInstance` and may contain `httpsInstance`.
Close each active server instance when the host process stops:

```js
const result = await mcpServer({ httpPort: 1234, httpsPort: 443 });
const closeServers = () => {
  result.httpInstance?.close();
  result.httpsInstance?.close();
};

process.once("SIGTERM", closeServers);
process.once("SIGINT", closeServers);
```

The stdio result contains a transport. Close it when the client session ends.

## Choose an example

Use [examples/README.md](../examples/README.md) to find a runnable server example.
Use [tools and schemas](tools.md) to add a tool.
