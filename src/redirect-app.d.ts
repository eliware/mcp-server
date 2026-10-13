import type { Express } from "express";

export function createRedirectApp(options: {
  createApp: () => Express;
  httpsPort: number | string;
}): Express;
