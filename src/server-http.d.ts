import type { Request, Response } from "express";
import type { McpServerOptions } from "./server.mjs";

export function handleRequestFailure(
  context: { log: NonNullable<McpServerOptions["log"]>; res: Response },
  error: unknown,
): void;
export function requestEndpoint(
  context: {
    handle: (req: Request, res: Response) => Promise<unknown>;
    log: NonNullable<McpServerOptions["log"]>;
  },
  req: Request,
  res: Response,
): Promise<unknown>;
export function createPostHandler(context: {
  handle: (req: Request, res: Response) => Promise<unknown>;
  log: NonNullable<McpServerOptions["log"]>;
}): (req: Request, res: Response) => Promise<unknown>;
export function listeningCallback(
  context: { log: NonNullable<McpServerOptions["log"]> },
  port: number | string,
): void;
export function createListeningHandler(context: {
  log: NonNullable<McpServerOptions["log"]>;
  port: number | string;
}): () => void;
