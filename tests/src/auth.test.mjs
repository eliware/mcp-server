import express from 'express'; import request from 'supertest';
import { createAuthMiddleware, normalizeAuth, requireAuth, requireBearer } from '../../src/auth.mjs';
import { test, expect, jest } from '@jest/globals';
async function appFor(auth) { const app=express(); app.use(createAuthMiddleware({ auth, endpointPaths:['/mcp'] })); app.post('/mcp',(req,res)=>res.json({auth:req.mcpAuth})); return app; }
test('none mode allows requests',async()=>expect((await request(await appFor({mode:'none'})).post('/mcp')).body.auth.mode).toBe('none'));
test('static mode validates token',async()=>{expect((await request(await appFor({mode:'static',token:'x'})).post('/mcp').set('Authorization','Bearer x')).status).toBe(200); expect((await request(await appFor({mode:'static',token:'x'})).post('/mcp')).status).toBe(401)});
test('passthrough exposes bearer',async()=>expect((await request(await appFor({mode:'bearer-passthrough'})).post('/mcp').set('Authorization','Bearer x')).body.auth.accessToken).toBe('x'));
test('passthrough rejects missing bearer',async()=>expect((await request(await appFor({mode:'bearer-passthrough'})).post('/mcp')).status).toBe(401));
test('normalizes and rejects invalid configs',()=>{expect(normalizeAuth()).toEqual({mode:'none'}); expect(normalizeAuth('none')).toEqual({mode:'none'}); expect(()=>normalizeAuth({mode:'bad'})).toThrow(); expect(()=>normalizeAuth({mode:'static'})).toThrow();});
test('auth helpers expose request credentials',()=>{const extra={mcpAuth:{mode:'bearer-passthrough',accessToken:'x'}}; expect(requireAuth(extra)).toEqual(extra.mcpAuth); expect(requireBearer(extra)).toBe('x'); expect(()=>requireAuth({mcpAuth:{mode:'none'}})).toThrow(); expect(()=>requireBearer({mcpAuth:{mode:'static'}})).toThrow();});
test('handles authentication middleware failures',async()=>{const middleware=createAuthMiddleware({auth:{mode:'static',token:'x'},endpointPaths:['/mcp']}); const res={status:()=>res,json:jest.fn()}; const next=jest.fn(); await middleware({method:'POST',path:'/mcp',get:()=>{throw new Error('boom')}},res,next); expect(res.json).toHaveBeenCalledWith(expect.objectContaining({error:'Authentication failed'}));});
test('oauth2 validates introspection and injects identity',async()=>{const info={active:true,iss:'https://auth',resource:'https://app/mcp',sub:'user-1',client_id:'client',scope:'read write',exp:Math.floor(Date.now()/1000)+60,token_type:'Bearer'}; const response=await request(await appFor({mode:'oauth2',issuer:'https://auth',resource:'https://app/mcp',scopes:['read'],introspect:async token=>{expect(token).toBe('x'); return info;}})).post('/mcp').set('Authorization','Bearer x'); expect(response.body.auth).toMatchObject({mode:'oauth2',subject:'user-1',scopes:['read','write']});});
test('oauth2 rejects invalid tokens and config',async()=>{expect((await request(await appFor({mode:'oauth2',issuer:'https://auth',resource:'https://app/mcp',introspect:async()=>({active:false})})).post('/mcp').set('Authorization','Bearer x')).status).toBe(401); expect(()=>normalizeAuth({mode:'oauth2'})).toThrow();});
test('supports user and scope helpers',async()=>{const {hasScope,requireScope,getUser,getAccessToken}=await import('../../src/auth.mjs'); const extra={mcpAuth:{mode:'oauth2',subject:'u',clientId:'c',issuer:'i',scopes:['read'],accessToken:'tok'}}; expect(hasScope(extra,'read')).toBe(true); expect(hasScope(extra,'write')).toBe(false); expect(getUser(extra)).toEqual({subject:'u',clientId:'c',issuer:'i',scopes:['read']}); expect(getAccessToken(extra)).toBe('tok'); requireScope(extra,'read'); expect(()=>requireScope(extra,'write')).toThrow();});
test('creates OAuth introspector',async()=>{const fetchFn=jest.fn().mockResolvedValue({ok:true,json:async()=>({active:true})}); const {createOAuthIntrospector}=await import('../../src/auth.mjs'); expect(await createOAuthIntrospector({issuer:'https://auth/',resource:'r',introspectionEndpoint:'https://auth/introspect',clientId:'c',clientSecret:'s',fetchFn})('t')).toEqual({active:true}); expect(fetchFn.mock.calls[0][1].headers.authorization).toMatch(/^Basic /);});

test('middleware bypasses non-MCP requests', async () => {
  const middleware = createAuthMiddleware({ auth: 'none', endpointPaths: ['/mcp'] });
  const next = jest.fn();
  await middleware({ method: 'GET', path: '/mcp' }, {}, next);
  await middleware({ method: 'POST', path: '/other' }, {}, next);
  expect(next).toHaveBeenCalledTimes(2);
});

test('static auth rejects malformed and mismatched tokens', async () => {
  const app = await appFor({ mode: 'static', token: 'secret' });
  expect((await request(app).post('/mcp').set('Authorization', 'Basic secret')).status).toBe(401);
  expect((await request(app).post('/mcp').set('Authorization', 'Bearer nope')).status).toBe(401);
  expect((await request(app).post('/mcp').set('Authorization', 'Bearer secret extra')).status).toBe(401);
});

test('oauth2 challenges missing bearer and supports audience', async () => {
  const config = { mode: 'oauth2', issuer: 'iss', resource: 'res', introspect: jest.fn().mockResolvedValue({ active: true, iss: 'iss', aud: 'res' }) };
  expect((await request(await appFor(config)).post('/mcp')).status).toBe(401);
  expect((await request(await appFor(config)).post('/mcp').set('Authorization', 'Bearer t')).status).toBe(200);
});

test('oauth2 rejects each invalid claim', async () => {
  const base = { active: true, iss: 'iss', resource: 'res', exp: Math.floor(Date.now() / 1000) - 1, token_type: 'mac' };
  for (const info of [null, { ...base }, { ...base, exp: undefined }, { ...base, token_type: undefined }, { ...base, iss: 'bad' }, { ...base, resource: 'bad' }]) {
    const response = await request(await appFor({ mode: 'oauth2', issuer: 'iss', resource: 'res', scopes: ['x'], introspect: async () => info })).post('/mcp').set('Authorization', 'Bearer t');
    expect(response.status).toBe(401);
  }
});

test('helpers support metadata and defaults', async () => {
  const { hasScope, requireScope, getUser, getAccessToken } = await import('../../src/auth.mjs');
  const extra = { _meta: { mcpAuth: { mode: 'oauth2', subject: 'u', scopes: ['x'], accessToken: 't' } } };
  expect(requireAuth(extra)).toBe(extra._meta.mcpAuth); expect(requireBearer(extra)).toBe('t');
  expect(hasScope(extra, 'x')).toBe(true); expect(getUser(extra)).toMatchObject({ subject: 'u', scopes: ['x'] }); expect(getAccessToken(extra)).toBe('t');
  expect(hasScope({}, 'x')).toBe(false); expect(getUser({ mcpAuth: { mode: 'none' } })).toBeNull(); expect(getAccessToken({})).toBeNull();
  expect(() => requireScope({}, 'x')).toThrow(/Missing scope/);
});

test('OAuth introspector handles errors and public clients', async () => {
  const { createOAuthIntrospector } = await import('../../src/auth.mjs');
  expect(() => createOAuthIntrospector()('t')).rejects.toThrow('OAuth introspection endpoint is required');
  const fetchFn = jest.fn().mockResolvedValue({ ok: false });
  expect(await createOAuthIntrospector({ introspectionEndpoint: 'u', resource: 'r', fetchFn })('t')).toBeNull();
  await createOAuthIntrospector({ introspectionEndpoint: 'u', resource: 'r', fetchFn })('t');
  expect(fetchFn.mock.calls[0][1].headers.authorization).toBeUndefined();
});

test('covers auth defaults and fallback fields', async () => {
  expect(normalizeAuth(null)).toEqual({ mode: 'none' });
  const middleware = createAuthMiddleware({ endpointPaths: ['/mcp'] });
  const next = jest.fn();
  await middleware({ method: 'POST', path: '/mcp', get: () => '' }, {}, next);
  expect(next).toHaveBeenCalled();
  const { getUser, requireAuth } = await import('../../src/auth.mjs');
  expect(() => requireAuth()).toThrow();
  expect(getUser({ mcpAuth: { mode: 'static' } })).toEqual({ subject: undefined, clientId: undefined, issuer: undefined, scopes: [] });
});

test('oauth2 covers optional claims and user_id', async () => {
  const info = { active: true, iss: 'iss', resource: 'res', user_id: 'user' };
  const response = await request(await appFor({ mode: 'oauth2', issuer: 'iss', resource: 'res', introspect: async () => info })).post('/mcp').set('Authorization', 'Bearer t');
  expect(response.status).toBe(200); expect(response.body.auth.subject).toBe('user');
});

test('covers helper default arguments', async () => {
  const { hasScope, requireScope, getUser, getAccessToken } = await import('../../src/auth.mjs');
  expect(hasScope('bad', 'x')).toBe(false);
  expect(getUser()).toBeNull(); expect(getAccessToken()).toBeNull();
  expect(() => requireScope(undefined, 'x')).toThrow();
});

test('covers remaining helper defaults', async () => {
  const { hasScope, requireBearer } = await import('../../src/auth.mjs');
  expect(hasScope()).toBe(false);
  expect(() => requireBearer()).toThrow('Authentication required');
});
