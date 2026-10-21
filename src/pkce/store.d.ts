export type PkceRecord = { verifier: string; sessionState: string };
export function createPkceStore(options: {
  save(state: string, record: PkceRecord): void | Promise<void>;
  consume(
    state: string,
    expectedState: string,
  ): PkceRecord | null | undefined | Promise<PkceRecord | null | undefined>;
}): {
  save(state: string, record: PkceRecord): void | Promise<void>;
  consume(
    state: string,
    expectedState: string,
  ): PkceRecord | null | undefined | Promise<PkceRecord | null | undefined>;
};
export function createInMemoryPkceStore(): {
  save: (state: string, record: PkceRecord) => Promise<void>;
  consume: (state: string, expectedState: string) => PkceRecord | null | undefined;
};
export function consumePkceState(options: {
  store: Record<string, Function>;
  state: string;
  expectedState: string;
}): Promise<PkceRecord>;
