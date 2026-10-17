import { createOAuthIntrospectionRequest } from "./introspection-request.mjs";

export function createOAuthIntrospector({
  resource,
  introspectionEndpoint,
  clientId,
  clientSecret,
  fetchFn = fetch,
} = {}) {
  if (!introspectionEndpoint) throw new Error("OAuth introspection endpoint is required");
  return async (token) => {
    const response = await fetchFn(
      introspectionEndpoint,
      createOAuthIntrospectionRequest({ resource, clientId, clientSecret, token }),
    );
    if (!response.ok) return null;
    return response.json();
  };
}
