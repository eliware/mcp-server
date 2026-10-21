import { hostHeaderValidation, originValidation } from "@modelcontextprotocol/fastify";
import { authenticateRequest } from "./authenticate.mjs";

export function registerSecurityHooks({
  app,
  suppliedApp,
  allowedHosts,
  allowedOrigins,
  endpointPath,
  auth,
  authenticate = authenticateRequest,
}) {
  if (suppliedApp && allowedHosts) {
    app.addHook("onRequest", hostHeaderValidation(allowedHosts));
  }
  if (suppliedApp && allowedOrigins) {
    app.addHook("onRequest", originValidation(allowedOrigins));
  }
  app.addHook("preHandler", async (request, reply) => {
    if (request.routeOptions.url !== endpointPath) return;
    if (!(await authenticate(request, reply, auth))) return reply;
  });
}
