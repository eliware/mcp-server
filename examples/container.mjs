import { mcpServer } from "../src/index.mjs";
import { fileURLToPath } from "node:url";

await mcpServer({
  stdio: process.argv.includes("--stdio"),
  port: process.env.PORT ? Number(process.env.PORT) : 1234,
  auth: { mode: "static", token: process.env.MCP_TOKEN },
  toolsDir: fileURLToPath(new URL("./tools/", import.meta.url)),
});
