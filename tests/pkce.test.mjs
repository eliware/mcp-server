import { test, expect } from "@jest/globals";
import { createPkceState } from "../src/pkce.mjs";
test("creates S256 PKCE state with injected and default randomness", () => {
  const p = createPkceState({ randomBytes: (size) => Buffer.alloc(size, 1) });
  expect(p.method).toBe("S256");
  expect(p.verifier).toBeTruthy();
  expect(p.challenge).toBeTruthy();
  const generated = createPkceState();
  expect(generated.verifier).toBeTruthy();
  expect(generated.challenge).toBeTruthy();
  expect(generated.method).toBe("S256");
});
