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
