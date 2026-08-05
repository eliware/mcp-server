import { registerOAuthClient } from './oauth.mjs';

export async function resolveOAuthClient({ client = {}, provider, store } = {}) {
  if (client.mode === 'static') {
    if (!client.clientId) throw new Error('static OAuth client requires clientId');
    return client;
  }
  if (client.mode !== 'dynamic') throw new Error('OAuth client mode must be static or dynamic');
  if (!store) throw new Error('dynamic OAuth client requires a client store');
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
