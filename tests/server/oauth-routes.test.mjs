import { jest, test, expect } from "@jest/globals";

const { mountOAuthRoutes, mountOAuthResourceMetadata } =
  await import("../../src/server/oauth-routes.mjs");

test("mounts metadata routes for OAuth authentication", () => {
  const app = { get: jest.fn() };
  const auth = {
    mode: "oauth2",
    resource: "https://resource.example",
    issuer: "https://issuer.example",
  };
  mountOAuthRoutes({ app, auth });
  expect(app.get).toHaveBeenCalledTimes(2);
  expect(app.get.mock.calls.map(([route]) => route)).toEqual([
    "/.well-known/oauth-protected-resource",
    "/.well-known/oauth-protected-resource/mcp",
  ]);
});

test("does not mount metadata routes for other authentication modes", () => {
  const app = { get: jest.fn() };
  mountOAuthRoutes({ app, auth: { mode: "static" } });
  expect(app.get).not.toHaveBeenCalled();
});

test("serves configured metadata on both resource routes", () => {
  const routes = [];
  const app = { get: jest.fn((path, handler) => routes.push({ path, handler })) };
  mountOAuthRoutes({
    app,
    auth: { mode: "oauth2", resource: "resource", issuer: "issuer", scopes: ["read"] },
  });
  for (const route of routes) {
    const reply = { send: jest.fn() };
    route.handler({}, reply);
    expect(reply.send).toHaveBeenCalledWith({
      resource: "resource",
      authorization_servers: ["issuer"],
      scopes_supported: ["read"],
    });
  }
});

test("serves empty scopes by default", () => {
  const routes = [];
  const app = { get: jest.fn((path, handler) => routes.push(handler)) };
  mountOAuthRoutes({ app, auth: { mode: "oauth2", resource: "r", issuer: "i" } });
  const reply = { send: jest.fn() };
  routes[0]({}, reply);
  expect(reply.send).toHaveBeenCalledWith({
    resource: "r",
    authorization_servers: ["i"],
    scopes_supported: [],
  });
});

test("skips metadata routes when issuer or resource is missing", () => {
  const app = { get: jest.fn() };
  for (const options of [undefined, {}, { issuer: "i" }, { resource: "r" }]) {
    mountOAuthResourceMetadata(app, options);
  }
  expect(app.get).not.toHaveBeenCalled();
});
