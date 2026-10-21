import { jest, test, expect } from "@jest/globals";
import {
  CLIENT_CAPABILITIES_META_KEY,
  PROTOCOL_VERSION_META_KEY,
  McpServer,
} from "@modelcontextprotocol/server";
import { createMcpFastifyApp } from "@modelcontextprotocol/fastify";
import { getUser } from "../../src/auth/context.mjs";
import { requireScope } from "../../src/auth/scope.mjs";
import { attachAuthInfo } from "../../src/server/auth-context.mjs";
import { buildServer } from "../../src/tools.mjs";
import { createMcpHandler } from "../../src/server/mcp-handler.mjs";
import { mountMcpHandler } from "../../src/server/fastify-route.mjs";
import { registerSecurityHooks } from "../../src/server/security-hooks.mjs";

test("rejects a request without the current protocol envelope through Fastify", async () => {
  const buildServer = jest.fn(
    () => new McpServer({ name: "test-server", version: "1.0.0" }, { capabilities: { tools: {} } }),
  );
  const handler = createMcpHandler({ buildServer, serverOptions: { context: {} } });
  const app = createMcpFastifyApp();
  mountMcpHandler({ app, handler });
  const response = await app.inject({
    method: "POST",
    url: "/mcp",
    headers: { accept: "application/json, text/event-stream", "content-type": "application/json" },
    payload: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-11-25",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" },
      },
    }),
  });

  expect(response.statusCode).not.toBe(200);
  expect(buildServer).not.toHaveBeenCalled();
  await app.close();
  await handler.close();
});

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

test("passes verified auth metadata to tools through the Fastify route", async () => {
  const auth = { mode: "oauth2", subject: "verified-user", scopes: ["example:read"] };
  const buildServer = jest.fn(() => {
    const server = new McpServer({ name: "test-server", version: "1" });
    server.registerTool(
      "identity",
      { description: "Read identity.", inputSchema: {} },
      async (_input, extra) => {
        requireScope(extra, "example:read");
        return { content: [{ type: "text", text: JSON.stringify(getUser(extra)) }] };
      },
    );
    return server;
  });
  const handler = createMcpHandler({ buildServer, serverOptions: { context: {} } });
  const app = createMcpFastifyApp();
  registerSecurityHooks({
    app,
    endpointPath: "/mcp",
    auth: { mode: "none" },
    authenticate: (request) => {
      attachAuthInfo(request, auth);
      return true;
    },
  });
  mountMcpHandler({ app, handler });
  const response = await app.inject({
    method: "POST",
    url: "/mcp",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      "MCP-Protocol-Version": "2026-07-28",
      "Mcp-Method": "tools/call",
      "Mcp-Name": "identity",
    },
    payload: JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "identity",
        arguments: {},
        _meta: {
          [PROTOCOL_VERSION_META_KEY]: "2026-07-28",
          [CLIENT_CAPABILITIES_META_KEY]: {},
          mcpAuth: { mode: "static", subject: "untrusted-user", scopes: [] },
        },
      },
    }),
  });

  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.json().result.content[0].text)).toEqual({
    subject: "verified-user",
    scopes: ["example:read"],
  });
  await app.close();
  await handler.close();
});
