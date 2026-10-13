export function isAuthRequest(req, endpointPaths) {
  return req.method === "POST" && endpointPaths.includes(req.path);
}
