import { jest, test, expect } from "@jest/globals";
import { createOAuthIntrospector } from "../src/auth-introspection.mjs";

test("OAuth introspector posts credentials and returns JSON", async () => {
  const fetchFn = jest.fn(async () => ({ ok: true, json: async () => ({ active: true }) }));
  const introspect = createOAuthIntrospector({
    resource: "https://api",
    introspectionEndpoint: "https://auth/introspect",
    clientId: "client",
    clientSecret: "secret",
    fetchFn,
  });
  await expect(introspect("token")).resolves.toEqual({ active: true });
  expect(fetchFn.mock.calls[0][1].headers.authorization).toMatch(/^Basic /);
});

test("OAuth introspector rejects a missing endpoint and returns null on failure", async () => {
  createOAuthIntrospector();
  const empty = createOAuthIntrospector({ fetchFn: jest.fn() });
  await expect(empty("token")).rejects.toThrow("OAuth introspection endpoint is required");
  const unavailable = createOAuthIntrospector({
    introspectionEndpoint: "https://auth/introspect",
    fetchFn: async () => ({ ok: false }),
  });
  await expect(unavailable("token")).resolves.toBeNull();
  const publicClient = createOAuthIntrospector({
    introspectionEndpoint: "https://auth/introspect",
    fetchFn: async (_url, options) => ({
      ok: options.headers.authorization === undefined,
      json: async () => ({}),
    }),
  });
  await expect(publicClient("token")).resolves.toEqual({});
});
