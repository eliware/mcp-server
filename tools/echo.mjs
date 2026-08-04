/*
 * Ideal MCP tool template.
 *
 * File rules:
 * - Save this as tools/<tool-name>.mjs.
 * - Export one default async function.
 * - The server discovers and registers the file automatically.
 *
 * Registration signature:
 *   async function ({ mcpServer, toolName, log, ...context })
 *
 * Arguments:
 * - mcpServer: SDK server used to register the tool.
 * - toolName: filename without .mjs; use it as the registered name.
 * - log: server logger.
 * - ...context: custom values passed by the entrypoint's context option.
 */
import { z, buildResponse } from '@eliware/mcp-server';

export default async function registerEchoTool({ mcpServer, toolName, log, db }) {
  /*
   * z describes and validates tool inputs.
   * This schema exposes one required string: echoText.
   * Other examples: z.number(), z.boolean(), z.enum([...]), z.object({...}).
   */
  const inputSchema = {
    echoText: z.string().min(1).describe('Text to echo back'),
  };

  mcpServer.tool(
    toolName,
    'Echo text back to the caller.',
    inputSchema,
    async ({ echoText }) => {
      log.debug(`${toolName} request`, { echoText });

      // Custom context is injected by the entrypoint and available here.
      // Example: await db.query('SELECT 1') when a database is configured.
      void db;

      /*
       * buildResponse converts safe values (including BigInt) into the MCP
       * result shape: { content: [{ type: 'text', text: '...' }] }.
       */
      const result = buildResponse({
        message: 'echo-reply',
        data: { text: echoText },
      });

      log.debug(`${toolName} response`, { result });
      return result;
    },
  );
}
