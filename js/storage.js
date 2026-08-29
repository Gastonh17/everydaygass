(function (root) {
  const KEY = "hybridFreeWeek:v1";

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch { return {}; }
  }

  function write(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
    return state;
  }

  function patch(partial) {
    return write({ ...read(), ...partial, updatedAt: Date.now() });
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  root.EGStorage = { KEY, read, write, patch, clear };
})(typeof window !== "undefined" ? window : globalThis);
