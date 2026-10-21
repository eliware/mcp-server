# Testing

Test tool behavior separately from server startup.
Use integration tests to check transport, authentication, and shutdown behavior.

## Test a tool module

Call the tool registration function with a small fake SDK server.
Capture the handler that the module registers, then call it with valid input:

```js
import assert from "node:assert/strict";
import test from "node:test";
import registerEchoTool from "../tools/echo.mjs";

test("echo tool returns the input text", async () => {
  let handler;
  const mcpServer = {
    registerTool(_name, _options, registeredHandler) {
      handler = registeredHandler;
    },
  };

  await registerEchoTool({
    mcpServer,
    toolName: "echo",
    log: { debug() {} },
    context: {},
  });

  const result = await handler({ echoText: "hello" });
  assert.match(result.content[0].text, /hello/);
});
```

Add cases for invalid input and application context when the tool uses those features.
Keep the test separate from network services when it checks only tool logic.

## Test the running server

Start the server with a test tool directory and a test port.
Send requests through an MCP client that supports protocol revision `2026-07-28`.
Check the expected response and authentication result.
Close the server in the cleanup step so the test releases the listener after each run.

Test stdio by starting the server as a child process.
Keep protocol output on stdout and check errors on stderr.
Do not use legacy `initialize` requests.

## Run repository checks

Install the locked dependencies with `npm ci`.
Run `npm test` to run the package checks.
Run `npm run typecheck` to check the public TypeScript declarations.
Run `npm run pack` to check the package contents.
