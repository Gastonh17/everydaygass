/* Premium micro-quiz + offer copy. Height/weight are not asked. */
(function (root) {
  const RUNNING_LABEL = {
    new: "New to running",
    "5k": "Can run 5K",
    "10k": "Can run 10K",
    endurance: "Endurance base",
    performance: "Endurance base"
  };
  const STRENGTH_LABEL = {
    new: "Beginner strength",
    some: "Some strength experience",
    consistent: "Consistent strength",
    advanced: "Advanced strength"
  };
  const EQUIPMENT_LABEL = {
    full_hyrox: "Full gym + HYROX equipment",
    gym_no_hyrox: "Regular gym, no complete HYROX setup",
    minimal_home: "Home / minimal setup",
    full_gym: "Full gym + HYROX equipment",
    basic_gym: "Regular gym, no complete HYROX setup",
    home_run: "Home / minimal setup",
    mixed: "Regular gym, no complete HYROX setup"
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
  const RESULT_LABEL = {
    daily: "Feel fitter in daily life",
    race: "Arrive ready for a race or event",
    strength: "Get measurably stronger",
    hybrid: "Become more athletic overall",
    consistent: "Stay consistent for 12 weeks"
  };
  const EVENT_LABEL = {
    "4to8": "Event in the next 8 weeks",
    "8to12": "Event in 8–12 weeks",
    later: "Event after 12 weeks",
    none: "No fixed date"
  };
  const LIMIT_LABEL = {
    runAfter: "running after stations",
    sled: "sled push/pull",
    ergs: "ergs",
    grip: "farmers / grip",
    lunges: "lunges",
    wallballs: "wall balls",
    endurance: "overall endurance",
    speed: "running speed",
    strength: "building strength",
    recovery: "recovering better",
    consistency: "staying consistent",
    unsure: "finding a clear focus",
    squat: "squat",
    bench: "bench",
    deadlift: "deadlift",
    upper: "upper-body strength",
    lower: "lower-body strength",
    equal: "keeping strength and running equal",
    running: "running / endurance"
  };

  const UNIVERSAL = [
    {
      id: "result",
      field: "result",
      title: "What result do you want at the end of these 12 weeks?",
      options: [
        ["hybrid", "More athletic overall", "Stronger and fitter together"],
        ["race", "Ready for a race or event", "A date that matters"],
        ["strength", "Get measurably stronger", "Lifts you can track"],
        ["daily", "Feel fitter day to day", "Stairs, work, life"],
        ["consistent", "Stay consistent", "Twelve weeks, not two"]
      ]
    },
    {
      id: "eventWindow",
      field: "eventWindow",
      title: "Do you have a race or event date?",
      options: [
        ["none", "No fixed date", "Progress first"],
        ["4to8", "In the next 8 weeks", "We’ll respect the calendar"],
        ["8to12", "In 8–12 weeks", "Fits this block"],
        ["later", "Later than 12 weeks", "This block is the base"]
      ]
    },
    {
      id: "runningVolume",
      field: "runningVolume",
      title: "How much are you currently running per week?",
      options: [
        ["starting", "Just getting started", "Walk-run is honest"],
        ["under10", "Under 10 km", "A light base"],
        ["10to20", "10–20 km", "A weekly habit"],
        ["20to40", "20–40 km", "Solid volume"],
        ["over40", "40+ km", "High mileage"]
      ]
    },
    {
      id: "sessionMinutes",
      field: "sessionMinutes",
      title: "How long can a normal session realistically be?",
      options: [
        ["30", "About 30 minutes", "Short and honest"],
        ["45", "About 45 minutes", "The usual fit"],
        ["60", "About 60 minutes", "Room to train"],
        ["75", "About 75 minutes", "Only if this is real"],
        ["90", "90 minutes or more", "Long-session capacity"]
      ]
    },
    {
      id: "benchmark",
      field: "benchmark",
      optional: true,
      title: "What's your most useful current benchmark?",
      options: [
        ["none", "I don’t have one", "We’ll use feeling and RIR"],
        ["5k", "A 5K time", "Recent race or time trial"],
        ["lift", "A main lift number", "Squat, bench or deadlift"],
        ["hyrox", "A HYROX or station result", "Useful if you have one"]
      ]
    }
  ];

  const FOCUS = {
    running: {
      id: "runningTarget",
      field: "runningTarget",
      title: "What is your target distance or outcome?",
      options: [
        ["first5k", "First 5K", "Finish in control"],
        ["5k", "5K time", "A faster 5K"],
        ["10k", "10K", "Prepare for 10K"],
        ["half", "Half Marathon", "Sustainable long-run work"],
        ["performance", "General performance", "No assumed race"]
      ]
    },
    hyrox: {
      id: "limitingFactor",
      field: "limitingFactor",
      title: "What currently limits you most?",
      options: [
        ["runAfter", "Running after stations", "Compromised running"],
        ["sled", "Sled push / pull", "The heavy work"],
        ["ergs", "Ergs", "Ski and row"],
        ["grip", "Farmers / grip", "Carries fade me"],
        ["lunges", "Lunges", "The station that sticks"],
        ["wallballs", "Wall balls", "The last station"],
        ["endurance", "Overall endurance", "I fade too soon"]
      ]
    },
    strength: {
      id: "limitingFactor",
      field: "limitingFactor",
      title: "What matters most in these 12 weeks?",
      options: [
        ["strength", "General strength", "Get stronger overall"],
        ["squat", "Squat", "The main lower lift"],
        ["bench", "Bench", "The main press"],
        ["deadlift", "Deadlift", "The main hinge"],
        ["upper", "Upper-body strength", "Press and pull"],
        ["lower", "Lower-body strength", "Squat and hinge"]
      ]
    },
    balanced: {
      id: "limitingFactor",
      field: "limitingFactor",
      title: "Which side currently needs more attention?",
      options: [
        ["running", "Running / endurance", "The engine"],
        ["strength", "Strength", "The lifts"],
        ["equal", "Equal", "Keep both moving"]
      ]
    }
  };

  const QUESTIONS = UNIVERSAL.concat([FOCUS.hyrox]);

  const PREMIUM_ITEMS = [
    "Personalized plan + calendar",
    "App access, guidance, videos",
    "Consulting and support via chat for the entire duration of the plan, with dedicated time slots",
    "My FIT Cookbook"
  ];

  const OFFER_ITEMS = [
    "Complete 12-week training schedule",
    "Sessions adapted to your level, goal and equipment",
    "Running progression",
    "Strength progression",
    "HYROX / hybrid sessions where they belong",
    "Exercise substitutions already applied",
    "Mobile access",
    "Downloadable training plan",
    "Structured BUILD / PROGRESS / PERFORM blocks"
  ];

  function questionsFor(state, quiz1 = {}) {
    const priority = quiz1.priority || state.priority || "balanced";
    return UNIVERSAL.concat([FOCUS[priority] || FOCUS.balanced]);
  }

  function isComplete(state, quiz1) {
    return questionsFor(state, quiz1).every((q) => q.optional || Boolean(state && state[q.field]));
  }

  function build(quiz1 = {}, quiz2 = {}) {
    const days = Number(quiz1.daysPerWeek);
    const equipment = quiz1.equipmentProfile || quiz1.trainingAccess || null;
    return {
      trainingDays: Number.isFinite(days) ? days : null,
      priority: quiz1.priority || null,
      runningLevel: quiz1.runningBase || null,
      strengthLevel: quiz1.strengthBase || null,
      equipment,
      equipmentProfile: equipment,
      level: quiz1.level || null,
      runningGoal: quiz1.runningGoal || null,
      runningVolume: quiz2.runningVolume || null,
      target: quiz2.result || quiz2.target || null,
      result: quiz2.result || null,
      limitation: quiz2.limitingFactor || quiz2.limitation || quiz2.runningTarget || null,
      limitingFactor: quiz2.limitingFactor || quiz2.limitation || null,
      success: quiz2.result || quiz2.success || null,
      sessionMinutes: quiz2.sessionMinutes ? Number(quiz2.sessionMinutes) : null,
      eventWindow: quiz2.eventWindow || null,
      eventDate: quiz2.eventWindow || null,
      benchmark: quiz2.benchmark || null
    };
  }

  function label(map, key, fallback = "") {
    return (key && map[key]) || fallback;
  }

  function summaryLines(profile) {
    const lines = [];
    if (profile.trainingDays) lines.push(`${profile.trainingDays} training days per week`);
    if (profile.priority) lines.push(label(PRIORITY_LABEL, profile.priority));
    if (profile.level) lines.push(`${profile.level[0].toUpperCase()}${profile.level.slice(1)} overall`);
    if (profile.runningLevel) lines.push(label(RUNNING_LABEL, profile.runningLevel));
    if (profile.strengthLevel) lines.push(label(STRENGTH_LABEL, profile.strengthLevel));
    if (profile.equipment) lines.push(label(EQUIPMENT_LABEL, profile.equipment));
    if (profile.runningVolume) lines.push(label(VOLUME_LABEL, profile.runningVolume));
    if (profile.eventWindow && profile.eventWindow !== "none") lines.push(label(EVENT_LABEL, profile.eventWindow));
    if (profile.sessionMinutes) lines.push(`${profile.sessionMinutes}-minute sessions`);
    if (profile.limitation) lines.push(`Main limitation / target: ${label(LIMIT_LABEL, profile.limitation, profile.limitation)}`);
    if (profile.result) lines.push(label(RESULT_LABEL, profile.result));
    return lines;
  }

  function roadmap(profile = {}) {
    if (root.EGRoadmap) return root.EGRoadmap.blocks(profile);
    return [
      { weeks: "Weeks 1–4", title: "BUILD", detail: "Learn movement and pacing." },
      { weeks: "Weeks 5–8", title: "PROGRESS", detail: "Increase quality or duration." },
      { weeks: "Weeks 9–12", title: "PERFORM", detail: "Specificity and a clear finish." }
    ];
  }

  function substitutions(profile = {}) {
    const eq = profile.equipmentProfile || profile.equipment;
    if (eq === "minimal_home" || eq === "home_run") {
      return "Home / minimal: bodyweight, bands and dumbbell swaps. No silent cable or sled work.";
    }
    if (eq === "gym_no_hyrox" || eq === "basic_gym" || eq === "mixed") {
      return "Regular gym: HYROX stations use stimulus-preserving alternatives. No specialist kit required.";
    }
    return "Full HYROX gym: race-load examples use official totals, including the sled.";
  }

  const api = {
    QUESTIONS,
    UNIVERSAL,
    FOCUS,
    OFFER_ITEMS,
    PREMIUM_ITEMS,
    NEEDS_EVENT: ["race"],
    RUNNING_LABEL,
    STRENGTH_LABEL,
    EQUIPMENT_LABEL,
    PRIORITY_LABEL,
    VOLUME_LABEL,
    RESULT_LABEL,
    LIMIT_LABEL,
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
