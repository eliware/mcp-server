export async function discoverOAuthProvider({ issuer, fetchFn = fetch } = {}) {
  if (!issuer) throw new Error("OAuth issuer is required");
  const base = issuer.replace(/\/$/, "");
  const response = await fetchFn(`${base}/.well-known/openid-configuration`);
  if (!response.ok) throw new Error(`OAuth discovery failed (${response.status})`);
  return response.json();
}
