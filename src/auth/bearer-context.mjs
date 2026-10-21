import { getAuthContext, requireAuth } from "./context.mjs";

export function getAccessToken(extra = {}) {
  return getAuthContext(extra)?.accessToken || null;
}

export function requireBearer(extra = {}) {
  const auth = requireAuth(extra);
  if (!auth.accessToken) throw new Error("Bearer token required");
  return auth.accessToken;
}
