export function handleJsonError(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err)
    return res.status(406).json({ error: "Invalid JSON" });
  return next(err);
}
