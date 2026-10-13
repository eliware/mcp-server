import crypto from "node:crypto";

const encode = (value) => Buffer.from(value).toString("base64url");

export function createCodeChallenge(verifier) {
  return encode(crypto.createHash("sha256").update(verifier).digest());
}
