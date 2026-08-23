import fs from 'fs';
import { path } from '@eliware/path';
import packageMeta from '../package.json' with { type: 'json' };

export function loadPackageMeta({ name, version, log, readFile = fs.readFileSync, packagePath = path(import.meta, '..', 'package.json') }) {
  try {
    const pkg = JSON.parse(readFile(packagePath, 'utf8'));
    return { name: name || pkg.name || packageMeta.name, version: version || pkg.version || packageMeta.version };
  } catch (err) {
    log.warn('[SERVER] Could not read package.json for version:', err?.stack || err);
    return { name: name || packageMeta.name, version: version || packageMeta.version };
  }
}
