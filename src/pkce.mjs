import crypto from "node:crypto";

const encode = (value) => Buffer.from(value).toString("base64url");

export function createCodeChallenge(verifier) {
  return encode(crypto.createHash("sha256").update(verifier).digest());
}

export function createPkceState({ randomBytes = crypto.randomBytes } = {}) {
  const verifier = encode(randomBytes(32));
  const state = encode(randomBytes(16));
  const challenge = createCodeChallenge(verifier);
  return { verifier, state, challenge, method: "S256" };
}
