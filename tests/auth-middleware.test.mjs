import { test, expect } from "@jest/globals";
import express from "express";
import request from "supertest";
import { createAuthMiddleware } from "../src/auth-middleware.mjs";

function appFor(auth) {
  const app = express();
  app.use(createAuthMiddleware({ auth, endpointPaths: ["/mcp"] }));
  app.post("/mcp", (req, res) => res.json({ auth: req.mcpAuth }));
  return app;
}

test("passes requests outside protected POST routes", async () => {
  const app = express();
  app.use(createAuthMiddleware({ auth: "none", endpointPaths: ["/mcp"] }));
  app.get("/mcp", (_req, res) => res.sendStatus(204));
  expect((await request(app).get("/mcp")).status).toBe(204);
  expect((await request(app).post("/other")).status).toBe(404);
});

test("returns an error when middleware cannot read the request token", async () => {
  const app = express();
  app.use((req, _res, next) => {
    req.get = () => {
      throw new Error("request error");
    };
    next();
  });
  app.use(createAuthMiddleware({ auth: "none", endpointPaths: ["/mcp"] }));
  app.post("/mcp", (_req, res) => res.sendStatus(200));
  const response = await request(app).post("/mcp");
  expect(response.status).toBe(500);
  expect(response.body).toMatchObject({ error: "Authentication failed" });
});

test("serves no-auth and bearer-passthrough requests through the Express app", async () => {
  const response = await request(appFor({ mode: "none" })).post("/mcp");
  expect(response.body.auth.mode).toBe("none");

  const app = appFor({ mode: "bearer-passthrough" });
  expect((await request(app).post("/mcp")).status).toBe(401);
  const forwarded = await request(app).post("/mcp").set("Authorization", "Bearer forwarded");
  expect(forwarded.body.auth.accessToken).toBe("forwarded");
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

test("serves OAuth requests and reports introspection service failures", async () => {
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
  expect(failed.status).toBe(503);
  expect(failed.body).toEqual({ error: "Authentication service unavailable" });
  expect(JSON.stringify(failed.body)).not.toContain("provider unavailable");
});
