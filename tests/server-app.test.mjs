import { jest, test, expect } from "@jest/globals";
import { createMcpApp } from "../src/server-app.mjs";

test("app module installs MCP middleware and route", async () => {
  const posts = [];
  const app = { use: jest.fn(), post: (...args) => posts.push(args) };
  const initialServer = { connect: jest.fn() };
  const result = await createMcpApp({
    config: { endpointPath: "/mcp", allowedOrigins: [], stateless: true, app },
    serverOptions: { stateless: true },
    initialServer,
    activeLog: { debug: jest.fn(), error: jest.fn() },
  });
  expect(result.app).toBe(app);
  expect(posts[0][0]).toEqual(["/mcp"]);
});
