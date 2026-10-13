import { createOAuthAuthorizationParams } from "./oauth-authorization-params.mjs";

export function createOAuthAuthorizationUrl({
  provider,
  credentials,
  redirectUri,
  scopes = [],
  state,
  codeVerifier,
}) {
  const authParams = createOAuthAuthorizationParams({ state, codeVerifier });
  const url = new URL(provider.authorization_endpoint);
  url.search = new URLSearchParams({
    client_id: credentials.client_id || credentials.clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    state: authParams.state,
    code_challenge: authParams.codeChallenge,
    code_challenge_method: authParams.codeChallengeMethod,
  });
  return { url: url.toString(), codeVerifier: authParams.codeVerifier };
}
