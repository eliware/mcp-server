import { registerOAuthClient } from "./oauth-registration.mjs";

export async function resolveDynamicOAuthClient({ client, provider, store }) {
  const key = client.registrationKey || provider.registration_endpoint;
  const saved = await store.load(key);
  if (saved) return saved;
  const registered = await registerOAuthClient({
    registrationEndpoint: provider.registration_endpoint,
    metadata: client.metadata || {},
  });
  await store.save(key, registered);
  return registered;
}
