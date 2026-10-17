import type { Response } from "express";

export function setOAuthChallenge(
  res: Response,
  options?: { resource?: string; scope?: string },
): void;
