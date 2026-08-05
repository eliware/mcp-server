import crypto from 'node:crypto';
import { discoverOAuthProvider } from './oauth.mjs';
import { resolveOAuthClient } from './client.mjs';

const base64url = value => Buffer.from(value).toString('base64url');

export async function createOAuthClient({ issuer, client, store, fetchFn = fetch } = {}) {
  const provider = await discoverOAuthProvider({ issuer, fetchFn });
  const credentials = await resolveOAuthClient({ client, provider, store });
  return {
    provider,
    credentials,
    authorizationUrl({ redirectUri, scopes = [], state, codeVerifier = base64url(crypto.randomBytes(32)) } = {}) {
      const challenge = base64url(crypto.createHash('sha256').update(codeVerifier).digest());
      const url = new URL(provider.authorization_endpoint);
      url.search = new URLSearchParams({ client_id: credentials.client_id || credentials.clientId, response_type: 'code', redirect_uri: redirectUri, scope: scopes.join(' '), state: state || base64url(crypto.randomBytes(16)), code_challenge: challenge, code_challenge_method: 'S256' });
      return { url: url.toString(), codeVerifier };
    },
    async exchangeCode({ code, redirectUri, codeVerifier }) {
      const response = await fetchFn(provider.token_endpoint, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri, client_id: credentials.client_id || credentials.clientId, code_verifier: codeVerifier }) });
      if (!response.ok) throw new Error(`OAuth token exchange failed (${response.status})`);
      return response.json();
    },
  };
}
