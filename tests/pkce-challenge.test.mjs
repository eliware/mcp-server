import { test, expect } from "@jest/globals";
import { createCodeChallenge } from "../src/pkce-challenge.mjs";

test("creates an S256 challenge from a verifier", () => {
  expect(createCodeChallenge("verifier")).toBe("iMnq5o6zALKXGivsnlom_0F5_WYda32GHkxlV7mq7hQ");
});
