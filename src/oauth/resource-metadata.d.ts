import type { FastifyInstance } from "fastify";

export function mountOAuthResourceMetadata(
  app: FastifyInstance,
  options?: { resource?: string; issuer?: string; scopes?: string[] },
): void;
