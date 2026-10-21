import { jest, test, expect } from "@jest/globals";
import {
  consumePkceState,
  createInMemoryPkceStore,
  createPkceStore,
} from "../../src/pkce/store.mjs";

test("creates stores with an atomic consume operation", async () => {
  const save = jest.fn();
  const consume = jest.fn().mockResolvedValue({ verifier: "v", sessionState: "s" });
  const store = createPkceStore({ save, consume });
  expect(store.consume).toBe(consume);
  await expect(consumePkceState({ store, state: "s", expectedState: "s" })).resolves.toEqual({
    verifier: "v",
    sessionState: "s",
  });
  expect(consume).toHaveBeenCalledWith("s");
});

test("rejects invalid store setup", () => {
  expect(() => createPkceStore()).toThrow("PKCE store");
  expect(() => createPkceStore({ save: jest.fn() })).toThrow("PKCE store");
  expect(() => createPkceStore({ save: jest.fn(), load: jest.fn() })).toThrow("save and consume");
});

test("stores and consumes pending PKCE data in memory", async () => {
  const store = createInMemoryPkceStore();
  await store.save("state", { verifier: "verifier", sessionState: "state" });
  await expect(
    consumePkceState({ store, state: "state", expectedState: "state" }),
  ).resolves.toEqual({ verifier: "verifier", sessionState: "state" });
  await expect(consumePkceState({ store, state: "state", expectedState: "state" })).rejects.toThrow(
    "expired or unknown",
  );
});

test("allows only one concurrent consume to receive a verifier", async () => {
  const store = createInMemoryPkceStore();
  await store.save("state", { verifier: "verifier", sessionState: "state" });

  const results = await Promise.allSettled([
    consumePkceState({ store, state: "state", expectedState: "state" }),
    consumePkceState({ store, state: "state", expectedState: "state" }),
  ]);

  expect(results.filter(({ status }) => status === "fulfilled")).toHaveLength(1);
  expect(results.filter(({ status }) => status === "rejected")).toHaveLength(1);
});

test("delegates one-time consumption to the custom store", async () => {
  const records = new Map([["state", { verifier: "verifier", sessionState: "state" }]]);
  const store = createPkceStore({
    save: async (state, record) => records.set(state, record),
    consume: (state) => {
      const record = records.get(state);
      records.delete(state);
      return record;
    },
  });

  const results = await Promise.allSettled([
    consumePkceState({ store, state: "state", expectedState: "state" }),
    consumePkceState({ store, state: "state", expectedState: "state" }),
  ]);

  expect(results.filter(({ status }) => status === "fulfilled")).toHaveLength(1);
  expect(results.filter(({ status }) => status === "rejected")).toHaveLength(1);
});

test.each([
  ["missing state", undefined, "Invalid"],
  ["empty state", { state: "", expectedState: "s" }, "Invalid"],
  ["empty expected state", { state: "s", expectedState: "" }, "Invalid"],
  [
    "expired state",
    {
      store: { consume: jest.fn().mockResolvedValue(null) },
      state: "s",
      expectedState: "s",
    },
    "expired",
  ],
  [
    "state without a verifier",
    {
      store: { consume: jest.fn().mockResolvedValue({}) },
      state: "s",
      expectedState: "s",
    },
    "expired",
  ],
])("rejects %s", async (_case, options, message) => {
  await expect(consumePkceState(options)).rejects.toThrow(message);
});

test("rejects a session value that differs from the value saved with the PKCE verifier", async () => {
  const consume = jest.fn().mockResolvedValue({ verifier: "v", sessionState: "saved-session" });
  await expect(
    consumePkceState({ store: { consume }, state: "callback-state", expectedState: "other" }),
  ).rejects.toThrow("Invalid OAuth state");
  expect(consume).toHaveBeenCalledWith("callback-state");
});
