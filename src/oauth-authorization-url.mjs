export function createOAuthAuthorizationUrl({
  provider,
  credentials,
  redirectUri,
  scopes = [],
  authorizationParams,
}) {
  const url = new URL(provider.authorization_endpoint);
  url.search = new URLSearchParams({
    client_id: credentials.client_id || credentials.clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    state: authorizationParams.state,
    code_challenge: authorizationParams.codeChallenge,
    code_challenge_method: authorizationParams.codeChallengeMethod,
  });
  return url.toString();
}
