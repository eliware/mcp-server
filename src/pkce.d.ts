export function createPkceState(options?: { randomBytes?: (size: number) => Buffer }): {
  verifier: string;
  state: string;
  challenge: string;
  method: "S256";
};
