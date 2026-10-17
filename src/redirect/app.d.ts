import type { Express } from "express";

export function createRedirectApp(options: {
  createApp: () => Express;
  httpsHost: string;
  httpsPort: number | string;
}): Express;
