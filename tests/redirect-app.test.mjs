import { jest, test, expect } from "@jest/globals";
import { createRedirectApp } from "../src/redirect-app.mjs";

test("redirects requests to the configured HTTPS host on port 443", () => {
  let middleware;
  const app = { use: jest.fn((callback) => (middleware = callback)) };
  const createApp = jest.fn(() => app);
  expect(createRedirectApp({ createApp, httpsHost: "trusted.example", httpsPort: 443 })).toBe(app);
  const res = { redirect: jest.fn() };
  middleware({ headers: { host: "attacker.example" }, originalUrl: "/mcp" }, res);
  expect(res.redirect).toHaveBeenCalledWith(301, "https://trusted.example/mcp");
});

test("uses the configured host and port when the request has no host", () => {
  let middleware;
  const app = { use: jest.fn((callback) => (middleware = callback)) };
  createRedirectApp({ createApp: () => app, httpsHost: "trusted.example", httpsPort: 8443 });
  const res = { redirect: jest.fn() };
  middleware({ headers: {}, url: "/status" }, res);
  expect(res.redirect).toHaveBeenCalledWith(301, "https://trusted.example:8443/status");
});
