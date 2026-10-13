import { injectRequestAuthMetadata } from "./request-auth-metadata.mjs";

export function createRequestHandler({
  stateless,
  initialServer,
  initialTransport,
  buildServer,
  createTransport,
  options,
}) {
  return async function handle(req, res) {
    const server = stateless ? await buildServer(options) : initialServer;
    const transport = stateless ? createTransport(options) : initialTransport;
    if (stateless) await server.connect(transport);
    injectRequestAuthMetadata(req.body?.params, req.mcpAuth);
    try {
      await transport.handleRequest(req, res, req.body);
    } finally {
      if (stateless) await transport.close().catch(() => {});
    }
  };
}
