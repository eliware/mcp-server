import type { Application, Response } from "express";

export function setOAuthChallenge(
  res: Response,
  options?: { resource?: string; scope?: string },
): void;
export function mountOAuthResourceMetadata(
  app: Application,
  options?: { resource?: string; issuer?: string; scopes?: string[] },
): void;
