import { jest, test, expect } from "@jest/globals";
import { mountOAuthResourceMetadata } from "../../src/oauth/resource-metadata.mjs";

test("mounts both metadata routes with configured and default scopes", () => {
  const routes = [];
  const app = { get: jest.fn((path, handler) => routes.push({ path, handler })) };
  mountOAuthResourceMetadata(app, { resource: "resource", issuer: "issuer", scopes: ["read"] });
  mountOAuthResourceMetadata(app, { resource: "r", issuer: "i" });
  const rootResponse = { send: jest.fn() };
  routes[0].handler({}, rootResponse);
  expect(routes[0].path).toBe("/.well-known/oauth-protected-resource");
  expect(rootResponse.send).toHaveBeenCalledWith({
    resource: "resource",
    authorization_servers: ["issuer"],
    scopes_supported: ["read"],
  });
  const mcpResponse = { send: jest.fn() };
  routes[3].handler({}, mcpResponse);
  expect(routes[3].path).toBe("/.well-known/oauth-protected-resource/mcp");
  expect(mcpResponse.send).toHaveBeenCalledWith({
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
