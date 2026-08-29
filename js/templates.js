/* Program logic: reviewed starter-week modules. Separate from UI. */
window.EGTemplates = (() => {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const GOALS = {
    first_5k: { label: "First 5K", bias: "run" },
    first_10k: { label: "First 10K", bias: "run" },
    strength: { label: "Get stronger", bias: "strength" },
    running: { label: "Improve running", bias: "run" },
    hybrid: { label: "Become a hybrid athlete", bias: "balanced" },
    hyrox: { label: "Prepare for HYROX", bias: "hyrox" },
    return: { label: "Get back into training", bias: "return" }
  };

  const EX = {
    full_gym: {
      squat: "Goblet squat or back squat",
      hinge: "Romanian deadlift",
      push: "Dumbbell bench press",
      pull: "Lat pulldown or seated row",
      lunge: "Walking lunge",
      core: "Dead bug + plank",
      carry: "Farmer carry",
      cond: "Row or ski erg"
    },
    basic_gym: {
      squat: "Goblet squat",
      hinge: "Dumbbell RDL",
      push: "Push-up or DB floor press",
      pull: "One-arm dumbbell row",
      lunge: "Reverse lunge",
      core: "Dead bug + side plank",
      carry: "Suitcase carry",
      cond: "Bike or row if available, else fast walk"
    },
    minimal: {
      squat: "Bodyweight squat or backpack squat",
      hinge: "Hip hinge good morning (backpack optional)",
      push: "Push-up (knees ok)",
      pull: "Backpack row or towel door row",
      lunge: "Reverse lunge",
      core: "Dead bug + plank",
      carry: "Loaded carry with backpack",
      cond: "Fast walk, stairs, or jumping jacks"
    }
  };

  const runProgression = (running, goal) => {
    if (running === "new") {
      return goal === "first_10k"
        ? { title: "Walk-run", work: "8 × (1 min jog / 2 min walk)", duration: 30 }
        : { title: "Walk-run", work: "6 × (1 min jog / 2 min walk)", duration: 25 };
    }
    if (running === "can_run_5k") {
      if (goal === "first_10k") return { title: "Easy run", work: "Continuous easy run 35–40 min", duration: 40 };
      if (goal === "hyrox") return { title: "Easy run", work: "Easy 25 min + 4 × 20s strides", duration: 32 };
      return { title: "Easy run", work: "Continuous easy run 25–30 min", duration: 30 };
    }
    return { title: "Easy aerobic run", work: "Easy run 40 min, nasal breathing if you can", duration: 40 };
  };

  const session = (day, type, title, duration, intensity, purpose, exercises) => ({
    day, type, title, duration, intensity, purpose, exercises
  });

  const rest = (day) => session(day, "rest", "Rest or easy walk", 20, "Easy", "Recover. Walk if you want to move.", [
    { name: "Optional 20 min easy walk", dose: "Zone 1", link: null }
  ]);

  const mobility = (day) => session(day, "recover", "Mobility & recover", 20, "Easy · RPE 2–3", "Leave the week better than you found it.", [
    { name: "90/90 hip switches", dose: "2 × 8/side", link: "library.html" },
    { name: "World’s greatest stretch", dose: "2 × 5/side", link: "library.html" },
    { name: "Couch stretch", dose: "2 × 45s/side", link: "library.html" },
    { name: "Nasal breathing, lying down", dose: "3 min", link: null }
  ]);

  const strength = (day, eq, level, bias) => {
    const e = EX[eq] || EX.basic_gym;
    const sets = level === "intermediate" ? "3 × 8–10" : "3 × 8";
    const extra = bias === "hyrox"
      ? [{ name: e.carry, dose: "4 × 30m", link: "library.html" }, { name: e.cond, dose: "6 × 30s hard / 60s easy", link: "library.html" }]
      : [{ name: e.carry, dose: "3 × 40m", link: "library.html" }];
    return session(day, "lift", bias === "hyrox" ? "Strength + hybrid" : "Full-body strength", 45, "Moderate · RPE 6–7", "Build the engine under the running.", [
      { name: "Easy bike / walk warm-up", dose: "5 min", link: null },
      { name: e.squat, dose: sets, link: "library.html" },
      { name: e.hinge, dose: sets, link: "library.html" },
      { name: e.push, dose: sets, link: "library.html" },
      { name: e.pull, dose: sets, link: "library.html" },
      { name: e.lunge, dose: "2 × 8/leg", link: "library.html" },
      { name: e.core, dose: "2 rounds", link: "library.html" },
      ...extra
    ]);
  };

  const easyRun = (day, running, goal) => {
    const r = runProgression(running, goal);
    return session(day, "run", r.title, r.duration, "Easy · RPE 3–4 · you can talk", "Aerobic base. Finish feeling like you could do a bit more.", [
      { name: "Walk 3 min", dose: "warm-up", link: null },
      { name: r.work, dose: `${r.duration - 8} min`, link: "library.html" },
      { name: "Walk 3 min + easy mobility", dose: "cool-down", link: null }
    ]);
  };

  const qualityRun = (day, running, goal) => {
    if (running === "new") {
      return session(day, "run", "Strides after walk-run", 28, "Easy–moderate", "Practice slightly quicker steps without going hard.", [
        { name: "Walk-run 16 min", dose: "1 on / 2 off", link: null },
        { name: "4 × 15s relaxed strides", dose: "walk back", link: "library.html" }
      ]);
    }
    if (goal === "hyrox") {
      return session(day, "cond", "Run + stations", 35, "Moderate · RPE 6", "Touch HYROX without training like an elite.", [
        { name: "Easy run", dose: "8 min", link: null },
        { name: "4 rounds: 400m jog + 10 squat + 8 push-up + 6 burpee", dose: "rest 90s", link: "library.html" },
        { name: "Easy walk", dose: "4 min", link: null }
      ]);
    }
    if (goal === "first_10k" || goal === "running") {
      return session(day, "run", "Steady run", 35, "Moderate · RPE 5–6", "Hold an honest pace you could repeat next week.", [
        { name: "Easy 8 min", dose: "warm-up", link: null },
        { name: "12–16 min slightly quicker, still in control", dose: "steady", link: "library.html" },
        { name: "Easy 6 min", dose: "cool-down", link: null }
      ]);
    }
    return session(day, "run", "Easy run + strides", 32, "Easy", "Stay aerobic. Strides are practice, not a race.", [
      { name: "Easy run 22 min", dose: "conversational", link: null },
      { name: "4 × 20s strides", dose: "full recovery", link: "library.html" }
    ]);
  };

  const hybrid = (day, eq, goal) => {
    const e = EX[eq] || EX.basic_gym;
    const title = goal === "return" ? "Easy hybrid circuit" : "Hybrid conditioning";
    const intensity = goal === "return" ? "Easy–moderate · RPE 5" : "Moderate · RPE 6–7";
    return session(day, "cond", title, 35, intensity, "Strength and lungs in the same hour.", [
      { name: "Move 4 min (walk, skip, open hips)", dose: "warm-up", link: null },
      { name: `4–5 rounds: 10 ${e.squat} · 8 ${e.push} · 10 ${e.hinge} · 30–45s ${e.cond}`, dose: "rest 60–90s", link: "library.html" },
      { name: e.core, dose: "2 rounds", link: "library.html" }
    ]);
  };

  function slotsFor(days, bias) {
    const n = Number(days);
    if (n === 3) {
      if (bias === "strength") return ["lift", "run", "lift"];
      if (bias === "hyrox") return ["lift", "run", "cond"];
      if (bias === "return") return ["lift", "run", "recover"];
      return ["run", "lift", "run"];
    }
    if (n === 5) {
      if (bias === "strength") return ["lift", "run", "lift", "cond", "run"];
      if (bias === "hyrox") return ["lift", "run", "cond", "lift", "run"];
      if (bias === "return") return ["lift", "run", "recover", "lift", "run"];
      return ["run", "lift", "run", "cond", "run"];
    }
    // 4 days
    if (bias === "strength") return ["lift", "run", "lift", "cond"];
    if (bias === "hyrox") return ["lift", "run", "cond", "run"];
    if (bias === "return") return ["lift", "run", "lift", "recover"];
    return ["run", "lift", "run", "cond"];
  }

  function placeOnWeek(types) {
    const map = { 3: [0, 2, 4], 4: [0, 1, 3, 5], 5: [0, 1, 2, 3, 5] };
    const idxs = map[types.length] || map[4];
    const week = DAYS.map((d) => ({ day: d, kind: "rest" }));
    types.forEach((t, i) => { week[idxs[i]].kind = t; });
    if (types.length >= 4) week[6].kind = "recover";
    else week[6].kind = "recover";
    return week;
  }

  function buildStarterWeek(answers) {
    const goal = answers.goal || "hybrid";
    const days = String(answers.days_per_week || "4");
    const running = answers.running_level || "new";
    const strengthLevel = answers.strength_level || "beginner";
    const equipment = answers.equipment || "basic_gym";
    const bias = (GOALS[goal] || GOALS.hybrid).bias;
    const types = slotsFor(days, bias);
    const layout = placeOnWeek(types);

    const sessions = layout.map((slot) => {
      if (slot.kind === "run") {
        const runDays = layout.filter((s) => s.kind === "run").map((s) => s.day);
        const isQuality = runDays[1] === slot.day;
        return isQuality ? qualityRun(slot.day, running, goal) : easyRun(slot.day, running, goal);
      }
      if (slot.kind === "lift") return strength(slot.day, equipment, strengthLevel, bias);
      if (slot.kind === "cond") return hybrid(slot.day, equipment, goal);
      if (slot.kind === "recover") return mobility(slot.day);
      return rest(slot.day);
    });

    return {
      id: `${goal}_${days}d_${running}_${equipment}`,
      goal,
      goalLabel: (GOALS[goal] || GOALS.hybrid).label,
      days,
      running,
      strengthLevel,
      equipment,
      sessions,
      rule: "Complete the week. Don’t chase perfection. A finished easy week beats a heroic half-week.",
      next: "If you finish this week, I can build the next 12 around you."
    };
  }

  function sampleWeek() {
    return buildStarterWeek({
      goal: "hybrid",
      days_per_week: "4",
      running_level: "can_run_5k",
      strength_level: "beginner",
      equipment: "full_gym"
    });
  }

  return { GOALS, DAYS, buildStarterWeek, sampleWeek };
})();
