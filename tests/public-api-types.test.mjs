import { test, expect } from "@jest/globals";
import { readFileSync } from "node:fs";
import * as publicApi from "../src/index.mjs";
import { missingApiDeclarations } from "../src/public-api-types.mjs";

test("declares every runtime value export in the type entry point", () => {
  const declarations = readFileSync(new URL("../src/index.d.ts", import.meta.url), "utf8");
  expect(missingApiDeclarations(Object.keys(publicApi), declarations)).toEqual([]);
});

test("reports runtime exports without type declarations", () => {
  expect(missingApiDeclarations(["present", "missing"], "export { present }")).toEqual(["missing"]);
});
