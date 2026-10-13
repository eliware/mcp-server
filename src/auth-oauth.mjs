import { setOAuthChallenge } from "./oauth-metadata.mjs";
import { sanitizeClaims, validateOAuthToken } from "./auth-claims.mjs";

export async function authenticateOAuthRequest({ config, accessToken, req, res }) {
  if (!accessToken) {
    setOAuthChallenge(res, { resource: config.resource });
    res.status(401).json({ error: "Bearer token required" });
    return false;
  }
  const info = await config.introspect(accessToken);
  const token = validateOAuthToken(info, config);
  if (!token) {
    res.status(401).json({ error: "Invalid OAuth2 token" });
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
