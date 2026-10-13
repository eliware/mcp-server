import { createPkceState } from "./pkce.mjs";
import { createCodeChallenge } from "./pkce-challenge.mjs";

export function createOAuthAuthorizationParams({ state, codeVerifier } = {}) {
  if (state !== undefined && (typeof state !== "string" || !state)) {
    throw new Error("OAuth state must be a non-empty string");
  }
  const generated = createPkceState();
  const verifier = codeVerifier === undefined ? generated.verifier : codeVerifier;
  return {
    state: state === undefined ? generated.state : state,
    codeVerifier: verifier,
    codeChallenge: codeVerifier === undefined ? generated.challenge : createCodeChallenge(verifier),
    codeChallengeMethod: "S256",
  };
}
