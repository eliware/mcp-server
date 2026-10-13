export async function exchangeOAuthCode({
  provider,
  credentials,
  fetchFn = fetch,
  code,
  redirectUri,
  codeVerifier,
}) {
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
}
