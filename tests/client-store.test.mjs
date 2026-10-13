import { jest, test, expect } from "@jest/globals";
import { createClientStore } from "../src/client-store.mjs";

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
