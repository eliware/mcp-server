export function createOAuthIntrospector({
  resource,
  introspectionEndpoint,
  clientId,
  clientSecret,
  fetchFn = fetch,
} = {}) {
  if (!introspectionEndpoint) throw new Error("OAuth introspection endpoint is required");
  return async (token) => {
    const headers = { "content-type": "application/x-www-form-urlencoded" };
    if (clientId && clientSecret)
      headers.authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
    const response = await fetchFn(introspectionEndpoint, {
      method: "POST",
      headers,
      body: new URLSearchParams({ token, resource }),
    });
    if (!response.ok) return null;
    return response.json();
  };
}
