import { jest, test, expect } from "@jest/globals";
import { authenticateOAuthRequest } from "../src/auth-oauth.mjs";

function setup(info, overrides = {}) {
  const req = {};
  const res = { set: jest.fn(), status: jest.fn(() => res), json: jest.fn() };
  const config = {
    mode: "oauth2",
    issuer: "issuer",
    resource: "resource",
    requiredScopes: [],
    subjectClaim: "sub",
    introspect: async () => info,
    ...overrides,
  };
  return { config, req, res };
}

test("accepts a valid OAuth token and keeps safe claims", async () => {
  const { config, req, res } = setup({
    active: true,
    iss: "issuer",
    resource: "resource",
    scope: "read write",
    sub: "user",
    secret: "private",
    access_token: "private",
  });
  await expect(authenticateOAuthRequest({ config, accessToken: "token", req, res })).resolves.toBe(
    true,
  );
  expect(req.mcpAuth).toMatchObject({ subject: "user", scopes: ["read", "write"] });
  expect(req.mcpAuth.claims).not.toHaveProperty("secret");
});

test("challenges a missing token", async () => {
  const { config, req, res } = setup({});
  await expect(authenticateOAuthRequest({ config, req, res })).resolves.toBe(false);
  expect(res.set).toHaveBeenCalledWith("WWW-Authenticate", expect.stringContaining("resource"));
  expect(res.status).toHaveBeenCalledWith(401);
});

test("rejects invalid introspection results", async () => {
  const expired = Math.floor(Date.now() / 1000) - 1;
  const valid = { active: true, iss: "issuer", resource: "resource", scope: "read" };
  const invalid = [
    null,
    { ...valid, active: false },
    { ...valid, iss: "other" },
    { ...valid, resource: "other" },
    { ...valid, resource: undefined, aud: ["other"] },
    { ...valid, exp: expired },
    { ...valid, token_type: "mac" },
  ];
  for (const info of invalid) {
    const { config, req, res } = setup(info);
    expect(await authenticateOAuthRequest({ config, accessToken: "token", req, res })).toBe(false);
    expect(res.status).toHaveBeenCalledWith(401);
  }
});

test("accepts matching audience values and required scopes", async () => {
  for (const aud of ["resource", ["other", "resource"]]) {
    const { config, req, res } = setup(
      { active: true, iss: "issuer", aud, scope: "read", token_type: "Bearer" },
      { requiredScopes: ["read"] },
    );
    expect(await authenticateOAuthRequest({ config, accessToken: "token", req, res })).toBe(true);
  }
});
