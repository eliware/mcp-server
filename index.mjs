import http from 'http';
import https from 'node:https';
import { dirname, resolve } from 'node:path';
import express from 'express';
import logger from '@eliware/log';
import { path } from '@eliware/path';
import { z } from 'zod';
import { loadPackageMeta } from './src/meta.mjs';
import { buildServer } from './src/tools.mjs';
import { createAuthMiddleware, createOAuthIntrospector } from './src/auth.mjs';
import { configureHttp } from './src/http.mjs';
import { createTransport } from './src/transport.mjs';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createRequestHandler } from './src/handler.mjs';
import { loadTlsOptions } from './src/tls.mjs';
import { mountOAuthResourceMetadata } from './src/oauth.mjs';
export { buildResponse, convertBigIntToString } from './src/response.mjs';
export { discoverOAuthProvider, registerOAuthClient, createClientStore } from './src/oauth.mjs';
export { resolveOAuthClient } from './src/client.mjs';
export { createOAuthClient } from './src/oauth-client.mjs';
export { createPkceState, createPkceStore, consumePkceState } from './src/pkce.mjs';

export const stderrLogger = Object.fromEntries(['debug', 'info', 'warn', 'error'].map(level => [level, (...args) => console.error(...args)]));

export function handleRequestFailure({ log, res }, err) {
  log.error('[MCP] Request failed:', err?.stack || err);
  if (!res.headersSent) res.status(500).json({ error: 'Internal MCP server error' });
}


export function requestEndpoint({ handle, log }, req, res) {
  return handle(req, res).catch(err => handleRequestFailure({ log, res }, err));
}

export function createPostHandler({ handle, log }) {
  return (req, res) => requestEndpoint({ handle, log }, req, res);
}

export function createListeningHandler({ log, port }) {
  return () => listeningCallback({ log }, port);
}

export function listeningCallback({ log }, port) {
  log.debug(`MCP HTTP Server listening on ${port}`);
}

export function createRedirectApp({ createApp, httpsPort }) {
  const redirectApp = createApp();
  redirectApp.use((req, res) => {
    const host = req.headers.host?.split(':')[0] || 'localhost';
    const portSuffix = httpsPort === 443 ? '' : `:${httpsPort}`;
    res.redirect(301, `https://${host}${portSuffix}${req.originalUrl || req.url}`);
  });
  return redirectApp;
}

export async function mcpServer(options = {}) {
  const defaultEntrypoint = process.argv[1]?.endsWith('.mjs') ? process.argv[1] : undefined;
  const defaults = {
    log: logger, entrypoint: defaultEntrypoint,
    tls: undefined, httpRedirect: false,
    auth: { mode: 'none' }, context: {}, stateless: true,
    endpointPath: '/mcp', enableJsonResponse: true, allowedOrigins: [], stdio: false,
    createApp: express, createHttpServer: http.createServer, createHttpsServer: https.createServer,
  };
  const {
    log, entrypoint, auth, name, version, context,
    stateless, stdio, endpointPath, enableJsonResponse, allowedOrigins, createApp, createHttpServer, createHttpsServer,
    httpPort, httpsPort, tls, httpRedirect
  } = { ...defaults, ...options };
  const toolsDir = options.toolsDir || (entrypoint ? resolve(dirname(entrypoint), 'tools') : path(import.meta, 'tools'));
  const activeLog = stdio && !options.log ? stderrLogger : log;
  const meta = loadPackageMeta({ name, version, log: activeLog });
  const serverOptions = { ...meta, toolsDir, log: activeLog, context, enableJsonResponse, stateless };
  const initialServer = await buildServer(serverOptions);
  if (stdio) {
    const transport = new StdioServerTransport();
    await initialServer.connect(transport);
    return { app: undefined, httpInstance: undefined, mcpServer: initialServer, transport };
  }
  const endpointPaths = [endpointPath];
  const app = createApp();
  configureHttp({ app, allowedOrigins });
  if (auth?.mode === 'oauth2') mountOAuthResourceMetadata(app, auth);
  const runtimeAuth = auth?.mode === 'oauth2' && !auth.introspect && auth.introspection ? { ...auth, introspect: createOAuthIntrospector({ issuer: auth.issuer, resource: auth.resource, ...auth.introspection }) } : auth;
  app.use(createAuthMiddleware({ auth: runtimeAuth, endpointPaths }));
  let initialTransport;
  if (!stateless) {
    initialTransport = createTransport(serverOptions);
    await initialServer.connect(initialTransport);
  }
  const handle = createRequestHandler({ stateless, initialServer, initialTransport, buildServer, createTransport, options: serverOptions });
  app.post(endpointPaths, createPostHandler({ handle, log: activeLog }));
  const selectedHttpPort = httpPort;
  const selectedHttpsPort = httpsPort;
  const loadedTls = loadTlsOptions({ tls });
  if (selectedHttpsPort !== undefined && (!loadedTls.key || !loadedTls.cert)) {
    throw new Error('httpsPort requires tls.key and tls.cert');
  }
  let httpInstance;
  let httpsInstance;
  if (selectedHttpPort !== null && selectedHttpPort !== false) {
    const httpApp = httpRedirect ? createRedirectApp({ createApp, httpsPort: selectedHttpsPort }) : app;
    httpInstance = createHttpServer(httpApp);
    httpInstance.listen(selectedHttpPort, createListeningHandler({ log: activeLog, port: selectedHttpPort }));
  }
  if (selectedHttpsPort !== undefined) {
    httpsInstance = createHttpsServer(loadedTls, app);
    httpsInstance.listen(selectedHttpsPort, createListeningHandler({ log: activeLog, port: selectedHttpsPort }));
  }
  return { app, httpInstance, httpsInstance, mcpServer: initialServer, transport: initialTransport };
}

export { z };
