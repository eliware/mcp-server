import type { FastifyReply } from "fastify";

export function setOAuthChallenge(
  res: FastifyReply,
  options?: { resource?: string; scope?: string },
): void;
