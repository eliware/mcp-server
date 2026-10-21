import { test, expect } from "@jest/globals";
import { readBearerToken } from "../../../src/server/auth/bearer-token.mjs";

test("reads a bearer token without case sensitivity", () => {
  expect(readBearerToken({ headers: { authorization: "bEaReR token-value" } })).toBe("token-value");
});

test("returns no token for an absent or non-bearer authorization header", () => {
  expect(readBearerToken({ headers: {} })).toBeUndefined();
  expect(readBearerToken({ headers: { authorization: "Basic value" } })).toBeUndefined();
});
