export function buildHttpsRedirectTarget({ httpsHost, httpsPort, requestUrl }) {
  if (typeof httpsHost !== "string" || !httpsHost.trim()) {
    throw new Error("httpsHost must be a valid hostname");
  }
  let hostname;
  try {
    hostname = new URL(`http://${httpsHost}`).hostname;
  } catch {
    throw new Error("httpsHost must be a valid hostname");
  }
  const portSuffix = String(httpsPort) === "443" ? "" : `:${httpsPort}`;
  return `https://${hostname}${portSuffix}${requestUrl}`;
}
