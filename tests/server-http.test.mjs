import { jest, test, expect } from "@jest/globals";
import {
  createRedirectApp,
  createListeningHandler,
  createPostHandler,
  handleRequestFailure,
  listeningCallback,
  requestEndpoint,
  stderrLogger,
} from "../src/server-http.mjs";

test("server HTTP helpers log requests and callbacks", async () => {
  const log = { debug: jest.fn(), error: jest.fn() };
  const res = { headersSent: false, status: jest.fn(() => res), json: jest.fn() };
  handleRequestFailure({ log, res }, new Error("bad"));
  expect(res.status).toHaveBeenCalledWith(500);
  await expect(requestEndpoint({ handle: async () => "ok", log }, {}, res)).resolves.toBe("ok");
  await expect(
    requestEndpoint(
      {
        handle: async () => {
          throw Error("bad");
        },
        log,
      },
      {},
      res,
    ),
  ).resolves.toBeUndefined();
  createPostHandler({ handle: async () => "ok", log })({}, res);
  createListeningHandler({ log, port: 1234 })();
  listeningCallback({ log }, 1234);
  expect(log.debug).toHaveBeenCalled();
  expect(stderrLogger.info).toBeInstanceOf(Function);
});

test("redirect app sends HTTPS redirects", () => {
  let middleware;
  const app = {
    use: (callback) => {
      middleware = callback;
    },
  };
  createRedirectApp({ createApp: () => app, httpsPort: 443 });
  const res = { redirect: jest.fn() };
  middleware({ headers: { host: "host:80" }, originalUrl: "/mcp" }, res);
  expect(res.redirect).toHaveBeenCalledWith(301, "https://host/mcp");
});
