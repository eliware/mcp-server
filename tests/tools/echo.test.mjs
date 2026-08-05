import echo from '../../examples/tools/echo.mjs';
import { test, expect, jest } from '@jest/globals';

test('echo tool returns the input and logs lifecycle', async () => {
  const tool = jest.fn();
  const log = { debug: jest.fn() };
  await echo({ mcpServer: { tool }, toolName: 'echo', log });
  const handler = tool.mock.calls[0][3];
  const result = await handler({ echoText: 'hello' }, {});
  expect(JSON.parse(result.content[0].text)).toEqual({ message: 'echo-reply', data: { text: 'hello' } });
  expect(log.debug).toHaveBeenCalledTimes(2);
});
