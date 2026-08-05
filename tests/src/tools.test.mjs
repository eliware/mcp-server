import { buildServer } from '../../src/tools.mjs';
import { path } from '@eliware/path';
import { test, expect, jest } from '@jest/globals';

const log = { debug: jest.fn(), warn: jest.fn(), error: jest.fn() };
test('builds server and loads mjs tools', async()=>{const server=await buildServer({toolsDir:new URL('../../examples/tools/',import.meta.url).pathname,log,name:'test',version:'1',context:{}}); expect(server.options.name).toBe('test')});
test('warns for a module without default function', async()=>{const warn=jest.fn(); await buildServer({toolsDir:'/tmp',log:{warn,error:jest.fn()},name:'x',version:'1',context:{},readDir:()=>['plain.mjs'],loadModule:async()=>({})}); expect(warn).toHaveBeenCalledWith('No default export function in plain.mjs')});
test('logs module loading errors', async()=>{const error=jest.fn(); await buildServer({toolsDir:'/tmp',log:{warn:jest.fn(),error},name:'x',version:'1',context:{},readDir:()=>['bad.mjs'],loadModule:async()=>{throw new Error('bad')}}); expect(error).toHaveBeenCalled()});
test('passes context and tool name to tool', async()=>{const handler=jest.fn(); await buildServer({toolsDir:'/tmp',log, name:'x',version:'1',context:{db:'db'},readDir:()=>['hello.mjs'],loadModule:async()=>({default:handler})}); expect(handler).toHaveBeenCalledWith(expect.objectContaining({toolName:'hello',db:'db'}));});
test('logs non-Error module failures', async()=>{const error=jest.fn(); await buildServer({toolsDir:'/tmp',log:{warn:jest.fn(),error},name:'x',version:'1',context:{},readDir:()=>['bad.mjs'],loadModule:async()=>{throw {message:'bad'}}}); expect(error).toHaveBeenCalledWith(expect.any(String),expect.objectContaining({message:'bad'}));});
