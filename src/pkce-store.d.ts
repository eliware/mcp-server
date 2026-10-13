export function createPkceStore(options: { save: Function; load: Function; remove?: Function }): {
  save: Function;
  load: Function;
  remove: Function;
};
export function consumePkceState(options: {
  store: Record<string, Function>;
  state: string;
  expectedState: string;
}): Promise<Record<string, unknown>>;
