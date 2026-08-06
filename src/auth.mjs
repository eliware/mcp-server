import crypto from 'node:crypto';
import { setOAuthChallenge } from './oauth.mjs';

const MODES = new Set(['none', 'static', 'bearer-passthrough', 'oauth2']);

export function normalizeAuth(auth = { mode: 'none' }) {
  const config = typeof auth === 'string' ? { mode: auth } : (auth || {});
  const mode = config.mode || 'none';
  if (!MODES.has(mode)) throw new Error(`Unsupported auth mode: ${mode}`);
  if (mode === 'static' && !config.token) throw new Error('static auth requires auth.token');
  if (mode === 'oauth2' && (!config.issuer || !config.resource || typeof config.introspect !== 'function')) {
    throw new Error('oauth2 auth requires issuer, resource, and introspect(token)');
  }
  if (mode !== 'oauth2') return { ...config, mode };
  const requiredScopes = config.requiredScopes ?? config.scopes ?? [];
  if (!Array.isArray(requiredScopes) || requiredScopes.some(scope => typeof scope !== 'string' || !scope.trim())) {
    throw new Error('oauth2 auth requiredScopes must be an array of non-empty strings');
  }
  const subjectClaim = config.subjectClaim || 'sub';
  if (typeof subjectClaim !== 'string' || !subjectClaim.trim()) {
    throw new Error('oauth2 auth subjectClaim must be a non-empty string');
  }
  return { ...config, mode, requiredScopes: [...requiredScopes], subjectClaim };
}

function matchesResource(info, resource) {
  if (info?.resource === resource) return true;
  return Array.isArray(info?.aud) ? info.aud.includes(resource) : info?.aud === resource;
}

function validStaticToken(actual, expected) {
  if (!actual || !expected) return false;
  const a = Buffer.from(actual); const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const SAFE_CLAIMS = ['active', 'iss', 'resource', 'aud', 'exp', 'token_type', 'sub', 'user_id', 'client_id', 'scope'];

function sanitizeClaims(info) {
  return Object.fromEntries(SAFE_CLAIMS.filter(key => info?.[key] !== undefined).map(key => [key, info[key]]));
}

function bearer(req) {
  const value = req.get('authorization') || '';
  const match = /^Bearer\s+([^\s]+)$/i.exec(value);
  return match?.[1] || null;
}

export function createAuthMiddleware({ auth = { mode: 'none' }, endpointPaths }) {
  const config = normalizeAuth(auth);
  return async (req, res, next) => {
    if (req.method !== 'POST' || !endpointPaths.includes(req.path)) return next();
    try {
      const accessToken = bearer(req);
      if (config.mode === 'static' && !validStaticToken(accessToken, config.token)) {
        return res.status(401).json({ error: 'Invalid bearer token' });
      }
      if (config.mode === 'bearer-passthrough' && !accessToken) {
        return res.status(401).json({ error: 'Bearer token required' });
      }
      if (config.mode === 'oauth2') {
        if (!accessToken) { setOAuthChallenge(res, { resource: config.resource }); return res.status(401).json({ error: 'Bearer token required' }); }
        const info = await config.introspect(accessToken);
        const scopes = String(info?.scope || '').split(/\s+/).filter(Boolean);
        const valid = info?.active && info.iss === config.issuer && matchesResource(info, config.resource) && (!info.exp || Number(info.exp) > Math.floor(Date.now() / 1000)) && (!info.token_type || String(info.token_type).toLowerCase() === 'bearer') && config.requiredScopes.every(scope => scopes.includes(scope));
        if (!valid) return res.status(401).json({ error: 'Invalid OAuth2 token' });
        req.mcpAuth = { mode: config.mode, subject: info[config.subjectClaim] || info.sub || info.user_id, clientId: info.client_id, issuer: info.iss, resource: config.resource, scopes, claims: sanitizeClaims(info), accessToken };
      } else {
        req.mcpAuth = { mode: config.mode, ...(accessToken ? { accessToken } : {}) };
      }
      req.mcpBearerToken = accessToken;
      next();
    } catch (err) {
      return res.status(500).json({ error: 'Authentication failed', details: String(err) });
    }
  };
}

export function requireAuth(extra = {}) {
  const auth = extra.mcpAuth || extra._meta?.mcpAuth;
  if (!auth || auth.mode === 'none') throw new Error('Authentication required');
  return auth;
}

export function hasScope(extra = {}, scope) {
  return Boolean(extra.mcpAuth?.scopes?.includes(scope) || extra._meta?.mcpAuth?.scopes?.includes(scope));
}

export function requireScope(extra = {}, scope) {
  if (!hasScope(extra, scope)) { const error = new Error(`Missing scope: ${scope}`); error.status = 403; error.scope = scope; throw error; }
}

export function getUser(extra = {}) {
  const auth = extra.mcpAuth || extra._meta?.mcpAuth;
  return auth && auth.mode !== 'none' ? { subject: auth.subject, clientId: auth.clientId, issuer: auth.issuer, scopes: auth.scopes || [] } : null;
}

export function getAccessToken(extra = {}) {
  return (extra.mcpAuth || extra._meta?.mcpAuth)?.accessToken || null;
}

export function requireBearer(extra = {}) {
  const auth = requireAuth(extra);
  if (!auth.accessToken) throw new Error('Bearer token required');
  return auth.accessToken;
}


export function createOAuthIntrospector({ resource, introspectionEndpoint, clientId, clientSecret, fetchFn = fetch } = {}) {
  return async token => {
    const headers = { 'content-type': 'application/x-www-form-urlencoded' };
    if (clientId && clientSecret) headers.authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
    if (!introspectionEndpoint) throw new Error('OAuth introspection endpoint is required');
    const response = await fetchFn(introspectionEndpoint, { method: 'POST', headers, body: new URLSearchParams({ token, resource }) });
    if (!response.ok) return null;
    return response.json();
  };
}
