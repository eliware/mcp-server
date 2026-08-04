import fs from 'fs';
import { path } from '@eliware/path';

export function loadPackageMeta({ name, version, log, readFile = fs.readFileSync, packagePath = path(import.meta, '..', 'package.json') }) {
  try {
    const pkg = JSON.parse(readFile(packagePath, 'utf8'));
    return { name: name || pkg.name || '@eliware/mcp-server', version: version || pkg.version || '1.0.0' };
  } catch (err) {
    log.warn('[SERVER] Could not read package.json for version:', err?.stack || err);
    return { name: name || '@eliware/mcp-server', version: version || '1.0.0' };
  }
}
