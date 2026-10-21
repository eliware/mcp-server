import type { FastifyInstance } from "fastify";

export function mountOAuthRoutes(options: {
  app: FastifyInstance;
  auth?: { mode?: string; resource?: string; issuer?: string; scopes?: string[] };
}): void;

export function mountOAuthResourceMetadata(
  app: FastifyInstance,
  options?: { resource?: string; issuer?: string; scopes?: string[] },
): void;
