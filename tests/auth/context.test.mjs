import { test, expect } from "@jest/globals";
import { getAuthContext, getUser, requireAuth } from "../../src/auth/context.mjs";

test("reads authenticated identity from the request context", () => {
  const auth = { mode: "oauth2", subject: "user", clientId: "client", issuer: "issuer" };
  expect(requireAuth({ mcpAuth: auth })).toBe(auth);
  expect(requireAuth({ _meta: { mcpAuth: auth } })).toBe(auth);
  expect(requireAuth({ mcpReq: { _meta: { mcpAuth: auth } } })).toBe(auth);
  expect(getUser({ mcpAuth: { ...auth, scopes: ["read"] } })).toEqual({
    subject: "user",
    clientId: "client",
    issuer: "issuer",
    scopes: ["read"],
  });
  expect(getUser({ mcpAuth: { mode: "static" } }).scopes).toEqual([]);
});

test("returns no user and rejects missing authentication", () => {
  expect(getAuthContext()).toBeUndefined();
  expect(getUser()).toBeNull();
  expect(getUser({ mcpAuth: { mode: "none" } })).toBeNull();
  expect(() => requireAuth()).toThrow("Authentication required");
});
