/* EverydayGass — Quiz 2 profile + 12-week roadmap (post-free-week upsell). */
(function (root) {
  const RUNNING_LABEL = {
    new: "New to running",
    "5k": "Can run 5K",
    "10k": "10K+ regularly",
    performance: "Performance-focused"
  };
  const STRENGTH_LABEL = {
    new: "Beginner strength",
    some: "Some strength experience",
    consistent: "Consistent strength",
    advanced: "Advanced strength"
  };
  const EQUIPMENT_LABEL = {
    full_gym: "Full gym",
    basic_gym: "Basic gym",
    home_run: "Home + running",
    mixed: "Mixed equipment"
  };
  const PRIORITY_LABEL = {
    running: "Running-focused progression",
    strength: "Strength-focused progression",
    balanced: "Balanced hybrid progression",
    hyrox: "HYROX-focused progression"
  };
  const VOLUME_LABEL = {
    starting: "Just getting started with running",
    under10: "Under 10 km/week",
    "10to20": "10–20 km/week",
    "20to40": "20–40 km/week",
    over40: "40+ km/week"
  };
  const TARGET_LABEL = {
    hybrid: "General hybrid fitness",
    race: "Running race",
    hyrox: "HYROX preparation",
    triathlon: "Triathlon",
    physique: "Strength / physique",
    other: "A specific personal goal"
  };
  const LIMIT_LABEL = {
    endurance: "improving endurance",
    speed: "improving running speed",
    strength: "building strength",
    recovery: "recovering better",
    consistency: "staying consistent",
    unsure: "finding a clear focus"
  };
  const SUCCESS_LABEL = {
    daily: "Feel fitter in daily life",
    faster: "Run farther or faster",
    stronger: "Get stronger",
    race: "Finish a race or HYROX",
    consistent: "Stay consistent for 12 weeks"
  };
  const EVENT_LABEL = {
    "4to8": "Event in 4–8 weeks",
    "8to12": "Event in 8–12 weeks",
    later: "Event after 12 weeks",
    none: "No fixed date"
  };

  const NEEDS_EVENT = ["race", "hyrox", "triathlon"];

  const QUESTIONS = [
    {
      id: "runningVolume",
      field: "runningVolume",
      title: "How much are you currently running?",
      options: [
        ["starting", "Just getting started", "Walk-run is honest"],
        ["under10", "Under 10 km/week", "A light base"],
        ["10to20", "10–20 km/week", "A weekly habit"],
        ["20to40", "20–40 km/week", "Solid volume"],
        ["over40", "40+ km/week", "High mileage"]
      ]
    },
    {
      id: "target",
      field: "target",
      title: "Are you training toward something specific?",
      options: [
        ["hybrid", "General hybrid fitness", "Stronger, fitter, more athletic"],
        ["race", "Running race", "5K, 10K or longer"],
        ["hyrox", "HYROX", "Race flavour, honest volume"],
        ["triathlon", "Triathlon", "Engine that holds"],
        ["physique", "Strength / physique", "Look and lift better"],
        ["other", "Other", "I’ll keep it personal"]
      ]
    },
    {
      id: "eventWindow",
      field: "eventWindow",
      title: "When is the event?",
      when: (state) => NEEDS_EVENT.includes(state.target),
      options: [
        ["4to8", "In 4–8 weeks", "We’ll respect the calendar"],
        ["8to12", "In 8–12 weeks", "Fits this block"],
        ["later", "Later than 12 weeks", "This block is the base"],
        ["none", "No fixed date", "Progress first"]
      ]
    },
    {
      id: "sessionMinutes",
      field: "sessionMinutes",
      title: "How long can a typical session be?",
      options: [
        ["30", "About 30 minutes", "Short and honest"],
        ["45", "About 45 minutes", "The usual fit"],
        ["60", "About 60 minutes", "Room to train"],
        ["75", "75 minutes or more", "Only if this is real"]
      ]
    },
    {
      id: "limitation",
      field: "limitation",
      title: "What currently holds you back the most?",
      options: [
        ["endurance", "Endurance", "I fade too soon"],
        ["speed", "Running speed", "I want more pace"],
        ["strength", "Strength", "I need to get stronger"],
        ["recovery", "Recovery", "I don’t bounce back"],
        ["consistency", "Consistency", "I start, then I stop"],
        ["unsure", "I’m not sure", "Help me pick a focus"]
      ]
    },
    {
      id: "success",
      field: "success",
      title: "What would make the next 12 weeks a success for you?",
      options: [
        ["daily", "Feel fitter day to day", "Stairs, work, life"],
        ["faster", "Run farther or faster", "A real running step"],
        ["stronger", "Get stronger", "Lifts that stick"],
        ["race", "Finish a race or HYROX", "A date on the calendar"],
        ["consistent", "Stay consistent", "Twelve weeks, not two"]
      ]
    }
  ];

  const PREMIUM_ITEMS = [
    "Personalized plan + calendar",
    "App access, guidance, videos",
    "Consulting and support via chat for the entire duration of the plan, with dedicated time slots",
    "My FIT Cookbook"
  ];

  const OFFER_ITEMS = [
    "Complete 12-week training schedule",
    "Sessions adapted to training frequency",
    "Running progression",
    "Strength progression",
    "Hybrid / conditioning sessions",
    "Exercise instructions",
    "Video demonstrations where available",
    "Mobile access",
    "Downloadable training plan",
    "Structured progression across all 12 weeks"
  ];

  function questionsFor(state) {
    return QUESTIONS.filter((q) => !q.when || q.when(state || {}));
  }

  function isComplete(state) {
    return questionsFor(state).every((q) => Boolean(state && state[q.field]));
  }

  function build(quiz1 = {}, quiz2 = {}) {
    const days = Number(quiz1.daysPerWeek);
    return {
      trainingDays: Number.isFinite(days) ? days : null,
      priority: quiz1.priority || null,
      runningLevel: quiz1.runningBase || null,
      strengthLevel: quiz1.strengthBase || null,
      equipment: quiz1.trainingAccess || null,
      level: quiz1.level || null,
      runningVolume: quiz2.runningVolume || null,
      target: quiz2.target || null,
      limitation: quiz2.limitation || null,
      success: quiz2.success || null,
      sessionMinutes: quiz2.sessionMinutes ? Number(quiz2.sessionMinutes) : null,
      eventWindow: quiz2.eventWindow || null,
      eventDate: quiz2.eventWindow || null
    };
  }

  function label(map, key, fallback = "") {
    return (key && map[key]) || fallback;
  }

  function summaryLines(profile) {
    const lines = [];
    if (profile.trainingDays) lines.push(`${profile.trainingDays} training days per week`);
    if (profile.priority) lines.push(label(PRIORITY_LABEL, profile.priority));
    if (profile.strengthLevel) lines.push(label(STRENGTH_LABEL, profile.strengthLevel));
    if (profile.equipment) lines.push(`${label(EQUIPMENT_LABEL, profile.equipment)} access`);
    if (profile.target) lines.push(label(TARGET_LABEL, profile.target));
    if (profile.sessionMinutes) lines.push(`${profile.sessionMinutes}-minute sessions`);
    if (profile.limitation) lines.push(`Main focus: ${label(LIMIT_LABEL, profile.limitation)}`);
    if (profile.eventWindow && profile.eventWindow !== "none") {
      lines.push(label(EVENT_LABEL, profile.eventWindow));
    }
    return lines;
  }

  function roadmap(profile = {}) {
    const focus = label(LIMIT_LABEL, profile.limitation, "honest progression");
    const byPriority = {
      running: [
        { weeks: "Weeks 1–4", title: "Build your aerobic base", detail: `Easy running volume and strength that supports the engine. First focus: ${focus}.` },
        { weeks: "Weeks 5–8", title: "Increase training volume and intensity", detail: "More running, controlled quality, strength that holds when you’re tired." },
        { weeks: "Weeks 9–12", title: "Performance and progression", detail: "Sharper sessions. Still recoverable. Built around your running goal." }
      ],
      strength: [
        { weeks: "Weeks 1–4", title: "Build your base", detail: `Own the patterns and a running engine that doesn’t fight the lifts. First focus: ${focus}.` },
        { weeks: "Weeks 5–8", title: "Increase training volume and intensity", detail: "Heavier, denser strength. Running stays in the week so you stay athletic." },
        { weeks: "Weeks 9–12", title: "Performance and progression", detail: "Peak the lifts, keep the engine. Twelve weeks, one direction." }
      ],
      hyrox: [
        { weeks: "Weeks 1–4", title: "Build your base", detail: `Stations + easy running you can repeat. First focus: ${focus}.` },
        { weeks: "Weeks 5–8", title: "Increase training volume and intensity", detail: "More race-flavour work, still not elite volume. Strength that transfers." },
        { weeks: "Weeks 9–12", title: "Performance and progression", detail: "Closer to race shape. Compromised work, honest recovery." }
      ],
      balanced: [
        { weeks: "Weeks 1–4", title: "Build your base", detail: `Run, lift, condition — at a load you can recover from. First focus: ${focus}.` },
        { weeks: "Weeks 5–8", title: "Increase training volume and intensity", detail: "More work in the week, still structured. Nothing random." },
        { weeks: "Weeks 9–12", title: "Performance and progression", detail: "The block comes together. Stronger, faster, more athletic." }
      ]
    };
    return byPriority[profile.priority] || byPriority.balanced;
  }

  function substitutions(profile = {}) {
    if (profile.equipment === "home_run") {
      return "Home kit: dumbbell and bodyweight swaps for every lift. Running stays outside.";
    }
    if (profile.equipment === "basic_gym") {
      return "Basic gym: dumbbells, cables, a bench — no machine-only work required.";
    }
    if (profile.equipment === "mixed") {
      return "Mixed access: each session lists a gym version and a minimal-kit backup.";
    }
    return "Full gym: barbell and machine options where they earn their place.";
  }

  const api = {
    QUESTIONS,
    OFFER_ITEMS,
    PREMIUM_ITEMS,
    NEEDS_EVENT,
    RUNNING_LABEL,
    STRENGTH_LABEL,
    EQUIPMENT_LABEL,
    PRIORITY_LABEL,
    VOLUME_LABEL,
    TARGET_LABEL,
    LIMIT_LABEL,
    SUCCESS_LABEL,
    EVENT_LABEL,
    questionsFor,
    isComplete,
    build,
    summaryLines,
    roadmap,
    substitutions,
    label
  };

  root.EGProfile = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
