import crypto from "node:crypto";

export function validStaticToken(actual, expected) {
  if (!actual || !expected) return false;
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function bearer(req) {
  const value = req.get("authorization") || "";
  const match = /^Bearer\s+([^\s]+)$/i.exec(value);
  return match?.[1] || null;
}
