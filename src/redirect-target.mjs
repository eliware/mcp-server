export function buildHttpsRedirectTarget({ host, httpsPort, requestUrl }) {
  const hostname = host?.split(":")[0] || "localhost";
  const portSuffix = httpsPort === 443 ? "" : `:${httpsPort}`;
  return `https://${hostname}${portSuffix}${requestUrl}`;
}
