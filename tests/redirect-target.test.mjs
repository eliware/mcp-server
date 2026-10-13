import { test, expect } from "@jest/globals";
import { buildHttpsRedirectTarget } from "../src/redirect-target.mjs";

test("builds an HTTPS target without a port for port 443", () => {
  expect(buildHttpsRedirectTarget({ host: "host:80", httpsPort: 443, requestUrl: "/mcp" })).toBe(
    "https://host/mcp",
  );
});

test("uses localhost and the configured HTTPS port when host is absent", () => {
  expect(buildHttpsRedirectTarget({ httpsPort: 8443, requestUrl: "/status" })).toBe(
    "https://localhost:8443/status",
  );
});

test("preserves IPv6 hosts and omits a string default HTTPS port", () => {
  expect(
    buildHttpsRedirectTarget({
      host: "[2001:db8::1]:80",
      httpsPort: "443",
      requestUrl: "/mcp",
    }),
  ).toBe("https://[2001:db8::1]/mcp");
});

test("uses localhost when the Host header is invalid", () => {
  expect(buildHttpsRedirectTarget({ host: "bad host", httpsPort: 8443, requestUrl: "/mcp" })).toBe(
    "https://localhost:8443/mcp",
  );
});
