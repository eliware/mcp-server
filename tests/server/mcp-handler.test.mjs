import { jest, test, expect } from "@jest/globals";
import {
  CLIENT_CAPABILITIES_META_KEY,
  PROTOCOL_VERSION_META_KEY,
  McpServer,
} from "@modelcontextprotocol/server";
import { createMcpHandler } from "../../src/server/mcp-handler.mjs";

test("rejects requests without the current protocol envelope", async () => {
  const buildServer = jest.fn(
    () => new McpServer({ name: "test-server", version: "1.0.0" }, { capabilities: { tools: {} } }),
  );
  const handler = createMcpHandler({ buildServer, serverOptions: { context: { value: 1 } } });
  const response = await handler.fetch(
    request({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-11-25",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" },
      },
    }),
  );

  expect(response.status).not.toBe(200);
  expect(buildServer).not.toHaveBeenCalled();
  await handler.close();
});

test("serves requests with the current protocol envelope", async () => {
  const buildServer = jest.fn(
    () => new McpServer({ name: "test-server", version: "1.0.0" }, { capabilities: { tools: {} } }),
  );
  const handler = createMcpHandler({ buildServer, serverOptions: { context: { value: 1 } } });
  const response = await handler.fetch(
    request({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {
        _meta: {
          [PROTOCOL_VERSION_META_KEY]: "2026-07-28",
          [CLIENT_CAPABILITIES_META_KEY]: {},
        },
      },
    }),
  );

  expect(response.status).toBe(200);
  expect(buildServer).toHaveBeenCalledWith({ context: { value: 1, mcpAuth: undefined } });
  await handler.close();
});

test("reports a factory failure through the configured logger", async () => {
  const error = new Error("factory failure");
  const log = { error: jest.fn() };
  const handler = createMcpHandler({
    buildServer: () => {
      throw error;
    },
    serverOptions: { context: {}, log },
  });
  const response = await handler.fetch(
    request({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/list",
      params: {
        _meta: {
          [PROTOCOL_VERSION_META_KEY]: "2026-07-28",
          [CLIENT_CAPABILITIES_META_KEY]: {},
        },
      },
    }),
  );

  expect(response.status).toBe(500);
  expect(log.error).toHaveBeenCalledWith(error);
  await handler.close();
});

test("passes verified OAuth identity through registration context and SDK auth info", async () => {
  const auth = {
    subject: "user-1",
    scopes: ["example:read"],
  };
  const buildServer = jest.fn(({ context }) => {
    const server = new McpServer({ name: "test-server", version: "1.0.0" });
    server.registerTool(
      "identity",
      { description: "Return caller identity.", inputSchema: {} },
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify({
              subject: context.mcpAuth?.subject,
              scopes: context.mcpAuth?.scopes,
            }),
          },
        ],
      }),
    );
    return server;
  });
  const handler = createMcpHandler({ buildServer, serverOptions: { context: {} } });
  const message = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "identity",
      arguments: {},
      _meta: {
        [PROTOCOL_VERSION_META_KEY]: "2026-07-28",
        [CLIENT_CAPABILITIES_META_KEY]: {},
      },
    },
  };
  const response = await handler.fetch(request(message), {
    authInfo: { token: "verified", clientId: "", scopes: auth.scopes, extra: { mcpAuth: auth } },
  });

  expect(response.status).toBe(200);
  expect(JSON.parse((await response.json()).result.content[0].text)).toEqual({
    subject: "user-1",
    scopes: ["example:read"],
  });
  expect(buildServer).toHaveBeenCalledWith({ context: { mcpAuth: auth } });
  await handler.close();
});

function request(message) {
  const modern = message.params?._meta?.[PROTOCOL_VERSION_META_KEY];
  return new Request("http://localhost/mcp", {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      ...(modern ? { "MCP-Protocol-Version": modern } : {}),
      ...(modern ? { "Mcp-Method": message.method } : {}),
      ...(message.params?.name ? { "Mcp-Name": message.params.name } : {}),
    },
    body: JSON.stringify(message),
  });
}
