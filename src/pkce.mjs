import crypto from "node:crypto";
import { createCodeChallenge } from "./pkce-challenge.mjs";

const encode = (value) => Buffer.from(value).toString("base64url");

export function createPkceState({ randomBytes = crypto.randomBytes } = {}) {
  const verifier = encode(randomBytes(32));
  const state = encode(randomBytes(16));
  const challenge = createCodeChallenge(verifier);
  return { verifier, state, challenge, method: "S256" };
}
