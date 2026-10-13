import { test, expect } from "@jest/globals";
import { createTransport } from "../src/transport.mjs";

test.each([
  ["stateless", true, true],
  ["stateful", false, false],
])("creates %s transport", (_mode, stateless, enableJsonResponse) => {
  expect(createTransport({ stateless, enableJsonResponse })).toBeTruthy();
});
