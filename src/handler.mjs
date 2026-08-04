export function createRequestHandler({ stateless, initialServer, initialTransport, buildServer, createTransport, options }) {
  return async function handle(req, res) {
    const server = stateless ? await buildServer(options) : initialServer;
    const transport = stateless ? createTransport(options) : initialTransport;
    if (stateless) await server.connect(transport);
    if (req.body?.params && typeof req.body.params === 'object') {
      req.body.params._meta = { ...req.body.params._meta, bearerToken: req.mcpBearerToken };
    }
    try {
      await transport.handleRequest(req, res, req.body);
    } finally {
      if (stateless) await transport.close().catch(() => {});
    }
  };
}
