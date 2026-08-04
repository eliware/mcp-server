import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

export function createTransport({ stateless, enableJsonResponse }) {
  return new StreamableHTTPServerTransport({
    ...(stateless ? { sessionIdGenerator: undefined } : {}),
    enableJsonResponse
  });
}
