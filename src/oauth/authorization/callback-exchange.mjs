import { consumePkceState } from "../../pkce/store.mjs";

export function createCallbackExchangeOperation({ exchangeAuthorizationCode, pkceStore }) {
  return async function exchangeCode({ code, redirectUri, state, expectedState }) {
    const { verifier } = await consumePkceState({ store: pkceStore, state, expectedState });
    return exchangeAuthorizationCode({ code, redirectUri, codeVerifier: verifier });
  };
}
