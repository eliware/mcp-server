export function requireAuth(extra = {}) {
  const auth = extra.mcpAuth || extra._meta?.mcpAuth;
  if (!auth || auth.mode === "none") throw new Error("Authentication required");
  return auth;
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
