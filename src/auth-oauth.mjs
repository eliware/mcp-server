import { createOAuthAuthContext } from "./auth-oauth-context.mjs";
import { validateOAuthToken } from "./auth-token-validation.mjs";
import { sendOAuthAuthError } from "./auth-oauth-response.mjs";

export async function authenticateOAuthRequest({ config, accessToken, req, res }) {
  if (!accessToken) {
    sendOAuthAuthError(res, { error: "Bearer token required", resource: config.resource });
    return false;
  }
  let info;
  try {
    info = await config.introspect(accessToken);
  } catch {
    res.status(503).json({ error: "Authentication service unavailable" });
    return false;
  }
  const token = validateOAuthToken(info, config);
  if (!token) {
    sendOAuthAuthError(res, { error: "Invalid OAuth2 token", resource: config.resource });
    return false;
  }
  req.mcpAuth = createOAuthAuthContext({ config, info, accessToken, scopes: token.scopes });
  return true;
}
