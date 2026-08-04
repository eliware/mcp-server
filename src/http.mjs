import express from 'express';

export function handleJsonError(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(406).json({ error: 'Invalid JSON' });
  return next(err);
}

export function configureHttp({ app, allowedOrigins }) {
  app.use(express.json());
  app.use(handleJsonError);
  app.use((req, res, next) => {
    if (req.method !== 'OPTIONS') return next();
    res.set('Access-Control-Allow-Origin', allowedOrigins.length ? allowedOrigins.join(', ') : '*');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, MCP-Protocol-Version, MCP-Session-Id');
    res.set('Access-Control-Expose-Headers', 'MCP-Session-Id');
    return res.sendStatus(204);
  });
}
