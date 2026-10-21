import { assertHttpsOAuthEndpoint } from "./endpoint-security.mjs";

export async function exchangeOAuthCode({
  provider,
  credentials = {},
  fetchFn = fetch,
  code,
  redirectUri,
  codeVerifier,
}) {
  const clientId = credentials.client_id || credentials.clientId;
  if (!clientId) throw new Error("OAuth client ID is required");
  assertHttpsOAuthEndpoint(provider.token_endpoint, "OAuth token endpoint");
  const clientSecret = credentials.client_secret || credentials.clientSecret;
  const headers = { "content-type": "application/x-www-form-urlencoded" };
  if (clientId && clientSecret) {
    headers.authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
  }
  const response = await fetchFn(provider.token_endpoint, {
    method: "POST",
    redirect: "error",
    headers,
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      ...(!clientSecret ? { client_id: clientId } : {}),
      code_verifier: codeVerifier,
    }),
  });
  if (!response.ok) throw new Error(`OAuth token request failed (${response.status})`);
  return response.json();
}
