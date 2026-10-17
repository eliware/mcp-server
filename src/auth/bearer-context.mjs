import { requireAuth } from "./context.mjs";

export function getAccessToken(extra = {}) {
  return (extra.mcpAuth || extra._meta?.mcpAuth)?.accessToken || null;
}

export function requireBearer(extra = {}) {
  const auth = requireAuth(extra);
  if (!auth.accessToken) throw new Error("Bearer token required");
  return auth.accessToken;
}
