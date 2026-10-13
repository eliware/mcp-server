import { test, expect } from "@jest/globals";
import { normalizeOAuthAuth, resolveRuntimeAuth } from "../src/oauth-auth-config.mjs";

const introspect = async () => ({});
const valid = { mode: "oauth2", issuer: "iss", resource: "res", introspect };

test("normalizes OAuth scopes and subject claim defaults", () => {
  expect(normalizeOAuthAuth(valid)).toMatchObject({
    mode: "oauth2",
    requiredScopes: [],
    subjectClaim: "sub",
  });
  expect(normalizeOAuthAuth({ ...valid, requiredScopes: ["read"] }).requiredScopes).toEqual([
    "read",
  ]);
  expect(normalizeOAuthAuth({ ...valid, scopes: ["read"] }).requiredScopes).toEqual(["read"]);
  expect(normalizeOAuthAuth({ ...valid, subjectClaim: "username" }).subjectClaim).toBe("username");
});

test("rejects invalid OAuth settings", () => {
  expect(() => normalizeOAuthAuth({ mode: "oauth2" })).toThrow("requires issuer, resource");
  expect(() => normalizeOAuthAuth({ ...valid, scopes: "x" })).toThrow("requiredScopes");
  expect(() => normalizeOAuthAuth({ ...valid, scopes: [""] })).toThrow("requiredScopes");
  expect(() => normalizeOAuthAuth({ ...valid, subjectClaim: " " })).toThrow("subjectClaim");
});

test("creates introspection behavior from OAuth endpoint settings", async () => {
  const calls = [];
  const auth = resolveRuntimeAuth({
    mode: "oauth2",
    issuer: "https://issuer.test",
    resource: "https://resource.test",
    introspection: {
      endpoint: "https://issuer.test/introspect",
      fetchFn: async (...args) => {
        calls.push(args);
        return { ok: true, json: async () => ({ active: true }) };
      },
    },
  });
  await expect(auth.introspect("token")).resolves.toEqual({ active: true });
  expect(calls[0][0]).toBe("https://issuer.test/introspect");
  expect(new URLSearchParams(calls[0][1].body).get("resource")).toBe("https://resource.test");
});

test("keeps supplied runtime auth values", () => {
  const auth = { mode: "static", token: "secret" };
  expect(resolveRuntimeAuth(auth)).toBe(auth);
  const oauth = { mode: "oauth2", introspect };
  expect(resolveRuntimeAuth(oauth)).toBe(oauth);
});
