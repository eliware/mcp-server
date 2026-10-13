import { sanitizeClaims } from "./auth-claims.mjs";
import { validateOAuthToken } from "./auth-token-validation.mjs";
import { sendOAuthAuthError } from "./auth-oauth-response.mjs";

export async function authenticateOAuthRequest({ config, accessToken, req, res }) {
  if (!accessToken) {
    sendOAuthAuthError(res, { error: "Bearer token required", resource: config.resource });
    return false;
  }
  const info = await config.introspect(accessToken);
  const token = validateOAuthToken(info, config);
  if (!token) {
    sendOAuthAuthError(res, { error: "Invalid OAuth2 token" });
    return false;
  }
  req.mcpAuth = {
    mode: config.mode,
    subject: info[config.subjectClaim] || info.sub || info.user_id,
    clientId: info.client_id,
    issuer: info.iss,
    resource: config.resource,
    scopes: token.scopes,
    claims: sanitizeClaims(info),
    accessToken,
  };
  return true;
}
