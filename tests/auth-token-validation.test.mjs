import { test, expect } from "@jest/globals";
import { matchesResource, validateOAuthToken } from "../src/auth-token-validation.mjs";

test("matches resource values in resource and audience claims", () => {
  expect(matchesResource({ resource: "api" }, "api")).toBe(true);
  expect(matchesResource({ aud: ["api"] }, "api")).toBe(true);
  expect(matchesResource({ aud: "api" }, "api")).toBe(true);
  expect(matchesResource({}, "api")).toBe(false);
});

test("validates OAuth token claims and returns scopes", () => {
  const info = {
    active: true,
    iss: "issuer",
    resource: "resource",
    exp: 200,
    token_type: "Bearer",
    scope: "read write",
  };
  expect(
    validateOAuthToken(info, {
      issuer: "issuer",
      resource: "resource",
      requiredScopes: ["read"],
      now: 100000,
    }),
  ).toEqual({ scopes: ["read", "write"] });
  expect(
    validateOAuthToken(info, {
      issuer: "issuer",
      resource: "resource",
      requiredScopes: ["admin"],
      now: 100000,
    }),
  ).toBeNull();
});

test("rejects invalid token claims", () => {
  const valid = { active: true, iss: "issuer", resource: "resource", scope: "read" };
  const invalid = [
    null,
    { ...valid, active: false },
    { ...valid, iss: "other" },
    { ...valid, resource: "other" },
    { ...valid, resource: undefined, aud: ["other"] },
    { ...valid, exp: 99 },
    { ...valid, token_type: "mac" },
    { ...valid, scope: "read" },
  ];
  for (const info of invalid) {
    expect(
      validateOAuthToken(info, {
        issuer: "issuer",
        resource: "resource",
        requiredScopes: info?.scope ? ["write"] : [],
        now: 100000,
      }),
    ).toBeNull();
  }
});
