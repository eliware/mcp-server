export function withCycleCheck(value, ancestors, convert) {
  if (ancestors.has(value)) throw new TypeError("Cannot convert circular data to a response");
  ancestors.add(value);
  try {
    return convert();
  } finally {
    ancestors.delete(value);
  }
}
