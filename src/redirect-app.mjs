export function createRedirectApp({ createApp, httpsPort }) {
  const redirectApp = createApp();
  redirectApp.use((req, res) => {
    const host = req.headers.host?.split(":")[0] || "localhost";
    const portSuffix = httpsPort === 443 ? "" : `:${httpsPort}`;
    res.redirect(301, `https://${host}${portSuffix}${req.originalUrl || req.url}`);
  });
  return redirectApp;
}
