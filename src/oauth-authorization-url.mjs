import { createPkceState } from "./pkce.mjs";
import { createCodeChallenge } from "./pkce-challenge.mjs";

export function createOAuthAuthorizationUrl({
  provider,
  credentials,
  redirectUri,
  scopes = [],
  state,
  codeVerifier,
}) {
  const generated = createPkceState();
  const verifier = codeVerifier || generated.verifier;
  const challenge = codeVerifier ? createCodeChallenge(verifier) : generated.challenge;
  const url = new URL(provider.authorization_endpoint);
  url.search = new URLSearchParams({
    client_id: credentials.client_id || credentials.clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    state: state || generated.state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  return { url: url.toString(), codeVerifier: verifier };
}
