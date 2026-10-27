export function createAuthorizationStartOperation({ createAuthorizationUrl, pkceStore }) {
  return async function authorizationUrl(options = {}) {
    if (typeof options.sessionState !== "string" || !options.sessionState)
      throw new Error("OAuth session state is required");
    const authorization = createAuthorizationUrl(options);
    await pkceStore.save(authorization.state, {
      verifier: authorization.codeVerifier,
      sessionState: options.sessionState,
    });
    return { url: authorization.url, state: authorization.state };
  };
}
