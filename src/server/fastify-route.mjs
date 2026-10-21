import { toNodeHandler } from "@modelcontextprotocol/node";
import { injectRequestAuthMetadata } from "../request-auth-metadata.mjs";

export function mountMcpHandler({ app, handler, endpointPath = "/mcp" }) {
  const nodeHandler = toNodeHandler(handler);
  app.route({
    method: ["DELETE", "GET", "POST"],
    url: endpointPath,
    handler: async (request, reply) => {
      injectRequestAuthMetadata(request.body?.params, request.raw.auth?.extra?.mcpAuth);
      reply.hijack();
      await nodeHandler(request.raw, reply.raw, request.body);
    },
  });
  return app;
}
