import { test, expect } from "@jest/globals";
import { resolveAuthRequest } from "../src/auth-request.mjs";

test("creates context for no-auth and bearer-passthrough requests", () => {
  expect(resolveAuthRequest({ mode: "none" }, null)).toEqual({ auth: { mode: "none" } });
  expect(resolveAuthRequest({ mode: "bearer-passthrough" }, "token")).toEqual({
    auth: { mode: "bearer-passthrough", accessToken: "token" },
  });
});

test("requires a token for passthrough and a matching token for static auth", () => {
  expect(resolveAuthRequest({ mode: "bearer-passthrough" }, null)).toEqual({
    error: "Bearer token required",
  });
  expect(resolveAuthRequest({ mode: "static", token: "secret" }, "wrong")).toEqual({
    error: "Invalid bearer token",
  });
  expect(resolveAuthRequest({ mode: "static", token: "secret" }, "secret")).toEqual({
    auth: { mode: "static", accessToken: "secret" },
  });
});
