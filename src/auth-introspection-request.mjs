export function createOAuthIntrospectionRequest({ resource, clientId, clientSecret, token }) {
  const headers = { "content-type": "application/x-www-form-urlencoded" };
  if (clientId && clientSecret) {
    headers.authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
  }
  return {
    method: "POST",
    headers,
    body: new URLSearchParams({ token, resource }),
  };
}
