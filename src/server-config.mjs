import http from "node:http";
import https from "node:https";
import { fileURLToPath } from "node:url";
import express from "express";
import { log as logger } from "@eliware/common";

export function normalizeEntrypoint(entrypoint) {
  if (entrypoint instanceof URL) return fileURLToPath(entrypoint);
  return entrypoint
    ?.replace(/^([A-Za-z]):[\\/]+[A-Za-z]:[\\/]+/i, "$1:\\")
    .replace(/^[\\/](?=[A-Za-z]:)/, "");
}

export function normalizeServerConfig(options = {}) {
  const defaultEntrypoint = process.argv[1]?.endsWith(".mjs") ? process.argv[1] : undefined;
  const defaults = {
    log: logger,
    entrypoint: defaultEntrypoint,
    tls: undefined,
    httpRedirect: false,
    auth: { mode: "none" },
    context: {},
    stateless: true,
    endpointPath: "/mcp",
    enableJsonResponse: true,
    allowedOrigins: [],
    stdio: false,
    createApp: express,
    createHttpServer: http.createServer,
    createHttpsServer: https.createServer,
    app: undefined,
    configureApp: undefined,
  };
  const config = { ...defaults, ...options };
  return { ...config, entrypoint: normalizeEntrypoint(config.entrypoint) };
}
