export function getAuthContext(extra = {}) {
  return extra.mcpAuth || extra._meta?.mcpAuth || extra.mcpReq?._meta?.mcpAuth;
}

export function requireAuth(extra = {}) {
  const auth = getAuthContext(extra);
  if (!auth || auth.mode === "none") throw new Error("Authentication required");
  return auth;
}

export function getUser(extra = {}) {
  const auth = getAuthContext(extra);
  return auth && auth.mode !== "none"
    ? {
        subject: auth.subject,
        clientId: auth.clientId,
        issuer: auth.issuer,
        scopes: auth.scopes || [],
      }
    : null;
}
