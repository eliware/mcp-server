import { test, expect } from "@jest/globals";
import { matchesResource, sanitizeClaims } from "../src/auth-claims.mjs";

test("matches resource values in resource and audience claims", () => {
  expect(matchesResource({ resource: "api" }, "api")).toBe(true);
  expect(matchesResource({ aud: ["api"] }, "api")).toBe(true);
  expect(matchesResource({ aud: "api" }, "api")).toBe(true);
  expect(matchesResource({}, "api")).toBe(false);
});

test("keeps approved claims and returns an empty result without input", () => {
  expect(sanitizeClaims({ active: true, sub: "user", secret: "hide" })).toEqual({
    active: true,
    sub: "user",
  });
  expect(sanitizeClaims()).toEqual({});
});
