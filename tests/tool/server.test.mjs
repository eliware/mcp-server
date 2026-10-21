import { test, expect } from "@jest/globals";
import { createToolServer } from "../../src/tool/server.mjs";

test("creates an MCP server with tool, resource, and prompt capabilities", () => {
  const calls = [];
  class MockMcpServer {
    constructor(metadata, options) {
      calls.push({ metadata, options });
    }
  }
  const context = { service: "test" };

  const server = createToolServer({
    name: "example",
    version: "1.2.3",
    context,
    McpServerClass: MockMcpServer,
  });

  expect(calls).toEqual([
    {
      metadata: { name: "example", version: "1.2.3" },
      options: { capabilities: { tools: {}, resources: {}, prompts: {} } },
    },
  ]);
  expect(server.options).toEqual({ name: "example", version: "1.2.3" });
  expect(server.context).toBe(context);
});

test("uses the MCP SDK server class by default", () => {
  const server = createToolServer({ name: "default", version: "1.0.0", context: {} });

  expect(server.options).toEqual({ name: "default", version: "1.0.0" });
});
