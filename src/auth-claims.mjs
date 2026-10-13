const SAFE_CLAIMS = [
  "active",
  "iss",
  "resource",
  "aud",
  "exp",
  "token_type",
  "sub",
  "user_id",
  "client_id",
  "scope",
];

export function matchesResource(info, resource) {
  if (info?.resource === resource) return true;
  return Array.isArray(info?.aud) ? info.aud.includes(resource) : info?.aud === resource;
}

export function sanitizeClaims(info) {
  return Object.fromEntries(
    SAFE_CLAIMS.filter((key) => info?.[key] !== undefined).map((key) => [key, info[key]]),
  );
}
