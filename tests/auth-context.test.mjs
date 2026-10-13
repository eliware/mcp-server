import { test, expect } from "@jest/globals";
import * as authContext from "../src/auth-context.mjs";

test("auth context reads identity, scopes, and token", () => {
  const data = {
    mcpAuth: {
      mode: "oauth2",
      subject: "user",
      clientId: "client",
      scopes: ["read"],
      accessToken: "token",
    },
  };
  expect(authContext.requireAuth(data)).toBe(data.mcpAuth);
  expect(authContext.hasScope(data, "read")).toBe(true);
  expect(() => authContext.requireScope(data, "read")).not.toThrow();
  expect(authContext.getUser(data).subject).toBe("user");
  expect(authContext.getAccessToken(data)).toBe("token");
  expect(authContext.requireBearer(data)).toBe("token");
});

test("auth context rejects missing access", () => {
  expect(authContext.getUser()).toBeNull();
  expect(authContext.getAccessToken()).toBeNull();
  expect(() => authContext.requireAuth()).toThrow("Authentication required");
  expect(() => authContext.requireBearer({ mcpAuth: { mode: "static" } })).toThrow(
    "Bearer token required",
  );
  expect(() => authContext.requireScope({}, "write")).toThrow("Missing scope: write");
  expect(authContext.hasScope({ _meta: { mcpAuth: { scopes: ["read"] } } }, "read")).toBe(true);
  expect(authContext.hasScope()).toBe(false);
  expect(authContext.getUser({ mcpAuth: { mode: "static" } })).toEqual({
    subject: undefined,
    clientId: undefined,
    issuer: undefined,
    scopes: [],
  });
  expect(() => authContext.requireBearer()).toThrow("Authentication required");
  expect(() => authContext.requireScope()).toThrow("Missing scope");
});
