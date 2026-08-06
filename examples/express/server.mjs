import express from 'express';
import { mcpServer } from '@eliware/mcp-server';

const app = express();
app.use(express.json());

// Application routes can share the same listener as MCP.
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/version', (req, res) => res.json({ version: '1.0.0' }));

const { httpInstance } = await mcpServer({
  app,
  httpPort: Number(process.env.PORT || 1234),
  endpointPath: '/mcp',
  auth: { mode: 'static', token: process.env.MCP_TOKEN },
  configureApp: configuredApp => {
    configuredApp.use('/api', (req, res, next) => {
      res.set('X-Service', 'mcp-example');
      next();
    });
  },
});

process.once('SIGTERM', () => httpInstance?.close());
process.once('SIGINT', () => httpInstance?.close());
