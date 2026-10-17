import { jest, test, expect } from "@jest/globals";
import {
  CLIENT_CAPABILITIES_META_KEY,
  PROTOCOL_VERSION_META_KEY,
} from "@modelcontextprotocol/server";
import { createMcpFastifyApp } from "@modelcontextprotocol/fastify";
import { buildServer } from "../../src/tools.mjs";
import { createMcpHandler } from "../../src/server/mcp-handler.mjs";
import { mountMcpHandler } from "../../src/server/fastify-route.mjs";

test("serves the SDK handler through a Fastify route", async () => {
  const handler = createMcpHandler({
    buildServer,
    serverOptions: {
      name: "test-server",
      version: "1",
      toolsDir: new URL("../../examples/tools/", import.meta.url).pathname,
      context: {},
      log: { debug: jest.fn(), error: jest.fn() },
    },
  });
  const app = createMcpFastifyApp();
  mountMcpHandler({ app, handler });
  const response = await app.inject({
    method: "POST",
    url: "/mcp",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      "MCP-Protocol-Version": "2026-07-28",
      "Mcp-Method": "tools/list",
    },
    payload: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
      params: {
        _meta: {
          [PROTOCOL_VERSION_META_KEY]: "2026-07-28",
          [CLIENT_CAPABILITIES_META_KEY]: {},
        },
      },
    }),
  });

  expect(response.statusCode).toBe(200);
  await app.close();
  await handler.close();
});
