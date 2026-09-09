(function (root) {
  if (typeof require !== "undefined" && !root.EGMigrate) {
    require("./quiz/migrateState.js");
  }
  const Migrate = root.EGMigrate;
  const KEY = (Migrate && Migrate.V2) || "hybridFreeWeek:v2";

  if (Migrate && typeof localStorage !== "undefined") Migrate.ensureV2();

  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY)) || {};
      return Migrate ? Migrate.migrate(raw) : raw;
    } catch { return {}; }
  }

  function write(state) {
    const next = Migrate ? Migrate.migrate(state) : state;
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  }

  function patch(partial) {
    return write({ ...read(), ...partial, updatedAt: Date.now() });
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  root.EGStorage = { KEY, read, write, patch, clear };
  if (typeof module !== "undefined") module.exports = root.EGStorage;
})(typeof window !== "undefined" ? window : globalThis);
