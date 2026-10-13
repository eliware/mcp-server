import { test, expect } from "@jest/globals";
import * as publicApi from "../src/index.mjs";
const { mcpServer, z, createRedirectApp } = publicApi;

test("public entry point exports the server, Zod, and redirect helper", () => {
  expect(mcpServer).toBeInstanceOf(Function);
  expect(z.string().safeParse("ok").success).toBe(true);
  expect(createRedirectApp).toBeInstanceOf(Function);
});
