import { jest, test, expect } from "@jest/globals";
import express from "express";
import request from "supertest";
import { createAuthMiddleware } from "../src/auth-middleware.mjs";

function appFor(auth) {
  const app = express();
  app.use(createAuthMiddleware({ auth, endpointPaths: ["/mcp"] }));
  app.post("/mcp", (req, res) => res.json({ auth: req.mcpAuth }));
  return app;
}

test("bypasses requests outside configured POST paths", async () => {
  const next = jest.fn();
  const middleware = createAuthMiddleware({ auth: "none", endpointPaths: ["/mcp"] });
  await middleware({ method: "GET", path: "/mcp" }, {}, next);
  await middleware({ method: "POST", path: "/other" }, {}, next);
  expect(next).toHaveBeenCalledTimes(2);
});

test("returns an error when middleware cannot read the request token", async () => {
  const middleware = createAuthMiddleware({ auth: "none", endpointPaths: ["/mcp"] });
  const res = { status: jest.fn(() => res), json: jest.fn() };
  await middleware(
    {
      method: "POST",
      path: "/mcp",
      get: () => {
        throw new Error("request error");
      },
    },
    res,
    jest.fn(),
  );
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: "Authentication failed" }),
  );
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
