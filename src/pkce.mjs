import crypto from 'node:crypto';

const encode = value => Buffer.from(value).toString('base64url');

export function createPkceState({ randomBytes = crypto.randomBytes } = {}) {
  const verifier = encode(randomBytes(32));
  const state = encode(randomBytes(16));
  const challenge = encode(crypto.createHash('sha256').update(verifier).digest());
  return { verifier, state, challenge, method: 'S256' };
}

export function createPkceStore({ save, load, remove } = {}) {
  if (typeof save !== 'function' || typeof load !== 'function') throw new Error('PKCE store requires save and load functions');
  return { save, load, remove: remove || (async () => undefined) };
}

export async function consumePkceState({ store, state, expectedState } = {}) {
  if (!state || !expectedState || state !== expectedState) throw new Error('Invalid OAuth state');
  const record = await store.load(state);
  if (!record?.verifier) throw new Error('OAuth state expired or unknown');
  await store.remove(state);
  return record;
}
