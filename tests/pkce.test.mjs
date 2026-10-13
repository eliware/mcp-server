import { test, expect } from "@jest/globals";
import { createPkceState } from "../src/pkce.mjs";
test("creates S256 PKCE state", () => {
  const p = createPkceState({ randomBytes: (size) => Buffer.alloc(size, 1) });
  expect(p.method).toBe("S256");
  expect(p.verifier).toBeTruthy();
  expect(p.challenge).toBeTruthy();
});
test("covers default PKCE generation", () => {
  const p = createPkceState();
  expect(p.verifier).toBeTruthy();
});
