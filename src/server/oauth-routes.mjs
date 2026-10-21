import { mountOAuthResourceMetadata } from "../oauth/resource-metadata.mjs";

export function mountOAuthRoutes({ app, auth }) {
  if (auth?.mode === "oauth2") mountOAuthResourceMetadata(app, auth);
}
