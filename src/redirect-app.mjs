import { buildHttpsRedirectTarget } from "./redirect-target.mjs";

export function createRedirectApp({ createApp, httpsHost, httpsPort }) {
  const redirectApp = createApp();
  redirectApp.use((req, res) => {
    const target = buildHttpsRedirectTarget({
      httpsHost,
      httpsPort,
      requestUrl: req.originalUrl || req.url,
    });
    res.redirect(301, target);
  });
  return redirectApp;
}
