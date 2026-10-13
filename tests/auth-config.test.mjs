import { test, expect } from "@jest/globals";
import { normalizeAuth } from "../src/auth-config.mjs";

test("normalizes no-auth modes and rejects unsupported modes", () => {
  expect(normalizeAuth()).toEqual({ mode: "none" });
  expect(normalizeAuth(null)).toEqual({ mode: "none" });
  expect(normalizeAuth("none")).toEqual({ mode: "none" });
  expect(() => normalizeAuth({ mode: "unsupported" })).toThrow("Unsupported auth mode");
});

test("requires a token for static authentication", () => {
  expect(normalizeAuth({ mode: "static", token: "secret" })).toEqual({
    mode: "static",
    token: "secret",
  });
  expect(() => normalizeAuth({ mode: "static" })).toThrow("static auth requires");
});

test("normalizes OAuth scopes and subject claim", () => {
  const introspect = async () => ({});
  expect(
    normalizeAuth({ mode: "oauth2", issuer: "iss", resource: "res", introspect }),
  ).toMatchObject({ mode: "oauth2", requiredScopes: [], subjectClaim: "sub" });
  expect(
    normalizeAuth({
      mode: "oauth2",
      issuer: "iss",
      resource: "res",
      introspect,
      requiredScopes: ["read"],
    }).requiredScopes,
  ).toEqual(["read"]);
  expect(
    normalizeAuth({ mode: "oauth2", issuer: "iss", resource: "res", introspect, scopes: ["read"] })
      .requiredScopes,
  ).toEqual(["read"]);
  expect(
    normalizeAuth({
      mode: "oauth2",
      issuer: "iss",
      resource: "res",
      introspect,
      subjectClaim: "username",
    }).subjectClaim,
  ).toBe("username");
});

test("rejects invalid OAuth settings", () => {
  const introspect = async () => ({});
  expect(() => normalizeAuth({ mode: "oauth2" })).toThrow("requires issuer, resource");
  expect(() =>
    normalizeAuth({ mode: "oauth2", issuer: "i", resource: "r", introspect, scopes: "x" }),
  ).toThrow("requiredScopes");
  expect(() =>
    normalizeAuth({ mode: "oauth2", issuer: "i", resource: "r", introspect, scopes: [""] }),
  ).toThrow("requiredScopes");
  expect(() =>
    normalizeAuth({
      mode: "oauth2",
      issuer: "i",
      resource: "r",
      introspect,
      subjectClaim: " ",
    }),
  ).toThrow("subjectClaim");
});
