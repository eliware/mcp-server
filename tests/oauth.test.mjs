import { jest, test, expect } from "@jest/globals";
import { createClientStore, discoverOAuthProvider, registerOAuthClient } from "../src/oauth.mjs";

const response = (body, ok = true, status = 200) => ({ ok, status, json: async () => body });

test("discovers provider metadata", async () => {
  const fetchFn = jest.fn().mockResolvedValue(response({ authorization_endpoint: "a" }));
  expect(await discoverOAuthProvider({ issuer: "https://auth/", fetchFn })).toEqual({
    authorization_endpoint: "a",
  });
  expect(fetchFn).toHaveBeenCalledWith("https://auth/.well-known/openid-configuration");
});

test("registers a client and sends its metadata", async () => {
  const fetchFn = jest.fn().mockResolvedValue(response({ client_id: "x" }));
  const result = await registerOAuthClient({
    registrationEndpoint: "https://auth/register",
    metadata: { client_name: "app" },
    fetchFn,
  });
  expect(result).toEqual({ client_id: "x" });
  expect(fetchFn.mock.calls[0][1]).toMatchObject({
    method: "POST",
    body: JSON.stringify({ client_name: "app" }),
  });
});

test("rejects discovery and registration failures", async () => {
  const bad = jest.fn().mockResolvedValue(response({}, false, 500));
  await expect(discoverOAuthProvider({ issuer: "https://auth", fetchFn: bad })).rejects.toThrow(
    "discovery",
  );
  await expect(
    registerOAuthClient({ registrationEndpoint: "x", metadata: {}, fetchFn: bad }),
  ).rejects.toThrow("registration");
  await expect(discoverOAuthProvider({ fetchFn: bad })).rejects.toThrow("issuer");
  await expect(registerOAuthClient({ metadata: {}, fetchFn: bad })).rejects.toThrow("endpoint");
  await expect(discoverOAuthProvider()).rejects.toThrow("issuer");
  await expect(registerOAuthClient()).rejects.toThrow("endpoint");
});

test("uses fetch by default", async () => {
  const original = global.fetch;
  global.fetch = jest.fn().mockResolvedValue(response({ ok: true }));
  try {
    await discoverOAuthProvider({ issuer: "https://auth" });
    await registerOAuthClient({ registrationEndpoint: "https://auth/register", metadata: {} });
  } finally {
    global.fetch = original;
  }
});

test("creates client stores with default or custom remove functions", async () => {
  const load = jest.fn();
  const save = jest.fn();
  const store = createClientStore({ load, save });
  expect(store.remove).toBeInstanceOf(Function);
  await store.remove("key");
  const remove = jest.fn();
  expect(createClientStore({ load, save, remove }).remove).toBe(remove);
  expect(() => createClientStore()).toThrow("client store");
  expect(() => createClientStore({ load })).toThrow("client store");
});
