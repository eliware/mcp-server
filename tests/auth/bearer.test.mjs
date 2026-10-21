import { test, expect } from "@jest/globals";
import { bearer, parseBearerToken } from "../../src/auth/bearer.mjs";

test("parses bearer headers and rejects other or empty values", () => {
  expect(bearer({ get: () => "Bearer token" })).toBe("token");
  expect(bearer({ get: () => "Basic token" })).toBeNull();
  expect(bearer({ get: () => "" })).toBeNull();
});

test("parses a bearer value for shared request readers", () => {
  expect(parseBearerToken("bEaReR token-value")).toBe("token-value");
  expect(parseBearerToken(undefined)).toBeNull();
  expect(parseBearerToken("Bearer ")).toBeNull();
  expect(parseBearerToken("Bearer two tokens")).toBeNull();
  expect(parseBearerToken("Basic value")).toBeNull();
});
