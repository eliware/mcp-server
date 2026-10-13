import { jest, test, expect } from "@jest/globals";
import { mcpServer } from "../src/server.mjs";
import request from "supertest";

const toolsDir = new URL("../examples/tools/", import.meta.url).pathname;
const log = { debug: jest.fn(), warn: jest.fn(), error: jest.fn() };

test("starts an app when HTTP listeners are disabled", async () => {
  const result = await mcpServer({
    httpPort: null,
    toolsDir,
    log,
  });
  expect(result.app).toBeTruthy();
  expect(result.mcpServer).toBeTruthy();
  expect(result.httpInstance).toBeUndefined();
});

test("serves authenticated MCP requests and applies server metadata", async () => {
  const result = await mcpServer({
    log,
    httpPort: 0,
    auth: { mode: "static", token: "test-token" },
    toolsDir,
    name: "Custom",
    version: "2",
    context: { x: 1 },
  });
  expect(result.mcpServer.options).toEqual({ name: "Custom", version: "2" });
  expect((await request(result.app).post("/mcp").send({ foo: "bar" })).status).toBe(401);
  expect(
    (await request(result.app).post("/mcp").set("Authorization", "Bearer test-token")).status,
  ).toBe(406);
  result.httpInstance.close();
});

test("starts and closes the stdio transport", async () => {
  const result = await mcpServer({ stdio: true, toolsDir, log });
  expect(result.app).toBeUndefined();
  expect(result.httpInstance).toBeUndefined();
  expect(result.transport).toBeTruthy();
  await result.transport.close();
});

test("uses the entry file folder for tools when configured", async () => {
  const result = await mcpServer({
    stdio: true,
    entrypoint: new URL("../examples/basic.mjs", import.meta.url).pathname,
    log,
  });
  expect(result.transport).toBeTruthy();
  await result.transport.close();
});

test("uses bundled tools when no tool folder is set", async () => {
  const result = await mcpServer({ toolsDir: "", entrypoint: undefined, httpPort: null, log });
  expect(result.app).toBeTruthy();
});

test("supports omitted options", async () => {
  const result = await mcpServer();
  expect(result.app).toBeTruthy();
  result.httpInstance.close();
});
