import { test, expect } from "@jest/globals";
import { isAuthRequest } from "../../src/auth/route.mjs";

test("matches only configured POST paths", () => {
  expect(isAuthRequest({ method: "POST", path: "/mcp" }, ["/mcp"])).toBe(true);
  expect(isAuthRequest({ method: "GET", path: "/mcp" }, ["/mcp"])).toBe(false);
  expect(isAuthRequest({ method: "POST", path: "/other" }, ["/mcp"])).toBe(false);
});
