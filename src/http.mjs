import express from "express";
import { handleJsonError } from "./http-error.mjs";

export { handleJsonError } from "./http-error.mjs";

export function configureHttp({ app, allowedOrigins }) {
  app.use(express.json());
  app.use(handleJsonError);
  app.use((req, res, next) => {
    if (req.method !== "OPTIONS") return next();
    res.set("Access-Control-Allow-Origin", allowedOrigins.length ? allowedOrigins.join(", ") : "*");
    res.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type, MCP-Protocol-Version, MCP-Session-Id",
    );
    res.set("Access-Control-Expose-Headers", "MCP-Session-Id");
    return res.sendStatus(204);
  });
}
