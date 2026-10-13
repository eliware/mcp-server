import { test, expect } from "@jest/globals";
import { resolveOAuthClient } from "../src/client.mjs";
test("returns static client config", async () => {
  const client = { mode: "static", clientId: "id" };
  expect(await resolveOAuthClient({ client, provider: {} })).toBe(client);
});
test("resolves dynamic clients through the registration store", async () => {
  const saved = { client_id: "id" };
  const store = { load: async () => saved, save: async () => {} };
  await expect(
    resolveOAuthClient({
      client: { mode: "dynamic" },
      provider: { registration_endpoint: "https://issuer.test/register" },
      store,
    }),
  ).resolves.toBe(saved);
});
test("rejects default arguments and a dynamic client without a store", async () => {
  await expect(resolveOAuthClient()).rejects.toThrow("OAuth client mode");
  await expect(resolveOAuthClient({ client: { mode: "static" }, provider: {} })).rejects.toThrow(
    "clientId",
  );
  await expect(
    resolveOAuthClient({
      client: { mode: "dynamic" },
      provider: { registration_endpoint: "r" },
    }),
  ).rejects.toThrow("client store");
});
