import { createRequestHandler } from '../../src/handler.mjs';
import { test, expect, jest } from '@jest/globals';

function response() { return {}; }

test('handles stateless request and injects bearer token', async () => {
  const server = { connect: jest.fn() };
  const transport = { handleRequest: jest.fn(), close: jest.fn().mockResolvedValue(undefined) };
  const buildServer = jest.fn().mockResolvedValue(server);
  const createTransport = jest.fn().mockReturnValue(transport);
  const req = { body: { params: {} }, mcpBearerToken: 'token' };
  await createRequestHandler({ stateless: true, buildServer, createTransport, options: { x: 1 } })(req, response());
  expect(req.body.params._meta).toEqual({ bearerToken: 'token' });
  expect(server.connect).toHaveBeenCalledWith(transport);
  expect(transport.handleRequest).toHaveBeenCalledWith(req, expect.anything(), req.body);
  expect(transport.close).toHaveBeenCalled();
});

test('handles stateful request without rebuilding or closing', async () => {
  const server = { connect: jest.fn() };
  const transport = { handleRequest: jest.fn(), close: jest.fn().mockResolvedValue(undefined) };
  const buildServer = jest.fn();
  const createTransport = jest.fn();
  await createRequestHandler({ stateless: false, initialServer: server, initialTransport: transport, buildServer, createTransport, options: {} })({ body: {} }, response());
  expect(buildServer).not.toHaveBeenCalled();
  expect(createTransport).not.toHaveBeenCalled();
  expect(transport.close).not.toHaveBeenCalled();
});

test('tolerates transport close failure', async () => {
  const transport = { handleRequest: jest.fn(), close: jest.fn().mockResolvedValue(undefined).mockRejectedValue(new Error('closed')) };
  const server = { connect: jest.fn() };
  await expect(createRequestHandler({ stateless: true, buildServer: jest.fn().mockResolvedValue(server), createTransport: jest.fn().mockReturnValue(transport), options: {} })({ body: {} }, response())).resolves.toBeUndefined();
});
