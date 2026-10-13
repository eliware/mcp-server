export function buildHttpsRedirectTarget({ host, httpsPort, requestUrl }) {
  let hostname = "localhost";
  if (host) {
    try {
      hostname = new URL(`http://${host}`).hostname;
    } catch {
      hostname = "localhost";
    }
  }
  const portSuffix = String(httpsPort) === "443" ? "" : `:${httpsPort}`;
  return `https://${hostname}${portSuffix}${requestUrl}`;
}
