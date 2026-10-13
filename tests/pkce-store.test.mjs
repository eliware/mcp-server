import { jest, test, expect } from "@jest/globals";
import { consumePkceState, createPkceStore } from "../src/pkce-store.mjs";

test("creates stores and consumes valid state once", async () => {
  const save = jest.fn();
  const load = jest.fn().mockResolvedValue({ verifier: "v" });
  const store = createPkceStore({ save, load });
  expect(store.remove).toBeInstanceOf(Function);
  await expect(consumePkceState({ store, state: "s", expectedState: "s" })).resolves.toEqual({
    verifier: "v",
  });
  expect(load).toHaveBeenCalledWith("s");
});

test("supports a custom remove function and rejects invalid store setup", () => {
  const remove = jest.fn();
  expect(createPkceStore({ save: jest.fn(), load: jest.fn(), remove }).remove).toBe(remove);
  expect(() => createPkceStore()).toThrow("PKCE store");
  expect(() => createPkceStore({ save: jest.fn() })).toThrow("PKCE store");
});

test("rejects invalid, missing, or expired state", async () => {
  const store = { load: jest.fn().mockResolvedValue(null), remove: jest.fn() };
  await expect(consumePkceState()).rejects.toThrow("Invalid");
  await expect(consumePkceState({ store, state: "a", expectedState: "b" })).rejects.toThrow(
    "Invalid",
  );
  await expect(consumePkceState({ store, state: "", expectedState: "s" })).rejects.toThrow(
    "Invalid",
  );
  await expect(consumePkceState({ store, state: "s", expectedState: "" })).rejects.toThrow(
    "Invalid",
  );
  await expect(consumePkceState({ store, state: "s", expectedState: "s" })).rejects.toThrow(
    "expired",
  );
});

test("rejects state records without a verifier", async () => {
  const store = { load: jest.fn().mockResolvedValue({}), remove: jest.fn() };
  await expect(consumePkceState({ store, state: "s", expectedState: "s" })).rejects.toThrow(
    "expired",
  );
});
