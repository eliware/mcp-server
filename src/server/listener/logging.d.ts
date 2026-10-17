import type { McpServerOptions } from "../../server.mjs";

export function createListeningHandler(context: {
  log: NonNullable<McpServerOptions["log"]>;
  port: number | string;
}): () => void;
export function listeningCallback(
  context: { log: NonNullable<McpServerOptions["log"]> },
  port: number | string,
): void;
