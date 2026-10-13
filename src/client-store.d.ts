export function createClientStore(options: { load: Function; save: Function; remove?: Function }): {
  load: Function;
  save: Function;
  remove: Function;
};
