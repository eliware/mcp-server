# Tools and schemas

The server loads each direct `.mjs` file from the tool directory.
Each tool module defines one tool and exports one default registration function.
The file name becomes the tool name.
The server does not scan subfolders.

## Add a tool

Import `z` to define input fields. Import `buildResponse` to return JSON-safe data as MCP text:

```js
import { z } from "@eliware/mcp-server";
import { buildResponse } from "@eliware/mcp-server/utilities";

export default async function addEcho({ mcpServer, toolName, log, context }) {
  mcpServer.registerTool(
    toolName,
    { description: "Return the input text.", inputSchema: { text: z.string().min(1) } },
    async ({ text }) => {
      log.debug("Echo request", { toolName });
      return buildResponse(await context.service.echo(text));
    },
  );
}
```

Save the complete tool in `tools/echo.mjs`.
Keep other JavaScript files outside the tool directory because the server loads every `.mjs` file there.
The registration function receives `mcpServer`, `toolName`, `log`, and `context`.
The `mcpServer` value is the SDK server for the current HTTP request or stdio connection.

The input schema uses the Zod API. The tool handler receives validated input.
Return a value that the MCP SDK accepts, or use `buildResponse(value)` for a text result.
`buildResponse` converts BigInt values to strings before it creates the result.
It throws a `TypeError` when the data contains a circular reference.

## Pass tool context

Pass application services with `context` when you start the server:

```js
await mcpServer({ context: { service } });
```

The tool can then access `service` through `context.service`.
The server passes the same context object to each registered tool.
Create shared clients before you call `mcpServer()` and pass them through `context`.
The server adds tools for each HTTP request. Do not repeat setup work in tool functions.

Do not pass secrets unless the tool needs them. Do not write secret values to logs.

## Resources and prompts

This package finds tool files only. It does not find resource or prompt files.
Each tool module receives the SDK server as `mcpServer`. Add resources and prompts to that server inside the module.
The server advertises tools, resources, and prompts as supported capabilities.
The package does not define a separate resource or prompt file format.

Add resources and prompts from a tool module when the application uses them.

See [examples/README.md](../examples/README.md) for the complete tool example.
