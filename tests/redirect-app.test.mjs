import { jest, test, expect } from "@jest/globals";
import { createRedirectApp } from "../src/redirect-app.mjs";

test("redirects requests to HTTPS on port 443", () => {
  let middleware;
  const app = { use: jest.fn((callback) => (middleware = callback)) };
  const createApp = jest.fn(() => app);
  expect(createRedirectApp({ createApp, httpsPort: 443 })).toBe(app);
  const res = { redirect: jest.fn() };
  middleware({ headers: { host: "host:80" }, originalUrl: "/mcp" }, res);
  expect(res.redirect).toHaveBeenCalledWith(301, "https://host/mcp");
});

test("uses the configured port and localhost when the request has no host", () => {
  let middleware;
  const app = { use: jest.fn((callback) => (middleware = callback)) };
  createRedirectApp({ createApp: () => app, httpsPort: 8443 });
  const res = { redirect: jest.fn() };
  middleware({ headers: {}, url: "/status" }, res);
  expect(res.redirect).toHaveBeenCalledWith(301, "https://localhost:8443/status");
});
