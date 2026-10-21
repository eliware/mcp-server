import { jest, test, expect } from "@jest/globals";
import { createOAuthClientSetup } from "../../src/oauth/client-setup.mjs";

test("discovers provider metadata and resolves stored credentials", async () => {
  const provider = {
    authorization_endpoint: "https://auth/authorize",
    registration_endpoint: "https://auth/register",
  };
  const credentials = { client_id: "registered" };
  const fetchFn = jest.fn().mockResolvedValue({ ok: true, json: async () => provider });
  const store = { load: jest.fn().mockResolvedValue(credentials) };
  const setup = await createOAuthClientSetup({
    issuer: "https://auth",
    client: { mode: "dynamic" },
    store,
    fetchFn,
  });
  expect(fetchFn).toHaveBeenCalledWith("https://auth/.well-known/openid-configuration", {
    redirect: "error",
  });
  expect(setup).toEqual({ provider, credentials });
  expect(store.load).toHaveBeenCalled();
});

test("rejects an HTTP issuer before provider discovery", async () => {
  const fetchFn = jest.fn();
  await expect(
    createOAuthClientSetup({
      issuer: "http://auth",
      client: { mode: "static", client_id: "id" },
      fetchFn,
    }),
  ).rejects.toThrow("must use HTTPS");
  expect(fetchFn).not.toHaveBeenCalled();
});
