import { createAuthorizationUrlOperation } from "./url-operation.mjs";
import { createCodeExchangeOperation } from "./exchange-code.mjs";
import { consumePkceState, createInMemoryPkceStore } from "../../pkce/store.mjs";

export function createOAuthAuthorizationFlow({
  provider,
  credentials,
  fetchFn = fetch,
  pkceStore = createInMemoryPkceStore(),
}) {
  const createAuthorizationUrl = createAuthorizationUrlOperation({ provider, credentials });
  const exchangeAuthorizationCode = createCodeExchangeOperation({ provider, credentials, fetchFn });

  return {
    async authorizationUrl(options = {}) {
      const authorization = createAuthorizationUrl(options);
      await pkceStore.save(authorization.state, { verifier: authorization.codeVerifier });
      return { url: authorization.url, state: authorization.state };
    },
    async exchangeCode({ code, redirectUri, state, expectedState }) {
      const { verifier } = await consumePkceState({ store: pkceStore, state, expectedState });
      return exchangeAuthorizationCode({ code, redirectUri, codeVerifier: verifier });
    },
  };
}
