(() => {
  const controllerKey = "__pwStudyIntervalController";
  if (window[controllerKey]) return;

  const nativeSetInterval = window.setInterval;
  const nativeClearInterval = window.clearInterval;
  const nativeClearTimeout = window.clearTimeout;
  const intervals = new Map();
  let paused = false;
  let nextId = 1_000_000_000;

  const clearTrackedInterval = (id) => {
    const interval = intervals.get(id);
    if (!interval) return false;

    if (interval.nativeId !== undefined) {
      nativeClearInterval.call(window, interval.nativeId);
    }
    intervals.delete(id);
    return true;
  };

  window.setInterval = function (handler, delay, ...args) {
    const id = nextId++;
    const interval = { handler, delay, args, nativeId: undefined };
    intervals.set(id, interval);

    if (!paused) {
      interval.nativeId = nativeSetInterval.call(window, handler, delay, ...args);
    }

    return id;
  };

  window.clearInterval = function (id) {
    if (!clearTrackedInterval(id)) {
      nativeClearInterval.call(window, id);
    }
  };

  window.clearTimeout = function (id) {
    if (!clearTrackedInterval(id)) {
      nativeClearTimeout.call(window, id);
    }
  };

  Object.defineProperty(window, controllerKey, {
    configurable: false,
    value: {
      isPaused: () => paused,
      toggle: () => {
        paused = !paused;

        for (const interval of intervals.values()) {
          if (paused) {
            if (interval.nativeId !== undefined) {
              nativeClearInterval.call(window, interval.nativeId);
              interval.nativeId = undefined;
            }
          } else if (interval.nativeId === undefined) {
            interval.nativeId = nativeSetInterval.call(
              window,
              interval.handler,
              interval.delay,
              ...interval.args,
            );
          }
        }

        return paused;
      },
    },
  });
})();
