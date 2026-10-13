import { jest, test, expect, describe } from "@jest/globals";
import { loadTlsOptions } from "../src/tls.mjs";

describe("TLS config", () => {
  test("loads configured files and preserves direct values", () => {
    const readFile = jest.fn((file) => `loaded:${file}`);
    expect(
      loadTlsOptions({
        tls: { keyFile: "key.pem", certFile: "cert.pem", caFile: "ca.pem", key: "direct-key" },
        readFile,
      }),
    ).toEqual({ key: "direct-key", cert: "loaded:cert.pem", ca: "loaded:ca.pem" });
    expect(readFile).toHaveBeenCalledTimes(2);
  });

  test("loads environment file paths", () => {
    const readFile = jest.fn((file) => Buffer.from(file));
    expect(
      loadTlsOptions({
        env: { TLS_KEY_FILE: "k", TLS_CERT_FILE: "c", TLS_CA_FILE: "a" },
        readFile,
      }),
    ).toEqual({
      key: Buffer.from("k"),
      cert: Buffer.from("c"),
      ca: Buffer.from("a"),
    });
  });
});

test("uses empty defaults for omitted options and an empty environment", () => {
  const readFile = jest.fn();
  expect(loadTlsOptions()).toEqual({});
  expect(loadTlsOptions({ env: {}, readFile })).toEqual({});
  expect(readFile).not.toHaveBeenCalled();
});
