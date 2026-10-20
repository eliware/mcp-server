import { test, expect } from "@jest/globals";
import { assertHttpsOAuthEndpoint } from "../../src/oauth/endpoint-security.mjs";

test("accepts HTTPS OAuth endpoints and returns the configured value", () => {
  const endpoint = "https://auth.example.test/token";
  expect(assertHttpsOAuthEndpoint(endpoint, "OAuth token endpoint")).toBe(endpoint);
});

test("rejects invalid OAuth endpoint URLs", () => {
  expect(() => assertHttpsOAuthEndpoint("invalid", "OAuth endpoint")).toThrow(
    "must be a valid HTTPS URL",
  );
});

test("rejects HTTP OAuth endpoints", () => {
  expect(() =>
    assertHttpsOAuthEndpoint("http://auth.example.test/token", "OAuth endpoint"),
  ).toThrow("must use HTTPS");
});

test("rejects embedded credentials in OAuth endpoint URLs", () => {
  expect(() =>
    assertHttpsOAuthEndpoint("https://user:pass@auth.example.test/token", "OAuth endpoint"),
  ).toThrow("must not contain embedded credentials");
});
