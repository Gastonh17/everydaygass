/* Migrate hybridFreeWeek:v1 → v2 without discarding answers. */
(function (root) {
  const V1 = "hybridFreeWeek:v1";
  const V2 = "hybridFreeWeek:v2";

  function migrateEquipment(access) {
    return {
      full_gym: "full_hyrox",
      basic_gym: "gym_no_hyrox",
      home_run: "minimal_home",
      mixed: "gym_no_hyrox",
      full_hyrox: "full_hyrox",
      gym_no_hyrox: "gym_no_hyrox",
      minimal_home: "minimal_home"
    }[access] || access || null;
  }

  function defaultGoal(state) {
    if (state.runningGoal) return state.runningGoal;
    if (state.priority === "strength") return "supportOnly";
    if (state.runningBase === "new") return "first5k";
    if (state.runningBase === "5k") return "improve5k";
    if (state.runningBase === "10k") return "10k";
    if (state.runningBase === "endurance" || state.runningBase === "performance") return "performance";
    return null;
  }

  function migrate(raw = {}) {
    const next = { ...raw };
    if (next.runningBase === "performance") next.runningBase = "endurance";
    if (!next.equipmentProfile) next.equipmentProfile = migrateEquipment(next.trainingAccess);
    if (!next.runningGoal) next.runningGoal = defaultGoal(next);
    if (!Array.isArray(next.constraintTags)) next.constraintTags = [];
    next.schemaVersion = 2;
    return next;
  }

  function readLegacy() {
    try { return JSON.parse(localStorage.getItem(V1) || "null"); }
    catch { return null; }
  }

  function ensureV2() {
    if (typeof localStorage === "undefined") return;
    try {
      if (localStorage.getItem(V2)) return;
      const old = readLegacy();
      if (old && typeof old === "object") {
        localStorage.setItem(V2, JSON.stringify(migrate(old)));
      }
    } catch { /* ignore */ }
  }

  const api = { V1, V2, migrate, migrateEquipment, ensureV2 };
  root.EGMigrate = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
