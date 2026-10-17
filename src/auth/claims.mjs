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

export function sanitizeClaims(info) {
  return Object.fromEntries(
    SAFE_CLAIMS.filter((key) => info?.[key] !== undefined).map((key) => [key, info[key]]),
  );
}
