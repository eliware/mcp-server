import { test, expect } from "@jest/globals";
import { bearer, matchesResource, sanitizeClaims, validStaticToken } from "../src/auth-token.mjs";

test("token helpers match resources and bearer values", () => {
  expect(matchesResource({ resource: "api" }, "api")).toBe(true);
  expect(matchesResource({ aud: ["api"] }, "api")).toBe(true);
  expect(matchesResource({ aud: "api" }, "api")).toBe(true);
  expect(matchesResource({}, "api")).toBe(false);
  expect(validStaticToken("secret", "secret")).toBe(true);
  expect(validStaticToken("secret", "other")).toBe(false);
  expect(validStaticToken("secret", "secRet")).toBe(false);
  expect(validStaticToken(null, "secret")).toBe(false);
  expect(bearer({ get: () => "Bearer token" })).toBe("token");
  expect(bearer({ get: () => "Basic token" })).toBeNull();
  expect(bearer({ get: () => "" })).toBeNull();
});

test("claim helper allows only approved claims", () => {
  expect(sanitizeClaims({ active: true, sub: "user", secret: "hide" })).toEqual({
    active: true,
    sub: "user",
  });
  expect(sanitizeClaims()).toEqual({});
});
