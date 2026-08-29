(function (root) {
  const PRIORITIES = ["running", "strength", "balanced", "hyrox"];
  const DAYS = [3, 4, 5, 6, 7];

  function getPlanId(priority, days) {
    const d = Number(days);
    if (!PRIORITIES.includes(priority) || !DAYS.includes(d)) return null;
    return `${priority}-${d}d`;
  }

  function parsePlanId(id) {
    if (typeof id !== "string") return null;
    const m = id.match(/^(running|strength|balanced|hyrox)-(3|4|5|6|7)d$/);
    if (!m) return null;
    return { priority: m[1], daysPerWeek: Number(m[2]) };
  }

  root.EGPlanId = { PRIORITIES, DAYS, getPlanId, parsePlanId };
  if (typeof module !== "undefined") module.exports = root.EGPlanId;
})(typeof window !== "undefined" ? window : globalThis);
