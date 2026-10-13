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
