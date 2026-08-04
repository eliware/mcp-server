export function createAuthMiddleware({ authToken, authCallback, endpointPaths }) {
  return async (req, res, next) => {
    if (req.method !== 'POST' || !endpointPaths.includes(req.path)) return next();
    const header = req.get('authorization');
    const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : undefined;
    try {
      if (!authCallback && !authToken) return res.status(500).json({ error: 'MCP_TOKEN not set in environment' });
      const valid = authCallback ? await authCallback(token) : token === authToken;
      if (!valid) return res.status(401).json({ error: 'Invalid bearer token' });
    } catch (err) {
      return res.status(500).json({ error: 'Auth callback error', details: String(err) });
    }
    req.mcpBearerToken = token;
    next();
  };
}
