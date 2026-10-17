import { mcpServer } from "@eliware/mcp-server";

const token = process.env.MCP_TOKEN;
if (!token) throw new Error("Set MCP_TOKEN before you start the server.");

const { app } = await mcpServer({
  host: "127.0.0.1",
  port: Number(process.env.PORT || 1234),
  auth: { mode: "static", token },
  configureFastify(fastify) {
    fastify.get("/health", async () => ({ status: "ok" }));
  },
});

const close = () => app.close();
process.once("SIGTERM", close);
process.once("SIGINT", close);
