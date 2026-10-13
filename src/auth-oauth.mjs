import { setOAuthChallenge } from "./oauth-metadata.mjs";
import { matchesResource, sanitizeClaims } from "./auth-claims.mjs";

export async function authenticateOAuthRequest({ config, accessToken, req, res }) {
  if (!accessToken) {
    setOAuthChallenge(res, { resource: config.resource });
    res.status(401).json({ error: "Bearer token required" });
    return false;
  }
  const info = await config.introspect(accessToken);
  const scopes = String(info?.scope || "")
    .split(/\s+/)
    .filter(Boolean);
  const valid =
    info?.active &&
    info.iss === config.issuer &&
    matchesResource(info, config.resource) &&
    (!info.exp || Number(info.exp) > Math.floor(Date.now() / 1000)) &&
    (!info.token_type || String(info.token_type).toLowerCase() === "bearer") &&
    config.requiredScopes.every((scope) => scopes.includes(scope));
  if (!valid) {
    res.status(401).json({ error: "Invalid OAuth2 token" });
    return false;
  }
  req.mcpAuth = {
    mode: config.mode,
    subject: info[config.subjectClaim] || info.sub || info.user_id,
    clientId: info.client_id,
    issuer: info.iss,
    resource: config.resource,
    scopes,
    claims: sanitizeClaims(info),
    accessToken,
  };
  return true;
}
