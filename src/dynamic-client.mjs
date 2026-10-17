import { registerOAuthClient } from "./oauth/registration.mjs";

export async function resolveDynamicOAuthClient({ client, provider, store }) {
  const endpoint = provider.registration_endpoint;
  if (typeof endpoint !== "string" || !endpoint.trim()) {
    throw new Error("OAuth registration endpoint is required");
  }
  const key = client.registrationKey || provider.registration_endpoint;
  const saved = await store.load(key);
  if (saved) return saved;
  const registered = await registerOAuthClient({
    registrationEndpoint: endpoint,
    metadata: client.metadata || {},
  });
  await store.save(key, registered);
  return registered;
}
