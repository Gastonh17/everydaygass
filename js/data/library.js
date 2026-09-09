/* Movement library, equipment substitutions, just-in-time explanations. */
(function (root) {
  const EXPLANATIONS = {
    rir: "2 RIR = stop the set when you believe you could still perform about 2 technically clean reps.",
    oneRM: "1RM = One-Repetition Maximum: the heaviest load you can lift for one technically clean repetition. Percentages are a starting estimate; RIR decides whether the load is correct.",
    controlledAccel: "Controlled acceleration = gradually speed up to a fast but relaxed pace, then recover fully. It is not an all-out sprint.",
    raceLoad: "Race Load = the official load for your HYROX category. When a Sled Push/Pull example is shown, the stated total includes the sled.",
    zones: "Use the Running Zones Calculator to set your personal zones. The plan uses your zones, not any example pace."
  };

  const CORE = {
    beginner: [
      { name: "Dead Bug", reps: "8 / side", hold: null },
      { name: "Front Plank", reps: "20–30 sec", hold: true },
      { name: "Side Plank", reps: "15–20 sec / side", hold: true },
      { name: "Controlled crunch", reps: "10" }
    ],
    intermediate: [
      { name: "V-Ups", reps: "8–10" },
      { name: "Front Plank", reps: "30–40 sec", hold: true },
      { name: "Side Plank", reps: "25–30 sec / side", hold: true },
      { name: "Pallof Press", reps: "8 / side" }
    ],
    advanced: [
      { name: "Hanging Knee Raise", reps: "8–10" },
      { name: "Front Plank", reps: "40–50 sec", hold: true },
      { name: "Dumbbell Side Bend", reps: "8 / side" },
      { name: "Pallof Press", reps: "10 / side" }
    ]
  };

  const STRENGTH = {
    squatPattern: {
      beginner: { full_hyrox: "Leg Press", gym_no_hyrox: "Leg Press or Assisted Box Squat", minimal_home: "Sit-to-stand squat to a chair" },
      intermediate: { full_hyrox: "Goblet Squat", gym_no_hyrox: "Goblet Squat / Front-loaded Squat", minimal_home: "Goblet Squat or backpack squat" },
      advanced: { full_hyrox: "Back Squat", gym_no_hyrox: "Back Squat or Goblet Squat", minimal_home: "Loaded backpack squat" }
    },
    hingePattern: {
      beginner: { full_hyrox: "Cable Pull-Through", gym_no_hyrox: "Cable Pull-Through or light DB Romanian Deadlift", minimal_home: "Hip hinge good morning" },
      intermediate: { full_hyrox: "DB Romanian Deadlift", gym_no_hyrox: "DB Romanian Deadlift", minimal_home: "DB or backpack Romanian Deadlift" },
      advanced: { full_hyrox: "Romanian Deadlift", gym_no_hyrox: "Romanian Deadlift", minimal_home: "DB Romanian Deadlift" }
    },
    horizontalPush: {
      beginner: { full_hyrox: "Chest Press Machine", gym_no_hyrox: "Chest Press Machine", minimal_home: "Kneeling or elevated push-up" },
      intermediate: { full_hyrox: "DB Bench Press", gym_no_hyrox: "DB Bench Press", minimal_home: "Push-up or DB floor press" },
      advanced: { full_hyrox: "Barbell Bench Press", gym_no_hyrox: "Barbell Bench Press or DB Bench Press", minimal_home: "Deficit push-up or heavy DB floor press" }
    },
    horizontalPull: {
      beginner: { full_hyrox: "Seated Machine Row", gym_no_hyrox: "Seated Machine Row", minimal_home: "Band row or backpack row" },
      intermediate: { full_hyrox: "Cable Row", gym_no_hyrox: "Cable Row", minimal_home: "One-arm DB row" },
      advanced: { full_hyrox: "Chest-Supported Row", gym_no_hyrox: "Chest-Supported Row or Barbell Row", minimal_home: "Heavy one-arm DB row" }
    },
    verticalPull: {
      beginner: { full_hyrox: "Lat Pulldown", gym_no_hyrox: "Lat Pulldown", minimal_home: "Band pulldown or towel door row" },
      intermediate: { full_hyrox: "Lat Pulldown / Assisted Pull-Up", gym_no_hyrox: "Lat Pulldown / Assisted Pull-Up", minimal_home: "Band pulldown" },
      advanced: { full_hyrox: "Pull-Up", gym_no_hyrox: "Pull-Up or heavy pulldown", minimal_home: "Band-assisted pull-up or heavy door row" }
    },
    singleLeg: {
      beginner: { full_hyrox: "Supported Reverse Lunge", gym_no_hyrox: "Supported Reverse Lunge / Step-Up", minimal_home: "Supported reverse lunge to a chair" },
      intermediate: { full_hyrox: "Reverse Lunge", gym_no_hyrox: "Reverse Lunge / Bulgarian Split Squat", minimal_home: "Reverse lunge" },
      advanced: { full_hyrox: "Loaded split squat", gym_no_hyrox: "Loaded split squat / walking lunge", minimal_home: "DB reverse lunge" }
    },
    shoulderPress: {
      beginner: { full_hyrox: "Seated DB Press", gym_no_hyrox: "Seated DB Press", minimal_home: "Pike push-up or seated DB press" },
      intermediate: { full_hyrox: "Standing DB Press", gym_no_hyrox: "Standing DB Press", minimal_home: "Standing DB Press" },
      advanced: { full_hyrox: "Military Press", gym_no_hyrox: "Military Press or DB Press", minimal_home: "DB Military Press" }
    },
    isolationLeg: {
      beginner: { full_hyrox: "Seated Leg Curl", gym_no_hyrox: "Seated Leg Curl", minimal_home: "Slider or towel hamstring curl" },
      intermediate: { full_hyrox: "Lying Leg Curl", gym_no_hyrox: "Lying or seated Leg Curl", minimal_home: "Slider hamstring curl" },
      advanced: { full_hyrox: "Leg Curl", gym_no_hyrox: "Leg Curl", minimal_home: "Single-leg slider curl" }
    }
  };

  const CONSTRAINT_SWAPS = {
    impact: {
      "Reverse Lunge": "Step-Up (controlled)",
      "Loaded split squat": "Step-Up (controlled)",
      "Bulgarian Split Squat": "Supported Step-Up"
    },
    knee: {
      "Goblet Squat": "Leg Press (pain-free range)",
      "Back Squat": "Leg Press (pain-free range)",
      "Reverse Lunge": "Supported Step-Up",
      "Supported Reverse Lunge": "Supported Step-Up",
      "Loaded split squat": "Leg Press or Step-Up"
    },
    hinge_back: {
      "Romanian Deadlift": "Cable Pull-Through or light hip hinge",
      "DB Romanian Deadlift": "Cable Pull-Through or glute bridge",
      "Deadlift": "Hip hinge with light load"
    },
    overhead: {
      "Military Press": "Landmine press or incline DB press",
      "Standing DB Press": "Incline DB press",
      "Seated DB Press": "Chest Press Machine"
    }
  };

  const HYROX_SUBS = {
    ski: {
      full_hyrox: "SkiErg",
      gym_no_hyrox: "Cardio interval + straight-arm cable pulldown",
      minimal_home: "Band pulldown + marching in place"
    },
    sled_push: {
      full_hyrox: "Sled Push",
      gym_no_hyrox: "Heavy leg press or steep treadmill power walk",
      minimal_home: "Incline outdoor power walk or squat-to-drive"
    },
    sled_pull: {
      full_hyrox: "Sled Pull",
      gym_no_hyrox: "Heavy cable row / rope-style cable pull",
      minimal_home: "Band row or DB row density block"
    },
    bbj: {
      full_hyrox: "Burpee Broad Jump",
      gym_no_hyrox: "Burpee + controlled forward jump",
      minimal_home: "Burpee step-back (no jump if needed)"
    },
    row: {
      full_hyrox: "RowErg",
      gym_no_hyrox: "Bike or treadmill cardio interval",
      minimal_home: "High-knee march or easy run"
    },
    farmers: {
      full_hyrox: "Farmers Carry",
      gym_no_hyrox: "Heavy dumbbell carry",
      minimal_home: "Suitcase carry or loaded march"
    },
    lunges: {
      full_hyrox: "Sandbag Lunges",
      gym_no_hyrox: "DB front-rack / goblet lunges",
      minimal_home: "Bodyweight or DB reverse lunges"
    },
    wall_ball: {
      full_hyrox: "Wall Ball",
      gym_no_hyrox: "DB thruster or medicine-ball squat-to-press",
      minimal_home: "DB thruster / squat-to-reach"
    }
  };

  function equipKey(ctx) {
    return ctx.equipmentProfile || "gym_no_hyrox";
  }

  function levelKey(ctx) {
    if (ctx.strengthBase === "new" || ctx.level === "beginner") return "beginner";
    if (ctx.strengthBase === "advanced" && ctx.level === "advanced") return "advanced";
    if (ctx.level === "advanced" && (ctx.strengthBase === "consistent" || ctx.strengthBase === "advanced")) return "advanced";
    if (ctx.level === "beginner") return "beginner";
    return "intermediate";
  }

  function applyConstraint(name, ctx) {
    const tags = ctx.constraintTags || [];
    let out = name;
    const applied = [];
    tags.forEach((tag) => {
      const map = CONSTRAINT_SWAPS[tag];
      if (map && map[out]) {
        applied.push(tag);
        out = map[out];
      }
    });
    return { name: out, applied };
  }

  function resolveExercise(slot, ctx) {
    const table = STRENGTH[slot];
    if (!table) return { name: slot, substitutionsApplied: [] };
    const level = levelKey(ctx);
    const raw = table[level][equipKey(ctx)] || table[level].gym_no_hyrox;
    const swapped = applyConstraint(raw, ctx);
    return { name: swapped.name, substitutionsApplied: swapped.applied };
  }

  function resolveHyroxStation(intent, ctx) {
    const row = HYROX_SUBS[intent];
    if (!row) return { name: intent, substituted: false, intent };
    const name = row[equipKey(ctx)] || row.gym_no_hyrox;
    return {
      name,
      substituted: equipKey(ctx) !== "full_hyrox",
      intent,
      official: row.full_hyrox
    };
  }

  function corePair(ctx, sessionIndex) {
    const pack = CORE[ctx.level === "advanced" ? "advanced" : ctx.level === "beginner" ? "beginner" : "intermediate"];
    const a = pack[sessionIndex % pack.length];
    const b = pack[(sessionIndex + 1) % pack.length];
    return [a, b].slice(0, ctx.level === "beginner" ? 2 : 2);
  }

  function forbiddenEquipment(ctx) {
    if (equipKey(ctx) === "minimal_home") {
      return /cable|machine|sled|lat pulldown|leg press|ski\s*erg|row\s*erg|wall ball(?!s? \/)|barbell/i;
    }
    if (equipKey(ctx) === "gym_no_hyrox") {
      return /skierg|rowerg|sled push|sled pull|sandbag lunges|^wall ball$/i;
    }
    return null;
  }

  const api = {
    EXPLANATIONS,
    CORE,
    STRENGTH,
    HYROX_SUBS,
    resolveExercise,
    resolveHyroxStation,
    corePair,
    levelKey,
    equipKey,
    forbiddenEquipment
  };
  root.EGLibrary = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
