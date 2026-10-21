import { assertHttpsOAuthEndpoint } from "./endpoint-security.mjs";

export async function discoverOAuthProvider({ issuer, fetchFn = fetch } = {}) {
  if (!issuer) throw new Error("OAuth issuer is required");
  assertHttpsOAuthEndpoint(issuer, "OAuth issuer");
  const base = issuer.replace(/\/$/, "");
  const response = await fetchFn(`${base}/.well-known/openid-configuration`, {
    redirect: "error",
  });
  if (!response.ok) throw new Error(`OAuth discovery failed (${response.status})`);
  return response.json();
}
