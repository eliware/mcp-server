import { jest, test, expect } from "@jest/globals";
import { resolveDynamicOAuthClient } from "../src/dynamic-client.mjs";

test("loads cached dynamic client by registration key", async () => {
  const saved = { client_id: "id" };
  const store = { load: jest.fn().mockResolvedValue(saved), save: jest.fn() };
  const result = await resolveDynamicOAuthClient({
    client: { registrationKey: "custom" },
    provider: { registration_endpoint: "r" },
    store,
  });
  expect(result).toBe(saved);
  expect(store.load).toHaveBeenCalledWith("custom");
  expect(store.save).not.toHaveBeenCalled();
});

test("registers and saves clients with metadata defaults", async () => {
  const originalFetch = global.fetch;
  try {
    for (const item of [
      { client: { metadata: { client_name: "x" } }, body: '{"client_name":"x"}' },
      { client: {}, body: "{}" },
    ]) {
      const store = { load: jest.fn().mockResolvedValue(null), save: jest.fn() };
      global.fetch = jest
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ client_id: "new" }) });
      expect(
        await resolveDynamicOAuthClient({
          client: item.client,
          provider: { registration_endpoint: "https://auth/register" },
          store,
        }),
      ).toEqual({ client_id: "new" });
      expect(store.save).toHaveBeenCalledWith("https://auth/register", { client_id: "new" });
      expect(global.fetch.mock.calls[0][1].body).toBe(item.body);
    }
  } finally {
    global.fetch = originalFetch;
  }
});

test("rejects a missing registration endpoint before reading the store", async () => {
  const store = { load: jest.fn(), save: jest.fn() };
  await expect(resolveDynamicOAuthClient({ client: {}, provider: {}, store })).rejects.toThrow(
    "OAuth registration endpoint is required",
  );
  expect(store.load).not.toHaveBeenCalled();
});
