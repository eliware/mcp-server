export type PkceRecord = { verifier: string; sessionState: string };
export function createPkceStore(options: {
  save(state: string, record: PkceRecord): void | Promise<void>;
  consume(state: string): PkceRecord | undefined | Promise<PkceRecord | undefined>;
}): {
  save(state: string, record: PkceRecord): void | Promise<void>;
  consume(state: string): PkceRecord | undefined | Promise<PkceRecord | undefined>;
};
export function createInMemoryPkceStore(): {
  save: (state: string, record: PkceRecord) => Promise<void>;
  consume: (state: string) => PkceRecord | undefined;
};
export function consumePkceState(options: {
  store: Record<string, Function>;
  state: string;
  expectedState: string;
}): Promise<PkceRecord>;
