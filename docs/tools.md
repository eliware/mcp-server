# Tools and schemas

The server loads `.mjs` adapters from the tool directory.
Each adapter must re-export the matching handler from `src/tools/`.
The adapter file name becomes the tool name.

## Add a tool

Import `z` to define input fields. Import `buildResponse` to return JSON-safe data as MCP text:

```js
import { z } from "@eliware/mcp-server";
import { buildResponse } from "@eliware/mcp-server/utilities";

export default async function addEcho({ mcpServer, toolName, log, service }) {
  mcpServer.registerTool(
    toolName,
    { description: "Return the input text.", inputSchema: { text: z.string().min(1) } },
    async ({ text }) => {
      log.debug("Echo request", { toolName });
      return buildResponse(await service.echo(text));
    },
  );
}
```

Create `tools/echo.mjs` with this export:

```js
export { default } from "../src/tools/echo.mjs";
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
Each adapter receives the SDK server as `mcpServer`. Add resources and prompts to that server inside the adapter.
The server advertises tools, resources, and prompts as supported capabilities.
The package does not define a separate resource or prompt file format.

See [examples/README.md](../examples/README.md) for the complete tool example.
