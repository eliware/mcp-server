export function attachAuthInfo(request, auth) {
  request.raw.auth = {
    token: auth.accessToken,
    clientId: auth.clientId || "",
    scopes: auth.scopes || [],
    extra: { mcpAuth: auth },
  };
  request.mcpAuth = auth;
  request.mcpBearerToken = auth.accessToken;
}
