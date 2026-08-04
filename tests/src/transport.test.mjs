import { createTransport } from '../../src/transport.mjs';
import { test, expect } from '@jest/globals';
test('creates stateless transport',()=>expect(createTransport({stateless:true,enableJsonResponse:true})).toBeTruthy());
test('creates stateful transport',()=>expect(createTransport({stateless:false,enableJsonResponse:false})).toBeTruthy());
