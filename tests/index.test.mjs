import { test, expect } from "@jest/globals";
import { readFileSync } from "node:fs";
import * as publicApi from "../src/index.mjs";
const { mcpServer, z, createRedirectApp } = publicApi;

test("public entry point exports the server, Zod, and redirect helper", () => {
  expect(mcpServer).toBeInstanceOf(Function);
  expect(z.string().safeParse("ok").success).toBe(true);
  expect(createRedirectApp).toBeInstanceOf(Function);
});

test("declares every runtime value export in the type entry point", () => {
  const declarations = readFileSync(new URL("../src/index.d.ts", import.meta.url), "utf8");
  for (const name of Object.keys(publicApi)) {
    expect(declarations).toMatch(new RegExp(`\\b${name}\\b`));
  }
});
