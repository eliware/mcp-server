import { loadPackageMeta } from '../../src/meta.mjs';
import { test, expect, jest } from '@jest/globals';
import packageMeta from '../../package.json' with { type: 'json' };

test('loads package metadata', () => expect(loadPackageMeta({ log: { warn: jest.fn() } })).toMatchObject({ name: '@eliware/mcp-server' }));
test('uses explicit metadata', () => expect(loadPackageMeta({ name: 'x', version: '2', log: { warn: jest.fn() } })).toEqual({ name: 'x', version: '2' }));
test('uses package fallback values', () => expect(loadPackageMeta({ log: { warn: jest.fn() }, readFile: () => JSON.stringify({}), packagePath: 'test' })).toEqual({ name: packageMeta.name, version: packageMeta.version }));
test('logs and falls back when metadata cannot be read', () => { const warn=jest.fn(); expect(loadPackageMeta({ log:{warn}, readFile:()=>{throw new Error('bad')}})).toEqual({name:packageMeta.name,version:packageMeta.version}); expect(warn).toHaveBeenCalled(); });
test('logs error value when stack is absent', () => { const warn=jest.fn(); loadPackageMeta({ log:{warn}, readFile:()=>{throw { message:'bad' };} }); expect(warn).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({message:'bad'})); });
