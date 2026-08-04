import fs from 'node:fs';

export function loadTlsOptions({ tls = {}, env = process.env, readFile = fs.readFileSync } = {}) {
  const key = tls.key ?? readFileIfConfigured(tls.keyFile ?? env.TLS_KEY_FILE, readFile);
  const cert = tls.cert ?? readFileIfConfigured(tls.certFile ?? env.TLS_CERT_FILE, readFile);
  const ca = tls.ca ?? readFileIfConfigured(tls.caFile ?? env.TLS_CA_FILE, readFile);
  return { ...(key === undefined ? {} : { key }), ...(cert === undefined ? {} : { cert }), ...(ca === undefined ? {} : { ca }) };
}

function readFileIfConfigured(file, readFile) {
  return file ? readFile(file) : undefined;
}
