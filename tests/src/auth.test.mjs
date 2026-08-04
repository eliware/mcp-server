import express from 'express'; import request from 'supertest';
import { createAuthMiddleware } from '../../src/auth.mjs';
import { test, expect, jest } from '@jest/globals';
async function appFor(opts) { const app=express(); app.use(createAuthMiddleware({ endpointPaths:['/mcp'], ...opts })); app.post('/mcp',(req,res)=>res.json({ok:true,token:req.mcpBearerToken})); app.get('/mcp',(req,res)=>res.json({ok:true})); return app; }
test('accepts bearer token', async()=>expect((await request(await appFor({authToken:'x'})).post('/mcp').set('Authorization','Bearer x')).status).toBe(200));
test('rejects invalid token', async()=>expect((await request(await appFor({authToken:'x'})).post('/mcp')).status).toBe(401));
test('supports callback and errors', async()=>{const cb=jest.fn().mockRejectedValue(new Error('bad')); expect((await request(await appFor({authCallback:cb})).post('/mcp').set('Authorization','Bearer x')).status).toBe(500)});
test('reports missing static token configuration', async()=>expect((await request(await appFor({})).post('/mcp')).status).toBe(500));
test('rejects missing authentication configuration',async()=>{const response=await request(await appFor({})).post('/mcp'); expect(response.status).toBe(500);});

test('passes through non-POST requests',async()=>expect((await request(await appFor({authToken:'x'})).get('/mcp')).status).toBe(200));
