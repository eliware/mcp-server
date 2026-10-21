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
  expect(fetchFn.mock.calls[0][1].redirect).toBe("error");
});

test.each([
  [307, "http://auth-redirect.test/introspect"],
  [307, "https://other-origin.test/introspect"],
  [308, "http://auth-redirect.test/introspect"],
  [308, "https://other-origin.test/introspect"],
])(
  "rejects a %i redirect to %s without forwarding introspection credentials",
  async (status, target) => {
    const redirectTarget = jest.fn();
    const fetchFn = jest.fn(async (_url, options) => {
      if (options.redirect === "error") throw new TypeError(`Redirect ${status} rejected`);
      return redirectTarget(target, options);
    });
    const introspect = createOAuthIntrospector({
      introspectionEndpoint: "https://auth/introspect",
      clientId: "client",
      clientSecret: "client-secret",
      fetchFn,
    });

    await expect(introspect("access-token")).rejects.toThrow(`Redirect ${status} rejected`);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn.mock.calls[0][1].redirect).toBe("error");
    expect(redirectTarget).not.toHaveBeenCalled();
  },
);

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
