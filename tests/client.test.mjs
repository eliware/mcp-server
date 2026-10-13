import { test, expect } from "@jest/globals";
import { resolveOAuthClient } from "../src/client.mjs";
test("returns static client config", async () => {
  const client = { mode: "static", clientId: "id" };
  expect(await resolveOAuthClient({ client, provider: {} })).toBe(client);
});
test("rejects invalid client configuration", async () => {
  await expect(resolveOAuthClient({ client: { mode: "static" }, provider: {} })).rejects.toThrow();
  await expect(resolveOAuthClient({ client: { mode: "dynamic" }, provider: {} })).rejects.toThrow();
  await expect(resolveOAuthClient({ client: { mode: "other" }, provider: {} })).rejects.toThrow();
});
test("rejects default arguments and a dynamic client without a store", async () => {
  await expect(resolveOAuthClient()).rejects.toThrow("OAuth client mode");
  await expect(
    resolveOAuthClient({
      client: { mode: "dynamic" },
      provider: { registration_endpoint: "r" },
    }),
  ).rejects.toThrow("client store");
});
