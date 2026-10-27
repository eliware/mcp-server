import { createAuthorizationUrlOperation } from "./url-operation.mjs";
import { createCodeExchangeOperation } from "./exchange-code.mjs";
import { createAuthorizationStartOperation } from "./start-authorization.mjs";
import { createCallbackExchangeOperation } from "./callback-exchange.mjs";
import { createInMemoryPkceStore } from "../../pkce/store.mjs";

export function createOAuthAuthorizationFlow({
  provider,
  credentials,
  fetchFn = fetch,
  pkceStore = createInMemoryPkceStore(),
}) {
  const authorizationStart = createAuthorizationStartOperation({
    createAuthorizationUrl: createAuthorizationUrlOperation({ provider, credentials }),
    pkceStore,
  });
  const callbackExchange = createCallbackExchangeOperation({
    exchangeAuthorizationCode: createCodeExchangeOperation({ provider, credentials, fetchFn }),
    pkceStore,
  });

  return {
    authorizationUrl: authorizationStart,
    exchangeCode: callbackExchange,
  };
}
