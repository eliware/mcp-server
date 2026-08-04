import express from 'express'; import request from 'supertest';
import { configureHttp } from '../../src/http.mjs';
import { test, expect, jest } from '@jest/globals';
test('handles CORS preflight', async()=>{const app=express(); configureHttp({app,allowedOrigins:[]}); expect((await request(app).options('/mcp')).status).toBe(204)});
test('rejects malformed JSON', async()=>{const app=express(); configureHttp({app,allowedOrigins:[]}); app.post('/mcp',(req,res)=>res.sendStatus(200)); expect((await request(app).post('/mcp').set('Content-Type','application/json').send('{')).status).toBe(406)});
test('passes unrelated errors to downstream middleware', async()=>{const app=express(); configureHttp({app,allowedOrigins:[]}); app.use((req,res,next)=>next(new Error('boom'))); app.use((err,req,res,_next)=>res.status(500).send(err.message)); expect((await request(app).get('/mcp')).status).toBe(500)});
import { handleJsonError } from '../../src/http.mjs';
test('passes non-JSON errors through',()=>{const next=jest.fn(); handleJsonError(new Error('boom'),{}, {},next); expect(next).toHaveBeenCalled();});
test('uses configured allowed origins', async()=>{const app=express(); configureHttp({app,allowedOrigins:['https://example.test']}); const r=await request(app).options('/mcp'); expect(r.status).toBe(204); expect(r.headers['access-control-allow-origin']).toBe('https://example.test')});
