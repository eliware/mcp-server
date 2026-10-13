import { test, expect } from "@jest/globals";
import { normalizeAuth } from "../src/auth-config.mjs";

test("normalizes no-auth modes and rejects unsupported modes", () => {
  expect(normalizeAuth()).toEqual({ mode: "none" });
  expect(normalizeAuth(null)).toEqual({ mode: "none" });
  expect(normalizeAuth("none")).toEqual({ mode: "none" });
  expect(() => normalizeAuth({ mode: "unsupported" })).toThrow("Unsupported auth mode");
});

test("requires a token for static authentication", () => {
  expect(normalizeAuth({ mode: "static", token: "secret" })).toEqual({
    mode: "static",
    token: "secret",
  });
  expect(() => normalizeAuth({ mode: "static" })).toThrow("static auth requires");
});
