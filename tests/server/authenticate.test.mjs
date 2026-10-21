import { jest, test, expect } from "@jest/globals";
import { authenticateRequest } from "../../src/server/authenticate.mjs";

function fixture(headers = {}) {
  const request = { headers, raw: {} };
  const reply = {
    code: jest.fn().mockReturnThis(),
    send: jest.fn(),
    header: jest.fn().mockReturnThis(),
  };
  return { request, reply };
}

test("leaves the raw request without auth when auth is disabled", async () => {
  const { request, reply } = fixture();
  expect(await authenticateRequest(request, reply, "none")).toBe(true);
  expect(request.raw.auth).toBeUndefined();
  expect(reply.send).not.toHaveBeenCalled();
});

test("passes a valid static bearer token to the SDK request", async () => {
  const { request, reply } = fixture({ authorization: "Bearer right" });
  expect(await authenticateRequest(request, reply, { mode: "static", token: "right" })).toBe(true);
  expect(request.raw.auth).toMatchObject({
    token: "right",
    extra: { mcpAuth: { mode: "static", accessToken: "right" } },
  });
});

test("rejects OAuth when the request has no bearer token", async () => {
  const { request, reply } = fixture();
  expect(await authenticateRequest(request, reply, oauthConfig())).toBe(false);
  expect(reply.code).toHaveBeenCalledWith(401);
  expect(reply.header).toHaveBeenCalledWith("WWW-Authenticate", expect.any(String));
});

test("reports unavailable OAuth introspection", async () => {
  const { request, reply } = fixture({ authorization: "Bearer token" });
  expect(
    await authenticateRequest(
      request,
      reply,
      oauthConfig(async () => {
        throw new Error("offline");
      }),
    ),
  ).toBe(false);
  expect(reply.code).toHaveBeenCalledWith(503);
});

test("rejects an inactive OAuth token", async () => {
  const { request, reply } = fixture({ authorization: "Bearer token" });
  expect(
    await authenticateRequest(
      request,
      reply,
      oauthConfig(async () => ({})),
    ),
  ).toBe(false);
  expect(reply.code).toHaveBeenCalledWith(401);
});

test("passes validated OAuth context to the SDK request", async () => {
  const { request, reply } = fixture({ authorization: "Bearer token" });
  const config = oauthConfig(async () => ({
    active: true,
    iss: "https://issuer.example",
    aud: "https://resource.example",
    sub: "user-1",
  }));
  expect(await authenticateRequest(request, reply, config)).toBe(true);
  expect(request.raw.auth.extra.mcpAuth.subject).toBe("user-1");
});

function oauthConfig(introspect = async () => ({})) {
  return {
    mode: "oauth2",
    issuer: "https://issuer.example",
    resource: "https://resource.example",
    introspect,
  };
}
