import { test, expect } from "@jest/globals";
import { mcpServer, z, createRedirectApp } from "../src/index.mjs";

test("public entry point exports the server, Zod, and redirect helper", () => {
  expect(mcpServer).toBeInstanceOf(Function);
  expect(z.string().safeParse("ok").success).toBe(true);
  expect(createRedirectApp).toBeInstanceOf(Function);
});
