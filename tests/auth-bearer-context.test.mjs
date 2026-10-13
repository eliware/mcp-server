import { test, expect } from "@jest/globals";
import { getAccessToken, requireBearer } from "../src/auth-bearer-context.mjs";

test("reads bearer tokens from the request context", () => {
  const auth = { mode: "oauth2", accessToken: "token" };
  expect(getAccessToken({ mcpAuth: auth })).toBe("token");
  expect(getAccessToken({ _meta: { mcpAuth: auth } })).toBe("token");
  expect(requireBearer({ mcpAuth: auth })).toBe("token");
});

test("returns null or rejects when bearer access is missing", () => {
  expect(getAccessToken()).toBeNull();
  expect(getAccessToken({ mcpAuth: { mode: "oauth2" } })).toBeNull();
  expect(() => requireBearer()).toThrow("Authentication required");
  expect(() => requireBearer({ mcpAuth: { mode: "static" } })).toThrow("Bearer token required");
});
