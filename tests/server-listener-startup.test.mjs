import { jest, test, expect } from "@jest/globals";
import { waitForListener } from "../src/server-listener-startup.mjs";

test("logs listener errors after startup", async () => {
  const error = new Error("runtime");
  const instance = {
    on: jest.fn((_event, handler) => {
      instance.onError = handler;
    }),
    removeListener: jest.fn(),
    listen: jest.fn((_port, callback) => callback()),
  };
  const onRuntimeError = jest.fn();
  await waitForListener(instance, 1234, jest.fn(), onRuntimeError).promise;
  instance.onError(error);
  expect(onRuntimeError).toHaveBeenCalledWith(error);
});
