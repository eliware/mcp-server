import { test, expect } from "@jest/globals";
import { buildHttpsRedirectTarget } from "../../src/redirect/target.mjs";

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

test("uses an explicit port from the public host", () => {
  expect(
    buildHttpsRedirectTarget({
      httpsHost: "trusted.example:8443",
      httpsPort: 443,
      requestUrl: "/mcp",
    }),
  ).toBe("https://trusted.example:8443/mcp");
});

test("keeps brackets around IPv6 hosts with an explicit port", () => {
  expect(
    buildHttpsRedirectTarget({
      httpsHost: "[2001:db8::1]:8443",
      httpsPort: 443,
      requestUrl: "/mcp",
    }),
  ).toBe("https://[2001:db8::1]:8443/mcp");
});

test.each(["user@trusted.example", "trusted.example/path", "trusted.example?x=1"])(
  "rejects redirect hosts with extra URL data: %s",
  (httpsHost) => {
    expect(() =>
      buildHttpsRedirectTarget({ httpsHost, httpsPort: 443, requestUrl: "/mcp" }),
    ).toThrow("httpsHost must be a valid hostname");
  },
);

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

test.each([
  ["https://attacker.example/path", "requestUrl must be an origin-relative path"],
  ["//attacker.example/path", "requestUrl must be an origin-relative path"],
  ["relative/path", "requestUrl must be an origin-relative path"],
  ["/\\attacker.example/path", "requestUrl must stay on the configured host"],
])("rejects an unsafe request target: %s", (requestUrl, message) => {
  expect(() =>
    buildHttpsRedirectTarget({ httpsHost: "trusted.example", httpsPort: 443, requestUrl }),
  ).toThrow(message);
});
