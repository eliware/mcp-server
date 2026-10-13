import { createPkceState, createCodeChallenge } from "./pkce.mjs";

export function createOAuthAuthorizationFlow({ provider, credentials, fetchFn = fetch }) {
  return {
    authorizationUrl({ redirectUri, scopes = [], state, codeVerifier } = {}) {
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
    },
    async exchangeCode({ code, redirectUri, codeVerifier }) {
      const response = await fetchFn(provider.token_endpoint, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          client_id: credentials.client_id || credentials.clientId,
          code_verifier: codeVerifier,
        }),
      });
      if (!response.ok) throw new Error(`OAuth token exchange failed (${response.status})`);
      return response.json();
    },
  };
}
