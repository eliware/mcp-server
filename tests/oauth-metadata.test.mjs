import { jest, test, expect } from "@jest/globals";
import { mountOAuthResourceMetadata, setOAuthChallenge } from "../src/oauth-metadata.mjs";

test("mounts both metadata routes with configured and default scopes", () => {
  const routes = [];
  const app = { get: jest.fn((path, handler) => routes.push({ path, handler })) };
  mountOAuthResourceMetadata(app, { resource: "resource", issuer: "issuer", scopes: ["read"] });
  mountOAuthResourceMetadata(app, { resource: "r", issuer: "i" });
  const rootResponse = { json: jest.fn() };
  routes[0].handler({}, rootResponse);
  expect(routes[0].path).toBe("/.well-known/oauth-protected-resource");
  expect(rootResponse.json).toHaveBeenCalledWith({
    resource: "resource",
    authorization_servers: ["issuer"],
    scopes_supported: ["read"],
  });
  const mcpResponse = { json: jest.fn() };
  routes[3].handler({}, mcpResponse);
  expect(routes[3].path).toBe("/.well-known/oauth-protected-resource/mcp");
  expect(mcpResponse.json).toHaveBeenCalledWith({
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
