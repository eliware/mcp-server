import { jest, test, expect } from "@jest/globals";
import { createOAuthClient } from "../../src/oauth/client.mjs";

const provider = {
  authorization_endpoint: "https://auth/authorize",
  token_endpoint: "https://auth/token",
  registration_endpoint: "https://auth/register",
};

test("builds a client from provider data and stored credentials", async () => {
  const fetchFn = jest.fn().mockResolvedValue({ ok: true, json: async () => provider });
  const credentials = { client_id: "registered" };
  const store = { load: jest.fn().mockResolvedValue(credentials) };
  const client = await createOAuthClient({
    issuer: "https://auth",
    client: { mode: "dynamic" },
    store,
    fetchFn,
  });
  expect(client.provider).toEqual(provider);
  expect(client.credentials).toEqual(credentials);
  expect(client.authorizationUrl).toBeInstanceOf(Function);
  expect(client.exchangeCode).toBeInstanceOf(Function);
  expect(store.load).toHaveBeenCalled();
});

test("rejects omitted client options", async () => {
  await expect(createOAuthClient()).rejects.toThrow();
});
