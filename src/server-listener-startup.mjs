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
          started = true;
          onListening();
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
      if (started) return Promise.resolve();
      const closed = new Promise((resolve) => {
        try {
          instance.close(resolve);
        } catch {
          resolve();
        }
      });
      if (!settled) {
        settled = true;
        reject(error);
      }
      return closed;
    };
  });
  return { promise, cancel: (error) => cancel?.(error) };
}
