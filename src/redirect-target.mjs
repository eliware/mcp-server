export function buildHttpsRedirectTarget({ httpsHost, httpsPort, requestUrl }) {
  if (typeof httpsHost !== "string" || !httpsHost.trim()) {
    throw new Error("httpsHost must be a valid hostname");
  }
  let hostname;
  let publicPort;
  try {
    const publicHost = new URL(`http://${httpsHost}`);
    hostname = publicHost.hostname;
    publicPort = publicHost.port ? normalizeHttpsPort(publicHost.port) : undefined;
  } catch {
    throw new Error("httpsHost must be a valid hostname");
  }
  const port = publicPort || normalizeHttpsPort(httpsPort);
  const portSuffix = port === 443 ? "" : `:${port}`;
  return `https://${hostname}${portSuffix}${requestUrl}`;
}

export function normalizeHttpsPort(httpsPort) {
  if (!/^\d+$/.test(String(httpsPort))) {
    throw new Error("httpsPort must be an integer from 1 through 65535");
  }
  const port = Number(httpsPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("httpsPort must be an integer from 1 through 65535");
  }
  return port;
}
