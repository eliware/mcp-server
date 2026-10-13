import { test, expect } from "@jest/globals";
import { sanitizeClaims } from "../src/auth-claims.mjs";

test("keeps approved claims and returns an empty result without input", () => {
  expect(sanitizeClaims({ active: true, sub: "user", secret: "hide" })).toEqual({
    active: true,
    sub: "user",
  });
  expect(sanitizeClaims()).toEqual({});
});
