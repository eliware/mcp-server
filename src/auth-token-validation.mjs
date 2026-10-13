export function matchesResource(info, resource) {
  if (info?.resource === resource) return true;
  return Array.isArray(info?.aud) ? info.aud.includes(resource) : info?.aud === resource;
}

export function validateOAuthToken(info, { issuer, resource, requiredScopes, now = Date.now() }) {
  const scopes = String(info?.scope || "")
    .split(/\s+/)
    .filter(Boolean);
  const valid =
    info?.active &&
    info.iss === issuer &&
    matchesResource(info, resource) &&
    (!info.exp || Number(info.exp) > Math.floor(now / 1000)) &&
    (!info.token_type || String(info.token_type).toLowerCase() === "bearer") &&
    requiredScopes.every((scope) => scopes.includes(scope));
  return valid ? { scopes } : null;
}
