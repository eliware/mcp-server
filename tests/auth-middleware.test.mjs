import { jest, test, expect } from "@jest/globals";
import { createAuthMiddleware } from "../src/auth-middleware.mjs";

test("bypasses requests outside configured POST paths", async () => {
  const next = jest.fn();
  const middleware = createAuthMiddleware({ auth: "none", endpointPaths: ["/mcp"] });
  await middleware({ method: "GET", path: "/mcp" }, {}, next);
  await middleware({ method: "POST", path: "/other" }, {}, next);
  expect(next).toHaveBeenCalledTimes(2);
});

test("returns an error when middleware cannot read the request token", async () => {
  const middleware = createAuthMiddleware({ auth: "none", endpointPaths: ["/mcp"] });
  const res = { status: jest.fn(() => res), json: jest.fn() };
  await middleware(
    {
      method: "POST",
      path: "/mcp",
      get: () => {
        throw new Error("request error");
      },
    },
    res,
    jest.fn(),
  );
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: "Authentication failed" }),
  );
});
