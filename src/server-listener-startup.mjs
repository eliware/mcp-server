export function waitForListener(instance, port, onListening, onRuntimeError) {
  let cancel;
  const promise = new Promise((resolve, reject) => {
    let settled = false;
    let started = false;
    const onError = (error) => {
      if (started) {
        onRuntimeError(error);
        return;
      }
      settled = true;
      instance.removeListener("error", onError);
      reject(error);
    };
    instance.on("error", onError);
    try {
      instance.listen(port, () => {
        if (settled) {
          instance.close(() => {});
          return;
        }
        settled = true;
        try {
          onListening();
          started = true;
          resolve();
        } catch (error) {
          instance.removeListener("error", onError);
          reject(error);
        }
      });
    } catch (error) {
      onError(error);
    }
    cancel = (error) => {
      instance.removeListener("error", onError);
      if (started) return;
      try {
        instance.close(() => {});
      } catch {}
      if (!settled) {
        settled = true;
        reject(error);
      }
    };
  });
  return { promise, cancel: (error) => cancel?.(error) };
}
