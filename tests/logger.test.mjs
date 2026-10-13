import { jest, test, expect } from "@jest/globals";
import { stderrLogger } from "../src/logger.mjs";

test("writes every default logger level to stderr", () => {
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  try {
    for (const level of ["debug", "info", "warn", "error"]) stderrLogger[level]("message");
    expect(spy).toHaveBeenCalledTimes(4);
  } finally {
    spy.mockRestore();
  }
});
