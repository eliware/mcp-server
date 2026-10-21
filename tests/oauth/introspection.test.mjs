import { jest, test, expect } from "@jest/globals";
import { createOAuthIntrospector } from "../../src/oauth/introspection.mjs";

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
  expect(() => createOAuthIntrospector()).toThrow("OAuth introspection endpoint is required");
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

test("rejects HTTP introspection endpoints before sending a token or client secret", () => {
  const fetchFn = jest.fn();
  expect(() =>
    createOAuthIntrospector({
      introspectionEndpoint: "http://auth/introspect",
      clientId: "client",
      clientSecret: "secret",
      fetchFn,
    }),
  ).toThrow("must use HTTPS");
  expect(fetchFn).not.toHaveBeenCalled();
});
