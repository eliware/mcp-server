import { describe, expect, jest, test } from '@jest/globals';
import { loadTlsOptions } from '../../src/tls.mjs';

describe('TLS config', () => {
  test('loads configured files and preserves direct values', () => {
    const readFile = jest.fn(file => `loaded:${file}`);
    expect(loadTlsOptions({
      tls: { keyFile: 'key.pem', certFile: 'cert.pem', caFile: 'ca.pem', key: 'direct-key' },
      readFile,
    })).toEqual({ key: 'direct-key', cert: 'loaded:cert.pem', ca: 'loaded:ca.pem' });
    expect(readFile).toHaveBeenCalledTimes(2);
  });

  test('loads environment file paths', () => {
    const readFile = jest.fn(file => Buffer.from(file));
    expect(loadTlsOptions({ env: { TLS_KEY_FILE: 'k', TLS_CERT_FILE: 'c', TLS_CA_FILE: 'a' }, readFile })).toEqual({
      key: Buffer.from('k'), cert: Buffer.from('c'), ca: Buffer.from('a'),
    });
  });

  test('returns empty config when no files are configured', () => {
    expect(loadTlsOptions({ env: {}, readFile: jest.fn() })).toEqual({});
  });
});

test('accepts omitted options', () => {
  expect(loadTlsOptions({ env: {}, readFile: jest.fn() })).toEqual({});
});

test('uses defaults when called without arguments', () => {
  expect(loadTlsOptions()).toEqual({});
});
