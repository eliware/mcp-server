import { jest, test, expect } from "@jest/globals";
import { mountOAuthResourceMetadata, setOAuthChallenge } from "../src/oauth-metadata.mjs";

test("mounts protected-resource metadata with configured scopes", () => {
  const routes = {};
  const app = { get: jest.fn((path, handler) => (routes[path] = handler)) };
  mountOAuthResourceMetadata(app, { resource: "resource", issuer: "issuer", scopes: ["read"] });
  const res = { json: jest.fn() };
  routes["/.well-known/oauth-protected-resource"]({}, res);
  expect(res.json).toHaveBeenCalledWith({
    resource: "resource",
    authorization_servers: ["issuer"],
    scopes_supported: ["read"],
  });
});

test("mounts both metadata routes with empty default scopes", () => {
  const routes = {};
  const app = { get: jest.fn((path, handler) => (routes[path] = handler)) };
  mountOAuthResourceMetadata(app, { resource: "r", issuer: "i" });
  const res = { json: jest.fn() };
  routes["/.well-known/oauth-protected-resource/mcp"]({}, res);
  expect(res.json).toHaveBeenCalledWith({
    resource: "r",
    authorization_servers: ["i"],
    scopes_supported: [],
  });
});

test("skips metadata routes when issuer or resource is missing", () => {
  const app = { get: jest.fn() };
  mountOAuthResourceMetadata(app);
  mountOAuthResourceMetadata(app, {});
  mountOAuthResourceMetadata(app, { issuer: "i" });
  mountOAuthResourceMetadata(app, { resource: "r" });
  expect(app.get).not.toHaveBeenCalled();
});

test("sets resource and scope in the OAuth challenge", () => {
  const res = { set: jest.fn() };
  setOAuthChallenge(res, { resource: "https://app/mcp", scope: "read" });
  expect(res.set).toHaveBeenCalledWith(
    "WWW-Authenticate",
    expect.stringContaining(
      'resource_metadata="https://app/mcp/.well-known/oauth-protected-resource/mcp"',
    ),
  );
  expect(res.set.mock.calls[0][1]).toContain('scope="read"');
});

test("sets the default OAuth challenge", () => {
  const res = { set: jest.fn() };
  setOAuthChallenge(res);
  expect(res.set).toHaveBeenCalledWith("WWW-Authenticate", 'Bearer realm="mcp"');
});
