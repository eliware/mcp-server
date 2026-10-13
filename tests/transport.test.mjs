import { test, expect } from "@jest/globals";
import { createTransport } from "../src/transport.mjs";

test.each([
  ["stateless", true, true, undefined],
  ["stateful", false, false, undefined],
])(
  "creates %s transport with configured options",
  (_mode, stateless, enableJsonResponse, sessionIdGenerator) => {
    const transport = createTransport({ stateless, enableJsonResponse });
    expect(transport._webStandardTransport.sessionIdGenerator).toBe(sessionIdGenerator);
    expect(transport._webStandardTransport._enableJsonResponse).toBe(enableJsonResponse);
  },
);
