export async function registerOAuthClient({
  registrationEndpoint,
  metadata,
  fetchFn = fetch,
} = {}) {
  if (!registrationEndpoint) throw new Error("OAuth registration endpoint is required");
  const response = await fetchFn(registrationEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(metadata),
  });
  if (!response.ok) throw new Error(`OAuth client registration failed (${response.status})`);
  return response.json();
}
