export function createPkceStore({ save, consume } = {}) {
  if (typeof save !== "function" || typeof consume !== "function")
    throw new Error("PKCE store requires save and consume functions");
  return { save, consume };
}

export function createInMemoryPkceStore() {
  const records = new Map();
  return createPkceStore({
    save: async (state, record) => records.set(state, record),
    consume: (state, expectedState) => {
      const record = records.get(state);
      if (!record) return undefined;
      if (record.sessionState !== expectedState) return null;
      records.delete(state);
      return record;
    },
  });
}

export async function consumePkceState({ store, state, expectedState } = {}) {
  if (!state || !expectedState) throw new Error("Invalid OAuth state");
  const record = await store.consume(state, expectedState);
  if (record === null) throw new Error("Invalid OAuth state");
  if (!record?.verifier || !record.sessionState) throw new Error("OAuth state expired or unknown");
  return record;
}
