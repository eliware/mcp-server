import { test, expect } from "@jest/globals";
import { matchesResource } from "../../src/auth/resource-matching.mjs";

test("matches the resource claim", () => {
  expect(matchesResource({ resource: "api" }, "api")).toBe(true);
});

test("matches string and array audience claims", () => {
  expect(matchesResource({ aud: ["api"] }, "api")).toBe(true);
  expect(matchesResource({ aud: "api" }, "api")).toBe(true);
});

test("rejects claims without the requested resource", () => {
  expect(matchesResource({}, "api")).toBe(false);
  expect(matchesResource({ aud: ["other"] }, "api")).toBe(false);
});
