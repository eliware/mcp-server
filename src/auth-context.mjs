export function requireAuth(extra = {}) {
  const auth = extra.mcpAuth || extra._meta?.mcpAuth;
  if (!auth || auth.mode === "none") throw new Error("Authentication required");
  return auth;
}

export function hasScope(extra = {}, scope) {
  return Boolean(
    extra.mcpAuth?.scopes?.includes(scope) || extra._meta?.mcpAuth?.scopes?.includes(scope),
  );
}

export function requireScope(extra = {}, scope) {
  if (!hasScope(extra, scope)) {
    const error = new Error(`Missing scope: ${scope}`);
    error.status = 403;
    error.scope = scope;
    throw error;
  }
}

export function getUser(extra = {}) {
  const auth = extra.mcpAuth || extra._meta?.mcpAuth;
  return auth && auth.mode !== "none"
    ? {
        subject: auth.subject,
        clientId: auth.clientId,
        issuer: auth.issuer,
        scopes: auth.scopes || [],
      }
    : null;
}

export function getAccessToken(extra = {}) {
  return (extra.mcpAuth || extra._meta?.mcpAuth)?.accessToken || null;
}

export function requireBearer(extra = {}) {
  const auth = requireAuth(extra);
  if (!auth.accessToken) throw new Error("Bearer token required");
  return auth.accessToken;
}
