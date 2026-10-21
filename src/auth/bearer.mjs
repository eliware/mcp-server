export function bearer(req) {
  return parseBearerToken(req.get("authorization"));
}

export function parseBearerToken(authorization) {
  const match = /^Bearer\s+([^\s]+)$/i.exec(authorization || "");
  return match?.[1] || null;
}
