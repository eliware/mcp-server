import type { Application } from "express";
import type { Server as HttpServer } from "node:http";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { AuthConfig, AuthMode } from "./auth-config.mjs";

export interface McpServerOptions {
  log?: {
    debug?: (...args: unknown[]) => void;
    info?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
    error?: (...args: unknown[]) => void;
  };
  toolsDir?: string;
  entrypoint?: string;
  httpPort?: number | string | null | false;
  httpsPort?: number | string;
  httpsHost?: string;
  tls?: {
    key?: string | Buffer;
    cert?: string | Buffer;
    ca?: string | Buffer;
    keyFile?: string;
    certFile?: string;
    caFile?: string;
  };
  httpRedirect?: boolean;
  auth?: AuthMode | AuthConfig;
  name?: string;
  version?: string;
  context?: Record<string, unknown>;
  stateless?: boolean;
  stdio?: boolean;
  endpointPath?: string;
  enableJsonResponse?: boolean;
  allowedOrigins?: string[];
  app?: Application;
  configureApp?: (app: Application) => void | Promise<void>;
}

export interface McpServerResult {
  app: Application | undefined;
  httpInstance?: HttpServer;
  httpsInstance?: HttpServer;
  mcpServer: McpServer | undefined;
  transport: StreamableHTTPServerTransport | StdioServerTransport | undefined;
}

export function mcpServer(options?: McpServerOptions): Promise<McpServerResult>;
