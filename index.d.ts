import type { Application, Request, Response, NextFunction } from 'express';
import type { Server as HttpServer } from 'node:http';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { z } from 'zod';

export type AuthMode = 'none' | 'static' | 'bearer-passthrough' | 'oauth2';
export interface AuthConfig { mode: AuthMode; token?: string; issuer?: string; resource?: string; scopes?: string[]; introspect?: (token: string) => Promise<Record<string, unknown> | null>; introspection?: { endpoint: string; clientId?: string; clientSecret?: string } }

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
  auth?: AuthConfig;
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
  transport: StreamableHTTPServerTransport | undefined;
}

export interface ToolRegistrationContext {
  mcpServer: McpServer;
  toolName: string;
  log: McpServerOptions['log'];
  [key: string]: unknown;
}

export function mcpServer(options?: McpServerOptions): Promise<McpServerResult>;
export function discoverOAuthProvider(options: { issuer: string; fetchFn?: typeof fetch }): Promise<Record<string, unknown>>;
export function registerOAuthClient(options: { registrationEndpoint: string; metadata: Record<string, unknown>; fetchFn?: typeof fetch }): Promise<Record<string, unknown>>;
export function createClientStore(options: { load: Function; save: Function; remove?: Function }): { load: Function; save: Function; remove: Function };
export function setOAuthChallenge(res: Response, options?: { resource?: string; scope?: string }): void;
export function mountOAuthResourceMetadata(app: unknown, options?: { resource?: string; issuer?: string; scopes?: string[] }): void;
export function resolveOAuthClient(options: { client: Record<string, unknown>; provider: Record<string, unknown>; store?: Record<string, Function> }): Promise<Record<string, unknown>>;
export function createOAuthClient(options: { issuer: string; client: Record<string, unknown>; store?: Record<string, Function>; fetchFn?: typeof fetch }): Promise<Record<string, unknown>>;
export function normalizeAuth(auth?: AuthConfig): AuthConfig;
export function requireAuth(extra?: Record<string, unknown>): AuthConfig;
export function requireBearer(extra?: Record<string, unknown>): string;
export function hasScope(extra: Record<string, unknown>, scope: string): boolean;
export function requireScope(extra: Record<string, unknown>, scope: string): void;
export function getUser(extra: Record<string, unknown>): Record<string, unknown> | null;
export function getAccessToken(extra: Record<string, unknown>): string | null;
export function createOAuthIntrospector(options: { issuer: string; resource: string; introspectionEndpoint: string; clientId?: string; clientSecret?: string; fetchFn?: typeof fetch }): (token: string) => Promise<Record<string, unknown> | null>;
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

export function createPkceState(options?: { randomBytes?: (size: number) => Buffer }): { verifier: string; state: string; challenge: string; method: 'S256' };
export function createPkceStore(options: { save: Function; load: Function; remove?: Function }): { save: Function; load: Function; remove: Function };
export function consumePkceState(options: { store: Record<string, Function>; state: string; expectedState: string }): Promise<Record<string, unknown>>;
