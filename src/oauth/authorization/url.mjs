import { assertHttpsOAuthEndpoint } from "../endpoint-security.mjs";

export function createOAuthAuthorizationUrl({
  provider,
  credentials = {},
  redirectUri,
  scopes = [],
  authorizationParams,
}) {
  const clientId = credentials.client_id || credentials.clientId;
  if (!clientId) throw new Error("OAuth client ID is required");
  assertHttpsOAuthEndpoint(provider.authorization_endpoint, "OAuth authorization endpoint");
  const url = new URL(provider.authorization_endpoint);
  url.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    state: authorizationParams.state,
    code_challenge: authorizationParams.codeChallenge,
    code_challenge_method: authorizationParams.codeChallengeMethod,
  });
  return url.toString();
}
