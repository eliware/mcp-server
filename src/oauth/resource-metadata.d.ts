import type { Application } from "express";

export function mountOAuthResourceMetadata(
  app: Application,
  options?: { resource?: string; issuer?: string; scopes?: string[] },
): void;
