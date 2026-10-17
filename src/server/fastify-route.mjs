import { toNodeHandler } from "@modelcontextprotocol/node";

export function mountMcpHandler({ app, handler, endpointPath = "/mcp" }) {
  const nodeHandler = toNodeHandler(handler);
  app.route({
    method: ["DELETE", "GET", "POST"],
    url: endpointPath,
    handler: async (request, reply) => {
      reply.hijack();
      await nodeHandler(request.raw, reply.raw, request.body);
    },
  });
  return app;
}
