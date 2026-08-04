import { buildResponse, convertBigIntToString } from '../../src/response.mjs';
import { test, expect } from '@jest/globals';
test('converts nested BigInts', () => expect(convertBigIntToString({ a: 1n, b: [2n] })).toEqual({ a: '1', b: ['2'] }));
test('wraps MCP response data', () => expect(buildResponse({ n: 1n }).content[0].text).toContain('"n": "1"'));
test('returns primitive values unchanged', () => { expect(convertBigIntToString('text')).toBe('text'); expect(convertBigIntToString(null)).toBeNull(); expect(convertBigIntToString(42)).toBe(42); });
