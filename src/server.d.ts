import type { FastifyInstance } from "fastify";
import type { StdioServerHandle } from "@modelcontextprotocol/server/stdio";
import type { AuthConfig, AuthMode } from "./auth/config.mjs";

export interface McpServerOptions {
  log?: {
    debug?: (...args: unknown[]) => void;
    info?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
    error?: (...args: unknown[]) => void;
  };
  toolsDir?: string;
  entrypoint?: string;
  host?: string;
  port?: number | string | null;
  auth?: AuthMode | AuthConfig;
  name?: string;
  version?: string;
  context?: Record<string, unknown>;
  stdio?: boolean;
  endpointPath?: string;
  allowedHosts?: string[];
  allowedOrigins?: string[];
  fastify?: FastifyInstance;
  configureFastify?: (app: FastifyInstance) => void | Promise<void>;
}

export type McpServerResult =
  { app: FastifyInstance; transport?: never } | { app?: never; transport: StdioServerHandle };

export function mcpServer(options?: McpServerOptions): Promise<McpServerResult>;
