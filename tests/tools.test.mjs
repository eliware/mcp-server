import fs from 'fs'; import { path, pathUrl } from '@eliware/path'; import { jest, test, expect } from '@jest/globals';
const toolsDir=path(import.meta,'..','examples','tools');
for (const file of fs.readdirSync(toolsDir).filter(f=>f.endsWith('.mjs'))) {
  test(`${file} exports and registers`, async()=>{const mod=await import(pathUrl(toolsDir,file)); expect(typeof mod.default).toBe('function'); const tool=jest.fn(); await mod.default({mcpServer:{tool},toolName:'test-tool',log:{debug:jest.fn(),info:jest.fn(),warn:jest.fn(),error:jest.fn()}}); expect(tool).toHaveBeenCalled();});
}
