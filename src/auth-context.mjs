import { sanitizeClaims } from "./auth-claims.mjs";

export function requireAuth(extra = {}) {
  const auth = extra.mcpAuth || extra._meta?.mcpAuth;
  if (!auth || auth.mode === "none") throw new Error("Authentication required");
  return auth;
}

export function createOAuthAuthContext({ config, info, accessToken, scopes }) {
  return {
    mode: config.mode,
    subject: info[config.subjectClaim] || info.sub || info.user_id,
    clientId: info.client_id,
    issuer: info.iss,
    resource: config.resource,
    scopes,
    claims: sanitizeClaims(info),
    accessToken,
  };
}

export function getUser(extra = {}) {
  const auth = extra.mcpAuth || extra._meta?.mcpAuth;
  return auth && auth.mode !== "none"
    ? {
        subject: auth.subject,
        clientId: auth.clientId,
        issuer: auth.issuer,
        scopes: auth.scopes || [],
      }
    : null;
}
