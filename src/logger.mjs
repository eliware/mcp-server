export const stderrLogger = Object.fromEntries(
  ["debug", "info", "warn", "error"].map((level) => [level, (...args) => console.error(...args)]),
);
