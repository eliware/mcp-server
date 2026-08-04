import type { Request, Response, NextFunction } from 'express';
import type { Server as HttpServer } from 'node:http';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { z } from 'zod';

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
  tls?: { key?: string | Buffer; cert?: string | Buffer; ca?: string | Buffer; keyFile?: string; certFile?: string; caFile?: string };
  httpRedirect?: boolean;
  authToken?: string;
  authCallback?: (token?: string) => boolean | Promise<boolean>;
  name?: string;
  version?: string;
  context?: Record<string, unknown>;
  stateless?: boolean;
  stdio?: boolean;
  endpointPath?: string;
  enableJsonResponse?: boolean;
  allowedOrigins?: string[];
}

export interface McpServerResult {
  app: unknown;
  httpInstance?: HttpServer;
  httpsInstance?: HttpServer;
  mcpServer: McpServer | undefined;
  transport: StreamableHTTPServerTransport | undefined;
}

export interface ToolRegistrationContext {
  mcpServer: McpServer;
  toolName: string;
  log: McpServerOptions['log'];
  [key: string]: unknown;
}

export function mcpServer(options?: McpServerOptions): Promise<McpServerResult>;
export const stderrLogger: NonNullable<McpServerOptions['log']>;
export function buildResponse(data: unknown): { content: [{ type: 'text'; text: string }] };
export function convertBigIntToString<T>(value: T): T extends bigint ? string : unknown;
export function handleRequestFailure(
  context: { log: NonNullable<McpServerOptions['log']>; res: Response },
  error: unknown
): void;
export function requestEndpoint(
  context: { handle: (req: Request, res: Response) => Promise<unknown>; log: NonNullable<McpServerOptions['log']> },
  req: Request,
  res: Response
): Promise<unknown>;
export function createPostHandler(context: {
  handle: (req: Request, res: Response) => Promise<unknown>;
  log: NonNullable<McpServerOptions['log']>;
}): (req: Request, res: Response) => Promise<unknown>;
export function listeningCallback(context: { log: NonNullable<McpServerOptions['log']> }, port: number | string): void;
export function createListeningHandler(context: { log: NonNullable<McpServerOptions['log']>; port: number | string }): () => void;

export { z };
export type { NextFunction };
