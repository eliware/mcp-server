import { test, expect } from "@jest/globals";
import { injectRequestAuthMetadata } from "../src/request-auth-metadata.mjs";

test("adds auth to existing request metadata", () => {
  const params = { _meta: { trace: "trace" } };
  const auth = { mode: "static" };
  injectRequestAuthMetadata(params, auth);
  expect(params._meta).toEqual({ trace: "trace", mcpAuth: auth });
});

test("ignores missing or non-object request parameters", () => {
  expect(injectRequestAuthMetadata(undefined, {})).toBeUndefined();
  expect(injectRequestAuthMetadata("params", {})).toBeUndefined();
});

test("removes caller-supplied auth metadata when authentication is disabled", () => {
  const params = { _meta: { trace: "trace", mcpAuth: { mode: "static" } } };
  injectRequestAuthMetadata(params);
  expect(params._meta).toEqual({ trace: "trace" });
});
