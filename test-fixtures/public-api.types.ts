import { mcpServer, type McpServerResult, type ToolRegistrationContext } from "@eliware/mcp-server";
import { createOAuthClient, createOAuthIntrospector } from "@eliware/mcp-server/oauth";
import { buildResponse } from "@eliware/mcp-server/utilities";

const registrationContext: ToolRegistrationContext = {
  mcpServer: {} as ToolRegistrationContext["mcpServer"],
  toolName: "example",
  log: undefined,
  context: { service: "injected" },
};

async function verifyServerResult(result: McpServerResult): Promise<void> {
  await result.close();
  if (result.app) await result.app.close();
}

void mcpServer;
void createOAuthClient;
void createOAuthIntrospector;
void buildResponse;
void registrationContext;
void verifyServerResult;
