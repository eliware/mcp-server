import { jest, test, expect } from "@jest/globals";
import express from "express";
import request from "supertest";
import { createMcpApp } from "../src/server-app.mjs";
import { mcpServer } from "../src/server.mjs";
import { createAuthMiddleware } from "../src/auth-middleware.mjs";

function appFor(auth) {
  const app = express();
  app.use(createAuthMiddleware({ auth, endpointPaths: ["/mcp"] }));
  app.post("/mcp", (req, res) => res.json({ auth: req.mcpAuth }));
  return app;
}

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

test("uses a supplied app and configures its routes", async () => {
  const app = express();
  const configureApp = jest.fn((configured) => {
    configured.get("/custom", (_req, res) => res.send("ok"));
  });
  const result = await mcpServer({
    app,
    configureApp,
    toolsDir: new URL("../examples/tools/", import.meta.url).pathname,
    httpPort: 0,
    log: { debug: jest.fn(), warn: jest.fn(), error: jest.fn() },
  });
  expect(result.app).toBe(app);
  expect(configureApp).toHaveBeenCalledWith(app);
  expect((await request(app).get("/custom")).text).toBe("ok");
  result.httpInstance.close();
});

test("serves OAuth protected-resource metadata", async () => {
  const result = await mcpServer({
    httpPort: 0,
    toolsDir: new URL("../examples/tools/", import.meta.url).pathname,
    log: { debug: jest.fn(), warn: jest.fn(), error: jest.fn() },
    auth: {
      mode: "oauth2",
      issuer: "https://auth.example",
      resource: "https://api.example/mcp",
      scopes: ["read"],
      introspection: { endpoint: "https://auth.example/introspect" },
    },
  });
  const response = await request(result.app).get("/.well-known/oauth-protected-resource/mcp");
  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    resource: "https://api.example/mcp",
    authorization_servers: ["https://auth.example"],
  });
  result.httpInstance.close();
});

test("connects one transport for stateful HTTP", async () => {
  const connect = jest.fn();
  const app = { use: jest.fn(), post: jest.fn() };
  const result = await createMcpApp({
    config: {
      endpointPath: "/mcp",
      allowedOrigins: [],
      stateless: false,
      app,
      auth: { mode: "none" },
    },
    serverOptions: { stateless: false },
    initialServer: { connect },
    activeLog: { debug: jest.fn(), error: jest.fn() },
    buildServer: jest.fn(),
  });
  expect(result.initialTransport).toBeTruthy();
  expect(connect).toHaveBeenCalledWith(result.initialTransport);
});

test("serves no-auth requests through the Express app", async () => {
  const response = await request(appFor({ mode: "none" })).post("/mcp");
  expect(response.body.auth.mode).toBe("none");
});

test("serves static-token requests through the Express app", async () => {
  const app = appFor({ mode: "static", token: "secret" });
  expect((await request(app).post("/mcp").set("Authorization", "Bearer secret")).status).toBe(200);
  for (const value of [undefined, "Basic secret", "Bearer wrong", "Bearer secret extra"]) {
    const call = request(app).post("/mcp");
    if (value) call.set("Authorization", value);
    expect((await call).status).toBe(401);
  }
});

test("serves bearer-passthrough requests through the Express app", async () => {
  const app = appFor({ mode: "bearer-passthrough" });
  expect((await request(app).post("/mcp")).status).toBe(401);
  const response = await request(app).post("/mcp").set("Authorization", "Bearer forwarded");
  expect(response.body.auth.accessToken).toBe("forwarded");
});

test("serves OAuth requests and reports introspection failures", async () => {
  const app = appFor({
    mode: "oauth2",
    issuer: "issuer",
    resource: "resource",
    introspect: async () => ({ active: true, iss: "issuer", resource: "resource" }),
  });
  const denied = await request(app).post("/mcp");
  const accepted = await request(app).post("/mcp").set("Authorization", "Bearer token");
  expect(denied.status).toBe(401);
  expect(accepted.status).toBe(200);
  expect(accepted.body.auth.mode).toBe("oauth2");

  const failingApp = appFor({
    mode: "oauth2",
    issuer: "issuer",
    resource: "resource",
    introspect: async () => {
      throw new Error("provider unavailable");
    },
  });
  const failed = await request(failingApp).post("/mcp").set("Authorization", "Bearer token");
  expect(failed.status).toBe(500);
  expect(failed.body.error).toBe("Authentication failed");
});
