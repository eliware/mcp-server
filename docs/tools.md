# Tools and schemas

The server loads `.mjs` tool modules from the tool directory.
Each tool module defines one tool and exports one default registration function.
The file name becomes the tool name.

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
The registration function receives `mcpServer`, `toolName`, `log`, and `context`.
The input schema uses the Zod API. The tool handler receives validated input.
Return a value that the MCP SDK accepts, or use `buildResponse(value)` for a text result.
`buildResponse` converts BigInt values to strings before it creates the result.

## Pass tool context

Pass application services with `context` when you start the server:

```js
await mcpServer({ context: { service } });
```

The tool can then access `service` through `context.service`.
Do not pass secrets unless the tool needs them. Do not write secret values to logs.

## Resources and prompts

This package finds tool files only. It does not find resource or prompt files.
Each tool module receives the SDK server as `mcpServer`. Add resources and prompts to that server inside the module.
The server advertises tools, resources, and prompts as supported capabilities.
The package does not define a separate resource or prompt file format.

See [examples/README.md](../examples/README.md) for the complete tool example.
