import { createPkceState } from "./pkce.mjs";
import { createCodeChallenge } from "./pkce-challenge.mjs";

export function createOAuthAuthorizationParams({ state, codeVerifier } = {}) {
  const generated = createPkceState();
  const verifier = codeVerifier || generated.verifier;
  return {
    state: state || generated.state,
    codeVerifier: verifier,
    codeChallenge: codeVerifier ? createCodeChallenge(verifier) : generated.challenge,
    codeChallengeMethod: "S256",
  };
}
