import crypto from "node:crypto";

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

export function validStaticToken(actual, expected) {
  if (!actual || !expected) return false;
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function sanitizeClaims(info) {
  return Object.fromEntries(
    SAFE_CLAIMS.filter((key) => info?.[key] !== undefined).map((key) => [key, info[key]]),
  );
}

export function bearer(req) {
  const value = req.get("authorization") || "";
  const match = /^Bearer\s+([^\s]+)$/i.exec(value);
  return match?.[1] || null;
}
