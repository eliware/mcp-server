import { jest, test, expect } from "@jest/globals";

const mocks = {
  validateOAuthToken: jest.fn(),
  createOAuthAuthContext: jest.fn(() => ({ mode: "oauth2", subject: "user-1" })),
  sendOAuthError: jest.fn(() => false),
};

await jest.unstable_mockModule("../../../src/auth/token-validation.mjs", () => ({
  validateOAuthToken: mocks.validateOAuthToken,
}));
await jest.unstable_mockModule("../../../src/auth/oauth/context.mjs", () => ({
  createOAuthAuthContext: mocks.createOAuthAuthContext,
}));
await jest.unstable_mockModule("../../../src/server/auth/oauth-error.mjs", () => ({
  sendOAuthError: mocks.sendOAuthError,
}));

const { authenticateOAuthRequest } = await import("../../../src/server/auth/oauth.mjs");

function fixture(authorization) {
  return {
    request: { headers: { authorization }, raw: {} },
    reply: {
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
      header: jest.fn().mockReturnThis(),
    },
  };
}

test("validates introspection data and attaches OAuth context", async () => {
  const { request, reply } = fixture("Bearer token");
  const config = { mode: "oauth2", resource: "https://resource.example", introspect: jest.fn() };
  const info = { active: true };
  const scopes = ["read"];
  config.introspect.mockResolvedValue(info);
  mocks.validateOAuthToken.mockReturnValue({ scopes });

  expect(await authenticateOAuthRequest(request, reply, config)).toBe(true);
  expect(mocks.validateOAuthToken).toHaveBeenCalledWith(info, config);
  expect(mocks.createOAuthAuthContext).toHaveBeenCalledWith({
    config,
    info,
    accessToken: "token",
    scopes,
  });
  expect(request.raw.auth.extra.mcpAuth).toEqual({ mode: "oauth2", subject: "user-1" });
});

test("delegates a missing bearer token to the OAuth error response", async () => {
  const { request, reply } = fixture(undefined);
  const config = { mode: "oauth2", resource: "https://resource.example" };

  expect(await authenticateOAuthRequest(request, reply, config)).toBe(false);
  expect(mocks.sendOAuthError).toHaveBeenCalledWith(reply, config, "Bearer token required");
});

test("returns an unavailable response when introspection throws", async () => {
  const { request, reply } = fixture("Bearer token");
  const config = { mode: "oauth2", introspect: jest.fn().mockRejectedValue(new Error("offline")) };

  expect(await authenticateOAuthRequest(request, reply, config)).toBe(false);
  expect(reply.code).toHaveBeenCalledWith(503);
  expect(reply.send).toHaveBeenCalledWith({ error: "Authentication endpoint is unavailable" });
});

test("delegates an invalid token to the OAuth error response", async () => {
  const { request, reply } = fixture("Bearer token");
  const config = { mode: "oauth2", resource: "https://resource.example", introspect: jest.fn() };
  config.introspect.mockResolvedValue({ active: false });
  mocks.validateOAuthToken.mockReturnValue(null);

  expect(await authenticateOAuthRequest(request, reply, config)).toBe(false);
  expect(mocks.sendOAuthError).toHaveBeenCalledWith(reply, config, "Invalid OAuth2 token");
});
