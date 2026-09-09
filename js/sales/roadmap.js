/* Profile-specific 12-week roadmap, locked-week proof, future-session preview. */
(function (root) {
  if (typeof require !== "undefined" && !root.EGEngine) {
    require("../engine/engine.js");
  }

  const GOAL_LABEL = {
    first5k: "First 5K",
    improve5k: "Improve 5K",
    "10k": "10K",
    halfMarathon: "Half Marathon",
    performance: "Running performance",
    supportOnly: "Running as support"
  };

  function progressionExamples(profile = {}) {
    if (profile.runningGoal === "first5k" || (profile.level === "beginner" && profile.runningBase === "new")) {
      return [
        { week: 1, text: "Run/walk intervals — learn the rhythm" },
        { week: 4, text: "Longer continuous run blocks" },
        { week: 8, text: "Continuous easy running + controlled faster sections" },
        { week: 12, text: "Ready to attempt the target 5K" }
      ];
    }
    if (profile.priority === "hyrox" && profile.level === "advanced") {
      return [
        { week: 1, text: "Technique + controlled stations" },
        { week: 5, text: "More Race Load and compromised running" },
        { week: 9, text: "Race-specific sequence" },
        { week: 12, text: "Taper / simulation depending on your event" }
      ];
    }
    if (profile.priority === "strength") {
      return [
        { week: 1, text: "Own the patterns. Leave reps in reserve." },
        { week: 4, text: "Consolidation — same lifts, cleaner execution" },
        { week: 8, text: "Heavier main lifts, rotated accessories" },
        { week: 12, text: "Peak the lifts you can measure" }
      ];
    }
    if (profile.runningGoal === "halfMarathon") {
      return [
        { week: 1, text: "Aerobic volume you can repeat" },
        { week: 4, text: "Longer easy runs, still recoverable" },
        { week: 8, text: "Progressive long runs that finish faster" },
        { week: 12, text: "Taper or benchmark — not two races at once" }
      ];
    }
    return [
      { week: 1, text: "Establish the week you can repeat" },
      { week: 4, text: "Consolidation — less fatigue, same structure" },
      { week: 8, text: "More quality or density, still structured" },
      { week: 12, text: "Specificity and a clear finish" }
    ];
  }

  function blocks(profile = {}) {
    const goal = GOAL_LABEL[profile.runningGoal] || "your goal";
    return [
      {
        weeks: "Weeks 1–4",
        title: "BUILD",
        detail: `Learn movement and pacing. Establish a baseline you can recover from. First target: ${goal}. Week 4 consolidates.`
      },
      {
        weeks: "Weeks 5–8",
        title: "PROGRESS",
        detail: "Increase running quality or duration, strength intensity, and HYROX density where it belongs. Week 8 consolidates."
      },
      {
        weeks: "Weeks 9–12",
        title: "PERFORM",
        detail: "More specific. Less junk volume. Rehearse target pace or race order. Week 12 tapers if you have an event."
      }
    ];
  }

  function lockedWeeks(profile, premium = {}) {
    if (!root.EGEngine) return [];
    return root.EGEngine.build12WeekSummaries(profile, premium).slice(1);
  }

  function preview(profile, premium = {}) {
    if (!root.EGEngine) return null;
    return root.EGEngine.futurePreview(profile, premium);
  }

  const api = { GOAL_LABEL, progressionExamples, blocks, lockedWeeks, preview };
  root.EGRoadmap = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
