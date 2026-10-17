import { createMcpHandler as createSdkHandler } from "@modelcontextprotocol/server";

export function createMcpHandler({ buildServer, serverOptions, onerror }) {
  const reportError = onerror || ((error) => serverOptions.log?.error?.(error));
  return createSdkHandler(
    (context) =>
      buildServer({
        ...serverOptions,
        context: {
          ...serverOptions.context,
          mcpAuth: context.http?.authInfo?.extra?.mcpAuth,
        },
      }),
    {
      legacy: "reject",
      onerror: reportError,
    },
  );
}
