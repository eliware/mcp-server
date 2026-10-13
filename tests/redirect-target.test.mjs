import { test, expect } from "@jest/globals";
import { buildHttpsRedirectTarget } from "../src/redirect-target.mjs";

test("builds an HTTPS target without a port for port 443", () => {
  expect(buildHttpsRedirectTarget({ httpsHost: "host", httpsPort: 443, requestUrl: "/mcp" })).toBe(
    "https://host/mcp",
  );
});

test("preserves IPv6 hosts and omits a string default HTTPS port", () => {
  expect(
    buildHttpsRedirectTarget({
      httpsHost: "[2001:db8::1]",
      httpsPort: "443",
      requestUrl: "/mcp",
    }),
  ).toBe("https://[2001:db8::1]/mcp");
});

test("rejects a missing or invalid redirect host", () => {
  expect(() =>
    buildHttpsRedirectTarget({ httpsHost: "bad host", httpsPort: 8443, requestUrl: "/mcp" }),
  ).toThrow("httpsHost must be a valid hostname");
  expect(() => buildHttpsRedirectTarget({ httpsPort: 8443, requestUrl: "/mcp" })).toThrow(
    "httpsHost must be a valid hostname",
  );
});

test("rejects an invalid HTTPS redirect port", () => {
  for (const httpsPort of ["8443/path", 0, 65536]) {
    expect(() =>
      buildHttpsRedirectTarget({ httpsHost: "host", httpsPort, requestUrl: "/mcp" }),
    ).toThrow("httpsPort must be an integer from 1 through 65535");
  }
});
