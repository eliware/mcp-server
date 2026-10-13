import { jest, test, expect } from "@jest/globals";
import { handleJsonError } from "../src/http-error.mjs";

test("maps malformed JSON errors to an invalid JSON response", () => {
  const res = { status: jest.fn(() => res), json: jest.fn() };
  const err = Object.assign(new SyntaxError("bad JSON"), { status: 400, body: "{" });
  handleJsonError(err, {}, res, jest.fn());
  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({ error: "Invalid JSON" });
});

test("passes unrelated errors to the next handler", () => {
  const next = jest.fn();
  const err = new Error("boom");
  handleJsonError(err, {}, {}, next);
  expect(next).toHaveBeenCalledWith(err);
});
