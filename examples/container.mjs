import { mcpServer } from "../src/index.mjs";
import { fileURLToPath } from "node:url";

const token = process.env.MCP_TOKEN;
if (!token) throw new Error("Set MCP_TOKEN before you start the server.");

await mcpServer({
  stdio: process.argv.includes("--stdio"),
  port: process.env.PORT ? Number(process.env.PORT) : 1234,
  auth: { mode: "static", token },
  toolsDir: fileURLToPath(new URL("./tools/", import.meta.url)),
});
