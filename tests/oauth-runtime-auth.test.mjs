import { test, expect } from "@jest/globals";
import { resolveRuntimeAuth } from "../src/oauth-runtime-auth.mjs";

test("creates introspection behavior from OAuth endpoint settings", async () => {
  const calls = [];
  const auth = resolveRuntimeAuth({
    mode: "oauth2",
    issuer: "https://issuer.test",
    resource: "https://resource.test",
    introspection: {
      endpoint: "https://issuer.test/introspect",
      fetchFn: async (...args) => {
        calls.push(args);
        return { ok: true, json: async () => ({ active: true }) };
      },
    },
  });
  await auth.introspect("token");
  expect(calls[0][0]).toBe("https://issuer.test/introspect");
  expect(new URLSearchParams(calls[0][1].body).get("resource")).toBe("https://resource.test");
});

test("keeps supplied runtime auth values", () => {
  const auth = { mode: "static", token: "secret" };
  const oauth = { mode: "oauth2", introspect: async () => ({}) };
  expect(resolveRuntimeAuth(auth)).toBe(auth);
  expect(resolveRuntimeAuth(oauth)).toBe(oauth);
});
