/* Compatibility wrapper: 20 plan IDs still resolve. Content now comes from the engine. */
(function (root) {
  if (typeof require !== "undefined") {
    if (!root.EGPlanId) require("../getPlanId.js");
    if (!root.EGEngine) require("../engine/engine.js");
  }

  function defaultProfile(priority, daysPerWeek) {
    return {
      priority,
      daysPerWeek,
      level: "intermediate",
      runningBase: "5k",
      runningGoal: priority === "strength" ? "supportOnly" : "improve5k",
      strengthBase: "some",
      equipmentProfile: "gym_no_hyrox",
      hasConstraints: false,
      week: 1,
      block: 1
    };
  }

  function buildPlan(priority, daysPerWeek) {
    return root.EGEngine.buildFreeWeek(defaultProfile(priority, daysPerWeek));
  }

  const PLANS = {};
  ["running", "strength", "balanced", "hyrox"].forEach((p) => {
    [3, 4, 5, 6, 7].forEach((d) => {
      const plan = buildPlan(p, d);
      if (plan) PLANS[plan.id] = plan;
    });
  });

  function getPlan(planId) {
    return PLANS[planId] || null;
  }

  function allPlanIds() {
    return Object.keys(PLANS);
  }

  root.EGPlans = { PLANS, getPlan, allPlanIds, DISCLAIMER: root.EGEngine.DISCLAIMER, buildPlan };
  if (typeof module !== "undefined") module.exports = root.EGPlans;
})(typeof window !== "undefined" ? window : globalThis);
