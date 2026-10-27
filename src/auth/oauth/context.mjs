import { sanitizeClaims } from "../claims.mjs";

export function createOAuthAuthContext({ config, info, accessToken, scopes }) {
  return {
    mode: config.mode,
    subject: info[config.subjectClaim] ?? info.sub ?? info.user_id,
    clientId: info.client_id,
    issuer: info.iss,
    resource: config.resource,
    scopes,
    claims: sanitizeClaims(info),
    accessToken,
  };
}
