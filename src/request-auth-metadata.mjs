export function injectRequestAuthMetadata(params, auth) {
  if (!params || typeof params !== "object") return;
  params._meta = { ...params._meta, mcpAuth: auth };
}
