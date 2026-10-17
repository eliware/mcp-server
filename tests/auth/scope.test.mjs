import { test, expect } from "@jest/globals";
import { hasScope, requireScope } from "../../src/auth/scope.mjs";

test("checks scopes in request and metadata contexts", () => {
  expect(hasScope({ mcpAuth: { scopes: ["read"] } }, "read")).toBe(true);
  expect(hasScope({ _meta: { mcpAuth: { scopes: ["read"] } } }, "read")).toBe(true);
  expect(hasScope()).toBe(false);
  expect(requireScope({ mcpAuth: { scopes: ["read"] } }, "read")).toBeUndefined();
  expect(() => requireScope()).toThrow("Missing scope");
});

test("sets scope details when a required scope is missing", () => {
  try {
    requireScope({}, "write");
    throw new Error("Expected scope check to fail");
  } catch (error) {
    expect(error.message).toBe("Missing scope: write");
    expect(error.status).toBe(403);
    expect(error.scope).toBe("write");
  }
});
