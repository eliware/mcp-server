export function buildResponse(data: unknown): { content: [{ type: "text"; text: string }] };
export function convertBigIntToString<T>(value: T): T extends bigint ? string : unknown;
