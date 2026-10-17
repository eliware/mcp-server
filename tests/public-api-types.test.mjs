import { test, expect } from "@jest/globals";
import { missingApiDeclarations } from "../src/public-api-types.mjs";

test("reports runtime exports without type declarations", () => {
  expect(missingApiDeclarations(["present", "missing"], "export { present }")).toEqual(["missing"]);
});

test("returns no missing exports when each export has a declaration", () => {
  expect(missingApiDeclarations(["first", "second"], "export { first, second }")).toEqual([]);
});
