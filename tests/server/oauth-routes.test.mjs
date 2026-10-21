import { jest, test, expect } from "@jest/globals";

const mountOAuthResourceMetadata = jest.fn();
await jest.unstable_mockModule("../../src/oauth/resource-metadata.mjs", () => ({
  mountOAuthResourceMetadata,
}));

const { mountOAuthRoutes } = await import("../../src/server/oauth-routes.mjs");

test("mounts metadata routes for OAuth authentication", () => {
  const app = {};
  const auth = { mode: "oauth2", issuer: "https://issuer.example" };
  mountOAuthRoutes({ app, auth });
  expect(mountOAuthResourceMetadata).toHaveBeenCalledWith(app, auth);
});

test("does not mount metadata routes for other authentication modes", () => {
  mountOAuthResourceMetadata.mockClear();
  mountOAuthRoutes({ app: {}, auth: { mode: "static" } });
  expect(mountOAuthResourceMetadata).not.toHaveBeenCalled();
});
