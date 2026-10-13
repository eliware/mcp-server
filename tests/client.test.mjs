import { jest, test, expect } from "@jest/globals";
import { resolveOAuthClient } from "../src/client.mjs";
test("returns static client config", async () => {
  const client = { mode: "static", clientId: "id" };
  expect(await resolveOAuthClient({ client, provider: {} })).toBe(client);
});
test("loads cached dynamic client", async () => {
  const saved = { client_id: "id" },
    store = { load: jest.fn().mockResolvedValue(saved), save: jest.fn() };
  expect(
    await resolveOAuthClient({
      client: { mode: "dynamic" },
      provider: { registration_endpoint: "r" },
      store,
    }),
  ).toBe(saved);
  expect(store.save).not.toHaveBeenCalled();
});
test("registers and persists dynamic clients with metadata defaults", async () => {
  const originalFetch = global.fetch;
  try {
    for (const item of [
      { client: { mode: "dynamic", metadata: { client_name: "x" } }, body: '{"client_name":"x"}' },
      { client: { mode: "dynamic" }, body: "{}" },
    ]) {
      const store = { load: jest.fn().mockResolvedValue(null), save: jest.fn() };
      global.fetch = jest
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ client_id: "new" }) });
      expect(
        await resolveOAuthClient({
          client: item.client,
          provider: { registration_endpoint: "r" },
          store,
        }),
      ).toEqual({ client_id: "new" });
      expect(store.save).toHaveBeenCalledWith("r", { client_id: "new" });
      expect(global.fetch.mock.calls[0][1].body).toBe(item.body);
    }
  } finally {
    global.fetch = originalFetch;
  }
});
test("rejects invalid client configuration", async () => {
  await expect(resolveOAuthClient({ client: { mode: "static" }, provider: {} })).rejects.toThrow();
  await expect(resolveOAuthClient({ client: { mode: "dynamic" }, provider: {} })).rejects.toThrow();
  await expect(resolveOAuthClient({ client: { mode: "other" }, provider: {} })).rejects.toThrow();
});
test("covers default arguments and custom registration key", async () => {
  await expect(resolveOAuthClient()).rejects.toThrow("OAuth client mode");
  const store = { load: jest.fn().mockResolvedValue({ client_id: "cached" }), save: jest.fn() };
  const result = await resolveOAuthClient({
    client: { mode: "dynamic", registrationKey: "custom" },
    provider: { registration_endpoint: "r" },
    store,
  });
  expect(result.client_id).toBe("cached");
  expect(store.load).toHaveBeenCalledWith("custom");
});
