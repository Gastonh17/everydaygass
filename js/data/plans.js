(function (root) {
  const ex = (name, prescription, extra = {}) => ({ name, prescription, ...extra });

  const DISCLAIMER =
    "This free week is general hybrid training for healthy adults. It is not medical, physiotherapy or individualized clinical advice. If you have pain, injury, medical restriction or pregnancy, get professional clearance before you train.";

  const WARM_RUN = [ex("Walk or easy jog", "3 min")];
  const COOL = [ex("Easy walk", "3 min"), ex("Hip 90/90 + couch stretch", "2 x 30s/side")];
  const WARM_LIFT = [ex("Bike, row or brisk walk", "4 min"), ex("Bodyweight squat + hinge + push-up", "1 x 8 each")];

  const squat = ex("Goblet squat", "3 x 8", { notes: "Own the depth. Last 2 reps honest, not ugly.", videoUrl: "https://www.youtube.com/embed/Me-4v2t0aU8" });
  const hinge = ex("Romanian deadlift (DB or bar)", "3 x 8", { notes: "Soft knees, long spine.", videoUrl: "https://www.youtube.com/embed/jEy_czb3RKA" });
  const push = ex("Push-up or DB bench", "3 x 8", { notes: "Knees ok. Ribs down." });
  const pull = ex("One-arm row or cable row", "3 x 8/side");
  const lunge = ex("Reverse lunge", "2 x 8/leg");
  const carry = ex("Farmer or suitcase carry", "3 x 30m");
  const core = ex("Dead bug + plank", "2 rounds · 8/side + 30s");

  function session(day, title, type, durationMin, intensity, main, extra = {}) {
    return { day, title, type, durationMin, intensity, main, warmup: extra.warmup, cooldown: extra.cooldown, coachNote: extra.coachNote };
  }

  const easyRun = (day, min = 30) =>
    session(day, "Easy run", "run", min, "Easy · RPE 3–4 · you can talk", [
      ex("Continuous easy run or walk-run", `${min - 8} min`, { notes: "If you cannot speak a sentence, slow down." })
    ], { warmup: WARM_RUN, cooldown: COOL, coachNote: "Aerobic base. Finish like you could do a little more." });

  const qualityRun = (day) =>
    session(day, "Quality run", "run", 35, "Moderate · RPE 5–6", [
      ex("Easy 8 min", "warm-up"),
      ex("6 x 1 min slightly quicker / 1 min easy", "12 min", { notes: "Quick, not a sprint." }),
      ex("Easy 6 min", "cool-down")
    ], { warmup: WARM_RUN, coachNote: "Practice pace. Do not race this week." });

  const longRun = (day) =>
    session(day, "Longer easy run", "run", 42, "Easy · RPE 3–4", [
      ex("Easy continuous run or walk-run", "35 min")
    ], { warmup: WARM_RUN, cooldown: COOL, coachNote: "Time on feet. Pride is finishing easy." });

  const fullStrength = (day, title = "Full-body strength") =>
    session(day, title, "strength", 45, "Moderate · RPE 6–7", [squat, hinge, push, pull, lunge, carry, core], {
      warmup: WARM_LIFT,
      cooldown: COOL,
      coachNote: "Leave 1–2 reps in the tank. Strength supports the running."
    });

  const lower = (day) =>
    session(day, "Strength — lower", "strength", 45, "Moderate · RPE 6–7", [
      squat,
      hinge,
      lunge,
      ex("Calf raise", "3 x 10"),
      carry,
      core
    ], { warmup: WARM_LIFT, coachNote: "Legs that last. Not a max-out day." });

  const upper = (day) =>
    session(day, "Strength — upper", "strength", 40, "Moderate · RPE 6–7", [
      push,
      pull,
      ex("Overhead press or pike push-up", "3 x 6–8"),
      ex("Face pull or band pull-apart", "3 x 12"),
      carry,
      core
    ], { warmup: WARM_LIFT });

  const hybrid = (day) =>
    session(day, "Hybrid conditioning", "hyrox", 35, "Moderate · RPE 6", [
      ex("4–5 rounds", "10 goblet squat · 8 push-up · 10 RDL · 40s easy row/bike", { rest: "60–90s" }),
      core
    ], { warmup: WARM_LIFT, cooldown: COOL, coachNote: "Mixed work. Stay smooth." });

  const hyroxEngine = (day) =>
    session(day, "HYROX engine", "hyrox", 40, "Moderate · RPE 6–7", [
      ex("Easy run or row", "6 min"),
      ex("4 rounds", "400 m jog · 10 squat · 8 push-up · 6 burpee · 20 m carry", { rest: "90s" })
    ], { warmup: WARM_LIFT, cooldown: COOL, coachNote: "Race flavour without elite volume." });

  const hyroxStations = (day) =>
    session(day, "HYROX stations + run", "hyrox", 38, "Moderate · RPE 6", [
      ex("Easy 8 min run", "warm-up"),
      ex("3 rounds", "250 m run · 12 lunges · 10 DB deadlift · 8 wall-ball or squat-to-press", { rest: "75s" })
    ], { cooldown: COOL });

  const strengthHyrox = (day) =>
    session(day, "Strength + HYROX finish", "strength", 45, "Moderate · RPE 6–7", [
      squat, hinge, push, pull,
      ex("Sled push substitute: hard bike/row", "5 x 20s on / 40s easy"),
      carry
    ], { warmup: WARM_LIFT, coachNote: "Lift first. Conditioning after, not instead." });

  const mobility = (day) =>
    session(day, "Mobility & recover", "mobility", 25, "Easy · RPE 2–3", [
      ex("90/90 hip switches", "2 x 8/side"),
      ex("World’s greatest stretch", "2 x 5/side"),
      ex("Couch stretch", "2 x 45s/side"),
      ex("Nasal breathing, lying down", "3 min")
    ], { coachNote: "Leave the week better than you found it." });

  const recovery = (day) =>
    session(day, "Rest or easy walk", "recovery", 20, "Easy", [
      ex("Optional 20 min easy walk", "Zone 1")
    ], { coachNote: "Complete rest is allowed. Walking counts." });

  const BUILDERS = {
    easyRun, qualityRun, longRun, fullStrength, fullStrength2: (d) => fullStrength(d, "Full-body strength B"),
    lower, upper, hybrid, hyroxEngine, hyroxStations, strengthHyrox, mobility, recovery,
    easyRun2: (d) => easyRun(d, 28)
  };

  const LAYOUTS = {
    running: {
      3: ["easyRun", "fullStrength", "qualityRun"],
      4: ["easyRun", "fullStrength", "qualityRun", "easyRun2"],
      5: ["easyRun", "fullStrength", "qualityRun", "fullStrength2", "longRun"],
      6: ["easyRun", "fullStrength", "qualityRun", "easyRun2", "fullStrength2", "longRun"],
      7: ["easyRun", "fullStrength", "qualityRun", "easyRun2", "fullStrength2", "longRun", "mobility"]
    },
    strength: {
      3: ["lower", "easyRun", "upper"],
      4: ["lower", "easyRun", "upper", "hybrid"],
      5: ["lower", "easyRun", "upper", "hybrid", "fullStrength"],
      6: ["lower", "easyRun", "upper", "hybrid", "fullStrength", "easyRun2"],
      7: ["lower", "easyRun", "upper", "hybrid", "fullStrength", "easyRun2", "mobility"]
    },
    balanced: {
      3: ["easyRun", "fullStrength", "hybrid"],
      4: ["easyRun", "fullStrength", "hybrid", "qualityRun"],
      5: ["easyRun", "fullStrength", "hybrid", "qualityRun", "fullStrength2"],
      6: ["easyRun", "fullStrength", "hybrid", "qualityRun", "fullStrength2", "easyRun2"],
      7: ["easyRun", "fullStrength", "hybrid", "qualityRun", "fullStrength2", "easyRun2", "mobility"]
    },
    hyrox: {
      3: ["hyroxEngine", "easyRun", "strengthHyrox"],
      4: ["hyroxEngine", "easyRun", "strengthHyrox", "qualityRun"],
      5: ["hyroxEngine", "easyRun", "strengthHyrox", "qualityRun", "hyroxStations"],
      6: ["hyroxEngine", "easyRun", "strengthHyrox", "qualityRun", "hyroxStations", "easyRun2"],
      7: ["hyroxEngine", "easyRun", "strengthHyrox", "qualityRun", "hyroxStations", "easyRun2", "mobility"]
    }
  };

  const SLOTS = {
    3: [1, 3, 5],
    4: [1, 2, 4, 6],
    5: [1, 2, 3, 5, 6],
    6: [1, 2, 3, 4, 5, 6],
    7: [1, 2, 3, 4, 5, 6, 7]
  };

  const COPY = {
    running: {
      subtitle: "More engine. Strength stays in the week so you don’t become a fragile runner.",
      intro: "This week biases running without dropping lifting. Easy work does most of the volume. One quality session is enough.",
      guidance: ["Keep easy days easy.", "Strength is there to support the run, not to crush you.", "If life hits, skip the quality run before you skip an easy run."]
    },
    strength: {
      subtitle: "Get stronger without abandoning the aerobic engine.",
      intro: "Lower and upper (or full-body) do the heavy work. Easy running keeps you athletic. Conditioning is extra, not the point.",
      guidance: ["Leave reps in the tank.", "Easy run is still training.", "Do not add random HIIT on rest days."]
    },
    balanced: {
      subtitle: "Run. Lift. Condition. Recover. Equal claim on the week.",
      intro: "A hybrid week you can repeat. Running and strength share the load. Mixed work sits in the middle, not every day.",
      guidance: ["Complete the week; don’t chase perfection.", "Match the RPE, not your ego.", "Recovery days are part of the plan."]
    },
    hyrox: {
      subtitle: "Race-specific flavour without training like an elite.",
      intro: "Stations and mixed work get a vote. You still lift and you still run easy. This is a start, not a race block.",
      guidance: ["Smooth rounds beat ugly sprints.", "Strength first when the session is mixed.", "Walk the recoveries. That is the point."]
    }
  };

  const TITLE_WORD = { running: "Running Priority", strength: "Strength Priority", balanced: "Balanced", hyrox: "HYROX Priority" };

  function buildPlan(priority, daysPerWeek) {
    const keys = LAYOUTS[priority][daysPerWeek];
    const days = SLOTS[daysPerWeek];
    const sessions = [];
    const used = new Set();

    for (let d = 1; d <= 7; d++) {
      const idx = days.indexOf(d);
      if (idx === -1) {
        sessions.push(recovery(d));
        continue;
      }
      const key = keys[idx];
      sessions.push(BUILDERS[key](d));
      used.add(d);
    }

    const recoveryDays = sessions.filter((s) => s.type === "recovery").map((s) => s.day);
    const copy = COPY[priority];

    return {
      id: `${priority}-${daysPerWeek}d`,
      priority,
      daysPerWeek,
      title: `${daysPerWeek}-Day ${TITLE_WORD[priority]} Hybrid Week`,
      subtitle: copy.subtitle,
      intro: copy.intro,
      weeklyGuidance: copy.guidance,
      sessions,
      recoveryDays,
      disclaimer: DISCLAIMER,
      version: 1,
      updatedAt: "2026-08-29"
    };
  }

  const PLANS = {};
  ["running", "strength", "balanced", "hyrox"].forEach((p) => {
    [3, 4, 5, 6, 7].forEach((d) => {
      const plan = buildPlan(p, d);
      PLANS[plan.id] = plan;
    });
  });

  function getPlan(planId) {
    return PLANS[planId] || null;
  }

  function allPlanIds() {
    return Object.keys(PLANS);
  }

  root.EGPlans = { PLANS, getPlan, allPlanIds, DISCLAIMER, buildPlan };
  if (typeof module !== "undefined") module.exports = root.EGPlans;
})(typeof window !== "undefined" ? window : globalThis);
