import { jest, test, expect } from "@jest/globals";
import { createPostHandler, handleRequestFailure, requestEndpoint } from "../src/server-http.mjs";

test("server HTTP helpers handle requests and errors", async () => {
  const log = { error: jest.fn() };
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
});

test("does not send an HTTP response after headers are sent", () => {
  const log = { error: jest.fn() };
  const res = { headersSent: true, status: jest.fn(), json: jest.fn() };
  handleRequestFailure({ log, res }, { message: "failed" });
  expect(log.error).toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
});
