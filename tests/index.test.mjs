import { test, expect } from "@jest/globals";
import * as publicApi from "../src/index.mjs";
const { mcpServer, z } = publicApi;

test("root entry point exports the server and Zod without OAuth helpers", () => {
  expect(mcpServer).toBeInstanceOf(Function);
  expect(z.string().safeParse("ok").success).toBe(true);
  expect(publicApi.createOAuthClient).toBeUndefined();
});
