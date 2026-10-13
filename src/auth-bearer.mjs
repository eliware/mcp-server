export function bearer(req) {
  const value = req.get("authorization") || "";
  const match = /^Bearer\s+([^\s]+)$/i.exec(value);
  return match?.[1] || null;
}
