# Tools and schemas

The server scans its tool directory for `.mjs` files at startup.
Each file must export one default async function. The file name becomes the tool name.

## Add a tool

Import `z` to define input fields. Import `buildResponse` to return JSON-safe data as MCP text:

```js
import { z } from "@eliware/mcp-server";
import { buildResponse } from "@eliware/mcp-server/utilities";

export default async function registerEcho({ mcpServer, toolName, log, service }) {
  mcpServer.tool(
    toolName,
    "Return the input text.",
    { text: z.string().min(1) },
    async ({ text }) => {
      log.debug("Echo request", { toolName });
      return buildResponse(await service.echo(text));
    },
  );
}
```

The tool function receives `mcpServer`, `toolName`, `log`, and each property from `context`.
The input schema uses the Zod API. The tool handler receives validated input.
Return a value that the MCP SDK accepts, or use `buildResponse(value)` for a text result.
`buildResponse` converts BigInt values to strings before it creates the result.

## Pass tool context

Pass application services with `context` when you start the server:

```js
await mcpServer({ context: { service } });
```

The tool can then access `service` as an argument to its registration function.
Do not pass secrets unless the tool needs them. Do not write secret values to logs.

## Resources and prompts

This package finds tool files only. It does not find resource or prompt files.
Add resources and prompts through the supplied MCP server in a tool function when the SDK supports them.
The package does not define a separate resource or prompt file format.

See [examples/README.md](../examples/README.md) for the complete tool example.
