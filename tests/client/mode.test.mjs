import { test, expect } from "@jest/globals";
import { validateOAuthClientMode } from "../../src/client/mode.mjs";

test("accepts static and dynamic client modes", () => {
  expect(() => validateOAuthClientMode({ mode: "static", clientId: "id" })).not.toThrow();
  expect(() => validateOAuthClientMode({ mode: "dynamic" })).not.toThrow();
});

test("rejects missing client IDs and unsupported client modes", () => {
  expect(() => validateOAuthClientMode({ mode: "static" })).toThrow("requires clientId");
  expect(() => validateOAuthClientMode({ mode: "other" })).toThrow(
    "mode must be static or dynamic",
  );
});
