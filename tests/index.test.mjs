import { test, expect } from "@jest/globals";
import * as publicApi from "../src/index.mjs";
const { mcpServer, z, createOAuthClient } = publicApi;

test("public entry point exports the server, Zod, and OAuth client workflow", () => {
  expect(mcpServer).toBeInstanceOf(Function);
  expect(z.string().safeParse("ok").success).toBe(true);
  expect(createOAuthClient).toBeInstanceOf(Function);
  expect(publicApi.createRedirectApp).toBeUndefined();
});
