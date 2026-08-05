export async function discoverOAuthProvider({ issuer, fetchFn = fetch } = {}) {
  if (!issuer) throw new Error('OAuth issuer is required');
  const base = issuer.replace(/\/$/, '');
  const response = await fetchFn(`${base}/.well-known/openid-configuration`);
  if (!response.ok) throw new Error(`OAuth discovery failed (${response.status})`);
  return response.json();
}

export async function registerOAuthClient({ registrationEndpoint, metadata, fetchFn = fetch } = {}) {
  if (!registrationEndpoint) throw new Error('OAuth registration endpoint is required');
  const response = await fetchFn(registrationEndpoint, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(metadata),
  });
  if (!response.ok) throw new Error(`OAuth client registration failed (${response.status})`);
  return response.json();
}

export function createClientStore({ load, save, remove } = {}) {
  if (typeof load !== 'function' || typeof save !== 'function') throw new Error('OAuth client store requires load and save functions');
  return { load, save, remove: remove || (async () => undefined) };
}


export function setOAuthChallenge(res, { resource, scope } = {}) {
  const metadata = `${String(resource || '').replace(/\/$/, '')}/.well-known/oauth-protected-resource/mcp`;
  const parts = ['Bearer realm="mcp"'];
  if (metadata !== '/.well-known/oauth-protected-resource/mcp') parts.push(`resource_metadata="${metadata}"`);
  if (scope) parts.push(`scope="${scope}"`);
  res.set('WWW-Authenticate', parts.join(', '));
}

export function mountOAuthResourceMetadata(app, { resource, issuer, scopes = [] } = {}) {
  if (!resource || !issuer) return;
  const metadata = { resource, authorization_servers: [issuer], scopes_supported: scopes };
  app.get('/.well-known/oauth-protected-resource', (_req, res) => res.json(metadata));
  app.get('/.well-known/oauth-protected-resource/mcp', (_req, res) => res.json(metadata));
}
