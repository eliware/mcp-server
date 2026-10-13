import { jest, test, expect } from "@jest/globals";
import {
  createListeningHandler,
  createPostHandler,
  handleRequestFailure,
  listeningCallback,
  requestEndpoint,
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
});

test("does not send an HTTP response after headers are sent", () => {
  const log = { error: jest.fn() };
  const res = { headersSent: true, status: jest.fn(), json: jest.fn() };
  handleRequestFailure({ log, res }, { message: "failed" });
  expect(log.error).toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
});
