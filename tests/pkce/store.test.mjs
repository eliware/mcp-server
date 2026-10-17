import { jest, test, expect } from "@jest/globals";
import { consumePkceState, createPkceStore } from "../../src/pkce/store.mjs";

test("creates stores and consumes valid state once", async () => {
  const save = jest.fn();
  const load = jest.fn().mockResolvedValue({ verifier: "v" });
  const remove = jest.fn();
  const store = createPkceStore({ save, load, remove });
  expect(store.remove).toBe(remove);
  await expect(consumePkceState({ store, state: "s", expectedState: "s" })).resolves.toEqual({
    verifier: "v",
  });
  expect(load).toHaveBeenCalledWith("s");
  expect(remove).toHaveBeenCalledWith("s");
});

test("supports a custom remove function and rejects invalid store setup", () => {
  const remove = jest.fn();
  expect(createPkceStore({ save: jest.fn(), load: jest.fn(), remove }).remove).toBe(remove);
  expect(() => createPkceStore()).toThrow("PKCE store");
  expect(() => createPkceStore({ save: jest.fn() })).toThrow("PKCE store");
  expect(() => createPkceStore({ save: jest.fn(), load: jest.fn() })).toThrow(
    "save, load, and remove",
  );
});

test.each([
  ["missing state", undefined, "Invalid"],
  ["mismatched state", { state: "a", expectedState: "b" }, "Invalid"],
  ["empty state", { state: "", expectedState: "s" }, "Invalid"],
  ["empty expected state", { state: "s", expectedState: "" }, "Invalid"],
  [
    "expired state",
    {
      store: { load: jest.fn().mockResolvedValue(null), remove: jest.fn() },
      state: "s",
      expectedState: "s",
    },
    "expired",
  ],
  [
    "state without a verifier",
    {
      store: { load: jest.fn().mockResolvedValue({}), remove: jest.fn() },
      state: "s",
      expectedState: "s",
    },
    "expired",
  ],
])("rejects %s", async (_case, options, message) => {
  await expect(consumePkceState(options)).rejects.toThrow(message);
});
