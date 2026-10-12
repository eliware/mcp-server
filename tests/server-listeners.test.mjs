import { jest, test, expect } from "@jest/globals";
import { startListeners } from "../src/server-listeners.mjs";

test("listener module starts the HTTP listener", () => {
  const instance = { listen: jest.fn() };
  const createHttpServer = jest.fn(() => instance);
  const result = startListeners({
    config: {
      httpPort: 1234,
      httpsPort: undefined,
      httpRedirect: false,
      createHttpServer,
      createHttpsServer: jest.fn(),
      createApp: jest.fn(),
    },
    app: {},
    activeLog: { debug: jest.fn() },
  });
  expect(result.httpInstance).toBe(instance);
  expect(instance.listen).toHaveBeenCalledWith(1234, expect.any(Function));
});
