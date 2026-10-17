import { test, expect } from "@jest/globals";
import { normalizeOAuthAuth } from "../../src/oauth/auth-config.mjs";

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
