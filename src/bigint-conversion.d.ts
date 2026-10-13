export function convertBigIntToString<T>(value: T): T extends bigint ? string : unknown;
