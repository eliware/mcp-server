import crypto from "node:crypto";

const encode = (value) => Buffer.from(value).toString("base64url");

export function createCodeChallenge(verifier) {
  if (
    typeof verifier !== "string" ||
    verifier.length < 43 ||
    verifier.length > 128 ||
    !/^[A-Za-z0-9._~-]+$/.test(verifier)
  ) {
    throw new Error("OAuth code verifier must contain 43 to 128 unreserved characters");
  }
  return encode(crypto.createHash("sha256").update(verifier).digest());
}
