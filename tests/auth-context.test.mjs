import { test, expect } from "@jest/globals";
import { createOAuthAuthContext, getUser, requireAuth } from "../src/auth-context.mjs";

test("reads authenticated identity from the request context", () => {
  const auth = { mode: "oauth2", subject: "user", clientId: "client", issuer: "issuer" };
  expect(requireAuth({ mcpAuth: auth })).toBe(auth);
  expect(requireAuth({ _meta: { mcpAuth: auth } })).toBe(auth);
  expect(getUser({ mcpAuth: { ...auth, scopes: ["read"] } })).toEqual({
    subject: "user",
    clientId: "client",
    issuer: "issuer",
    scopes: ["read"],
  });
  expect(getUser({ mcpAuth: { mode: "static" } }).scopes).toEqual([]);
});

test("returns no user and rejects missing authentication", () => {
  expect(getUser()).toBeNull();
  expect(getUser({ mcpAuth: { mode: "none" } })).toBeNull();
  expect(() => requireAuth()).toThrow("Authentication required");
});

test("builds OAuth context from configured and fallback subject claims", () => {
  const config = { mode: "oauth2", subjectClaim: "username", resource: "api" };
  const options = { config, accessToken: "token", scopes: ["read"] };
  expect(
    createOAuthAuthContext({
      ...options,
      info: { username: "custom", iss: "issuer", secret: "x" },
    }),
  ).toMatchObject({
    subject: "custom",
    issuer: "issuer",
    resource: "api",
    scopes: ["read"],
    accessToken: "token",
    claims: { iss: "issuer" },
  });
  expect(
    createOAuthAuthContext({
      ...options,
      info: { sub: "subject", user_id: "fallback" },
      config: { ...config, subjectClaim: "missing" },
    }).subject,
  ).toBe("subject");
  expect(
    createOAuthAuthContext({
      ...options,
      info: { user_id: "fallback" },
      config: { ...config, subjectClaim: "missing" },
    }).subject,
  ).toBe("fallback");
});
