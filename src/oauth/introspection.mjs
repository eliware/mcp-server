import { createOAuthIntrospectionRequest } from "../auth/introspection-request.mjs";
import { assertHttpsOAuthEndpoint } from "../oauth/endpoint-security.mjs";

export function createOAuthIntrospector({
  resource,
  introspectionEndpoint,
  clientId,
  clientSecret,
  fetchFn = fetch,
} = {}) {
  if (!introspectionEndpoint) throw new Error("OAuth introspection endpoint is required");
  assertHttpsOAuthEndpoint(introspectionEndpoint, "OAuth introspection endpoint");
  return async (token) => {
    const response = await fetchFn(
      introspectionEndpoint,
      createOAuthIntrospectionRequest({ resource, clientId, clientSecret, token }),
    );
    if (!response.ok) return null;
    return response.json();
  };
}
