import { jest, test, expect } from "@jest/globals";
import express from "express";
import request from "supertest";
import { createAuthMiddleware } from "../src/auth-middleware.mjs";

async function appFor(auth) {
  const app = express();
  app.use(createAuthMiddleware({ auth, endpointPaths: ["/mcp"] }));
  app.post("/mcp", (req, res) => res.json({ auth: req.mcpAuth }));
  return app;
}

test("allows no-auth requests and bypasses other routes", async () => {
  const app = await appFor({ mode: "none" });
  expect((await request(app).post("/mcp")).body.auth.mode).toBe("none");
  const next = jest.fn();
  const middleware = createAuthMiddleware({ auth: "none", endpointPaths: ["/mcp"] });
  await middleware({ method: "GET", path: "/mcp" }, {}, next);
  await middleware({ method: "POST", path: "/other" }, {}, next);
  expect(next).toHaveBeenCalledTimes(2);
});

test("checks static tokens and rejects malformed values", async () => {
  const app = await appFor({ mode: "static", token: "secret" });
  expect((await request(app).post("/mcp").set("Authorization", "Bearer secret")).status).toBe(200);
  for (const value of [undefined, "Basic secret", "Bearer wrong", "Bearer secret extra"]) {
    const call = request(app).post("/mcp");
    if (value) call.set("Authorization", value);
    expect((await call).status).toBe(401);
  }
});

test("requires a bearer token in passthrough mode", async () => {
  const app = await appFor({ mode: "bearer-passthrough" });
  expect((await request(app).post("/mcp")).status).toBe(401);
  const response = await request(app).post("/mcp").set("Authorization", "Bearer forwarded");
  expect(response.body.auth.accessToken).toBe("forwarded");
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

test("returns an error when OAuth introspection fails", async () => {
  const app = await appFor({
    mode: "oauth2",
    issuer: "issuer",
    resource: "resource",
    introspect: async () => {
      throw new Error("provider unavailable");
    },
  });
  const response = await request(app).post("/mcp").set("Authorization", "Bearer token");
  expect(response.status).toBe(500);
  expect(response.body.error).toBe("Authentication failed");
});

test("passes valid OAuth requests and rejects a missing token", async () => {
  const app = await appFor({
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
});
