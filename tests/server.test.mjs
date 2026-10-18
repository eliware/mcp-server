import { jest, test, expect } from "@jest/globals";
import { createMcpFastifyApp } from "@modelcontextprotocol/fastify";
import {
  CLIENT_CAPABILITIES_META_KEY,
  PROTOCOL_VERSION_META_KEY,
} from "@modelcontextprotocol/server";
import Fastify from "fastify";
import { mcpServer } from "../src/server.mjs";

const toolsDir = new URL("../examples/tools/", import.meta.url).pathname;
const listTools = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/list",
  params: {
    _meta: {
      [PROTOCOL_VERSION_META_KEY]: "2026-07-28",
      [CLIENT_CAPABILITIES_META_KEY]: {},
    },
  },
};

test("creates a Fastify app when listening is disabled", async () => {
  const result = await mcpServer({ port: null, toolsDir });
  expect(result.app).toBeTruthy();
  await result.app.close();
});

test("serves authenticated MCP requests through Fastify", async () => {
  const result = await mcpServer({
    port: null,
    auth: { mode: "static", token: "test-token" },
    toolsDir,
    name: "Custom",
    version: "2",
    context: { x: 1 },
  });
  const denied = await result.app.inject({ method: "POST", url: "/mcp", payload: listTools });
  const accepted = await result.app.inject({
    method: "POST",
    url: "/mcp",
    headers: {
      authorization: "Bearer test-token",
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      "MCP-Protocol-Version": "2026-07-28",
      "Mcp-Method": "tools/list",
    },
    payload: listTools,
  });
  expect(denied.statusCode).toBe(401);
  expect(accepted.statusCode).toBe(200);
  await result.app.close();
});

test("starts and closes the stdio server handle", async () => {
  const result = await mcpServer({ stdio: true, toolsDir });
  expect(result.app).toBeUndefined();
  expect(result.transport).toBeTruthy();
  await result.transport.close();
});

test("uses the entry file folder for tools when configured", async () => {
  const result = await mcpServer({
    stdio: true,
    entrypoint: new URL("../examples/basic.mjs", import.meta.url).pathname,
  });
  expect(result.transport).toBeTruthy();
  await result.transport.close();
});

test("uses bundled tools when no tool folder is set", async () => {
  const result = await mcpServer({ toolsDir: "", entrypoint: undefined, port: null });
  expect(result.app).toBeTruthy();
  await result.app.close();
});

test("starts with omitted options and closes Fastify", async () => {
  const result = await mcpServer();
  expect(result.app).toBeTruthy();
  await result.app.close();
});

test("uses a supplied Fastify instance and configures application routes", async () => {
  const fastify = createMcpFastifyApp();
  const configureFastify = (app) => app.get("/health", async () => ({ status: "ok" }));
  await mcpServer({ fastify, configureFastify, port: null });
  const health = await fastify.inject({ method: "GET", url: "/health" });
  expect(health.statusCode).toBe(200);
  await fastify.close();
});

test("applies configured host and origin rules to a supplied Fastify instance", async () => {
  const fastify = Fastify();
  await mcpServer({
    fastify,
    port: null,
    allowedHosts: ["mcp.example"],
    allowedOrigins: ["client.example"],
  });
  const blockedHost = await fastify.inject({
    method: "GET",
    url: "/unknown",
    headers: { host: "other.example", origin: "https://client.example" },
  });
  const blockedOrigin = await fastify.inject({
    method: "GET",
    url: "/unknown",
    headers: { host: "mcp.example", origin: "https://other.example" },
  });
  const allowedHeaders = await fastify.inject({
    method: "GET",
    url: "/unknown",
    headers: { host: "mcp.example", origin: "https://client.example" },
  });

  expect(blockedHost.statusCode).toBe(403);
  expect(blockedOrigin.statusCode).toBe(403);
  expect(allowedHeaders.statusCode).toBe(404);
  await fastify.close();
});

test("rejects HTTP requests with missing or mismatched modern headers", async () => {
  const log = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };
  const result = await mcpServer({ port: null, log, toolsDir });
  const headers = {
    accept: "application/json, text/event-stream",
    "content-type": "application/json",
    "MCP-Protocol-Version": "2026-07-28",
    "Mcp-Method": "tools/call",
    "Mcp-Name": "echo",
  };
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "echo",
      arguments: { echoText: "hello" },
      _meta: { [PROTOCOL_VERSION_META_KEY]: "2026-07-28" },
    },
  };
  const invalid = { ...headers, "Mcp-Method": "tools/list" };
  log.debug.mockClear();
  const response = await result.app.inject({
    method: "POST",
    url: "/mcp",
    headers: invalid,
    payload,
  });
  expect(response.statusCode).toBeGreaterThanOrEqual(400);
  expect(log.debug).not.toHaveBeenCalled();
  await result.app.close();
});

test("serves OAuth protected-resource metadata", async () => {
  const result = await mcpServer({
    port: null,
    auth: {
      mode: "oauth2",
      issuer: "https://issuer.example",
      resource: "https://resource.example",
      introspection: { endpoint: "https://issuer.example/introspect" },
    },
  });
  const metadata = await result.app.inject({
    method: "GET",
    url: "/.well-known/oauth-protected-resource/mcp",
  });
  expect(metadata.statusCode).toBe(200);
  expect(metadata.json().authorization_servers).toEqual(["https://issuer.example"]);
  await result.app.close();
});
