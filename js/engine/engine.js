/* EverydayGass training engine — layouts + context-aware builders. */
(function (root) {
  if (typeof require !== "undefined") {
    if (!root.EGPlanId) require("../getPlanId.js");
    if (!root.EGLayouts) require("../data/weeklyLayouts.js");
    if (!root.EGRaceLoads) require("../data/hyroxRaceLoads.js");
    if (!root.EGLibrary) require("../data/library.js");
    if (!root.EGSuperFinal) require("../data/superFinalHyrox7.js");
  }

  const PlanId = root.EGPlanId;
  const Layouts = root.EGLayouts;
  const Race = root.EGRaceLoads;
  const Lib = root.EGLibrary;
  const SuperFinal = root.EGSuperFinal;

  const DISCLAIMER =
    "This plan is general hybrid training for healthy adults. It is not medical, physiotherapy or individualized clinical advice. If you have pain, injury, medical restriction or pregnancy, get professional clearance before you train.";

  const TITLE_WORD = { running: "Running Priority", strength: "Strength Priority", balanced: "Balanced", hyrox: "HYROX Priority" };
  const COPY = {
    running: {
      subtitle: "More engine. Strength stays in the week so you don’t become a fragile runner.",
      intro: "This week biases running without dropping lifting. Easy work does most of the volume.",
      guidance: ["Keep easy days easy.", "Strength supports the run.", "If life hits, skip the quality run before an easy run."]
    },
    strength: {
      subtitle: "Get stronger without abandoning the aerobic engine.",
      intro: "Lower and upper do the heavy work. Easy running keeps you athletic.",
      guidance: ["Leave reps in the tank.", "Easy run is still training.", "Do not add random HIIT on rest days."]
    },
    balanced: {
      subtitle: "Run. Lift. Condition. Recover.",
      intro: "A hybrid week you can repeat. Running and strength share the load.",
      guidance: ["Complete the week; don’t chase perfection.", "Match the effort, not your ego.", "Recovery days are part of the plan."]
    },
    hyrox: {
      subtitle: "Race-specific flavour without training like an elite.",
      intro: "Stations and mixed work get a vote. You still lift and you still run easy.",
      guidance: ["Smooth rounds beat ugly sprints.", "Strength first when the session is mixed.", "Walk the recoveries."]
    }
  };

  function getBlock(week) {
    const w = Number(week) || 1;
    if (w <= 4) return 1;
    if (w <= 8) return 2;
    return 3;
  }

  function blockLabel(block) {
    return { 1: "BUILD", 2: "PROGRESS", 3: "PERFORM" }[block] || "BUILD";
  }

  function hardBudget(level) {
    if (level === "beginner") return 2;
    if (level === "advanced") return 4;
    return 3;
  }

  function isDeload(week) {
    return week === 4 || week === 8;
  }

  function fmtSets(sets, reps, rir, extra = "") {
    const rirBit = rir != null ? ` • ${rir} RIR` : "";
    return `${sets} x ${reps}${rirBit}${extra}`;
  }

  function itemExercise(name, sets, reps, rir, extra = {}) {
    const percent = extra.percent1RM;
    const rest = extra.restSec;
    const bits = [fmtSets(sets, reps, rir)];
    if (percent) bits.push(`approx. ${percent}% 1RM`);
    if (rest) bits.push(`${Math.round(rest / 60)} min rest`);
    return {
      kind: "exercise",
      name,
      sets,
      reps: String(reps),
      rir,
      percent1RM: percent || null,
      restSec: rest || null,
      emphasis: extra.emphasis || "accessory",
      notes: extra.notes || "",
      prescription: bits.join(" • ")
    };
  }

  function itemHold(name, prescription, notes = "") {
    return { kind: "exercise", name, sets: null, reps: prescription, rir: null, prescription, notes };
  }

  function itemRun(distance, zone, extra = "") {
    const label = /run/i.test(distance) ? distance : `${distance} run`;
    return {
      kind: "run_block",
      distance: label,
      label: "run",
      zone,
      name: label,
      prescription: zone ? `Zone ${zone}${extra ? ` • ${extra}` : ""}` : extra
    };
  }

  function itemText(name, prescription, notes = "") {
    return { kind: "step", name, prescription, notes };
  }

  function itemHyrox(station, name, prescription, extra = {}) {
    return {
      kind: "hyrox_station",
      station,
      name,
      prescription,
      distance: extra.distance || "",
      raceLoadPct: extra.raceLoadPct || null,
      notes: extra.notes || ""
    };
  }

  function strengthDose(ctx) {
    const beginner = ctx.level === "beginner" || ctx.strengthBase === "new";
    const advanced = ctx.level === "advanced" && (ctx.strengthBase === "advanced" || ctx.strengthBase === "consistent");
    if (beginner) return { sets: 2, reps: "10", rir: 3, rest: 90 };
    if (advanced) return { sets: 3, reps: "5", rir: 2, rest: 180, percent: ctx.block === 3 ? 82 : ctx.block === 2 ? 78 : 72 };
    return { sets: 3, reps: "8", rir: 2, rest: 120 };
  }

  function accessoryDose(ctx) {
    const d = strengthDose(ctx);
    return { sets: d.sets, reps: ctx.level === "advanced" ? "8–10" : d.reps, rir: ctx.level === "beginner" ? 3 : 2, rest: 75 };
  }

  function durationFor(type, subtype, ctx) {
    const short = Number(ctx.sessionMinutes) === 30;
    const long = Number(ctx.sessionMinutes) >= 75;
    const bump = (min, max) => {
      if (short) return { min: Math.max(20, min - 8), max: Math.max(28, max - 10) };
      if (long) return { min: min + 8, max: max + 12 };
      if (isDeload(ctx.week)) return { min, max: max - 5 };
      return { min, max };
    };
    if (type === "recovery") return { min: 20, max: 30 };
    if (type === "mobility") return { min: 20, max: 30 };
    if (subtype === "easyRun" || subtype === "easyRunSecondary") return bump(ctx.level === "beginner" ? 25 : 30, ctx.level === "beginner" ? 35 : 45);
    if (subtype === "qualityRun") return bump(25, 40);
    if (subtype === "longRun") return bump(ctx.runningGoal === "halfMarathon" ? 55 : 35, ctx.runningGoal === "halfMarathon" ? 85 : 50);
    if (subtype === "enduranceRun") return bump(35, 55);
    if (type === "hyrox") return bump(40, 65);
    return bump(35, 50);
  }

  function warmupLift() {
    return [itemText("Bike, row or brisk walk", "4 min"), itemText("Bodyweight squat + hinge + push-up", "1 x 8 each")];
  }
  function warmupRun() {
    return [itemText("Walk or easy jog", "3–5 min")];
  }
  function cooldown() {
    return [itemText("Easy walk", "3 min"), itemText("Hip 90/90 + couch stretch", "2 x 30s / side")];
  }

  function addCore(main, ctx, index) {
    const pair = Lib.corePair(ctx, index);
    const dose = accessoryDose(ctx);
    pair.forEach((c) => {
      main.push(c.hold
        ? itemHold(c.name, `${dose.sets} x ${c.reps}`)
        : itemExercise(c.name, dose.sets, c.reps, dose.rir));
    });
  }

  function lift(slot, ctx, extra = {}) {
    const resolved = Lib.resolveExercise(slot, ctx);
    const dose = extra.main ? strengthDose(ctx) : accessoryDose(ctx);
    const advancedMain = extra.main && ctx.level === "advanced" && (ctx.strengthBase === "advanced" || ctx.strengthBase === "consistent");
    return itemExercise(resolved.name, extra.sets || dose.sets, extra.reps || dose.reps, extra.rir != null ? extra.rir : dose.rir, {
      percent1RM: advancedMain ? dose.percent : null,
      restSec: extra.main ? dose.rest : dose.rest,
      emphasis: extra.main ? "main_lift" : "accessory",
      notes: extra.notes || ""
    });
  }

  function walkRunEasy(ctx) {
    const block = ctx.block || 1;
    if (ctx.runningGoal === "first5k" && (ctx.level === "beginner" || ctx.runningBase === "new")) {
      if (block === 1) {
        return [
          itemText("Brisk walk", "5 min"),
          itemText("6 rounds", "3 min easy run + 2 min walk"),
          itemText("Easy walk", "5 min")
        ];
      }
      if (block === 2) {
        return [
          itemText("Brisk walk", "4 min"),
          itemText("5 rounds", "5 min easy run + 1 min walk"),
          itemText("Easy walk", "4 min")
        ];
      }
      return [
        itemText("Easy walk", "3 min"),
        itemText("Continuous easy run", "20–25 min"),
        itemText("6 x 20-second controlled accelerations", "fast but relaxed, then walk or jog until recovered. This is not an all-out sprint.")
      ];
    }
    if (ctx.runningBase === "new") {
      return [
        itemText("Brisk walk", "4 min"),
        itemText("5 rounds", "2 min easy run + 1 min walk"),
        itemText("Easy walk", "4 min")
      ];
    }
    const mins = ctx.level === "beginner" ? "22–28 min" : "28–38 min";
    const steps = [itemText("Continuous easy run", `${mins} • Zone 2`)];
    if (ctx.level !== "beginner" && ctx.runningGoal !== "supportOnly") {
      steps.push(itemText("6 x 20-second controlled accelerations", "gradually speed up for 20 seconds to a fast but relaxed pace, then walk or jog easily until fully recovered. This is not an all-out sprint."));
    }
    return steps;
  }

  function qualityContent(ctx) {
    if (ctx.runningGoal === "supportOnly" && ctx.priority === "strength") {
      return [itemText("Easy continuous run or walk-run", "20–25 min • Zone 2")];
    }
    if (ctx.level === "beginner" || ctx.runningGoal === "first5k") {
      return [
        itemText("Easy walk/run", "8 min"),
        itemText("6 rounds", "1 min controlled faster run + 2 min easy walk or jog"),
        itemText("Easy cooldown", "5 min")
      ];
    }
    if (ctx.level === "advanced") {
      if (ctx.runningGoal === "halfMarathon" && ctx.block === 3) {
        return [
          itemText("Easy run", "10 min • Zone 2"),
          itemText("3 x 8 min around target Half Marathon Pace", "2 min easy jog between"),
          itemText("Easy run", "6 min")
        ];
      }
      return [
        itemText("Easy run", "8 min • Zone 2"),
        itemText("5 x 3 min threshold", "90 sec easy jog • Zone 4"),
        itemText("Easy run", "6 min")
      ];
    }
    if (ctx.runningGoal === "10k" || ctx.runningGoal === "halfMarathon") {
      return [
        itemText("Easy run", "8 min • Zone 2"),
        itemText("3 x 5 min tempo", "90 sec easy jog • Zone 3"),
        itemText("Easy run", "6 min")
      ];
    }
    return [
      itemText("Easy run", "8 min"),
      itemText("Fartlek 16 min", "1 min slightly quicker / 1 min easy"),
      itemText("Easy run", "6 min")
    ];
  }

  function longContent(ctx) {
    if (ctx.runningGoal === "first5k" && (ctx.level === "beginner" || ctx.runningBase === "new")) {
      return [
        itemText("Walk", "5 min"),
        itemText("5 rounds", "5 min easy run + 1 min walk"),
        itemText("Easy walk cooldown", "4 min")
      ];
    }
    if (ctx.runningGoal === "halfMarathon") {
      const weekB = ctx.week % 2 === 0 && ctx.level === "advanced";
      if (weekB) {
        return [
          itemText("Shorter endurance run", "40–50 min • mostly Zone 2"),
          itemText("Optional last 8 min", "steady Zone 3 if recovered")
        ];
      }
      const mins = 45 + (ctx.block - 1) * 10;
      return [
        itemText("Progressive long run", `${mins}–${mins + 15} min`),
        itemText("First third easy Zone 2", "middle steady, finish faster and controlled")
      ];
    }
    if (ctx.runningGoal === "supportOnly") {
      return [itemText("Easy aerobic run or brisk walk", "25–35 min • Zone 2")];
    }
    return [itemText("Longer easy run or walk-run", "35–45 min • Zone 2")];
  }

  function enduranceContent(ctx) {
    return [
      itemText("Endurance run", "35–45 min • mostly Zone 2"),
      ctx.level === "beginner"
        ? itemText("Keep it conversational", "walk breaks are allowed")
        : itemText("Optional last 6 min", "steady Zone 3 if recovered")
    ];
  }

  function hyroxRunContent(ctx) {
    const ski = Lib.resolveHyroxStation("ski", ctx);
    const wb = Lib.resolveHyroxStation("wall_ball", ctx);
    const lunges = Lib.resolveHyroxStation("lunges", ctx);
    const farmers = Lib.resolveHyroxStation("farmers", ctx);
    const sled = Lib.resolveHyroxStation("sled_push", ctx);
    const load = Race.exampleTotal("sled_push", "men_open", ctx.block === 1 ? 70 : ctx.block === 2 ? 85 : 90);
    const wbReps = ctx.block === 1 ? "8" : ctx.block === 2 ? "12" : "15";
    const pyramid = ctx.block < 3;
    const steps = [];
    if (pyramid) {
      const dists = ctx.block === 1
        ? ["1,200 m", "1,000 m", "800 m", "600 m", "400 m"]
        : ["400 m", "600 m", "800 m", "1 km", "800 m", "600 m", "400 m"];
      steps.push(itemText(ctx.block === 1 ? "Descending pyramid" : "Symmetrical pyramid", "run + station. Always complete the run."));
      dists.forEach((d, i) => {
        const station = [sled.name, wb.name, lunges.name, farmers.name, ski.name][i % 5];
        const extra = station === sled.name
          ? `${d} run + ${station} • ${ctx.block === 1 ? 70 : 85}% Race Load • Men Open example: ${load} kg total, including the sled`
          : station === wb.name
            ? `${d} run + ${wb.name} x ${wbReps}`
            : `${d} run + ${station}`;
        steps.push(itemRun(d, 3, extra.replace(`${d} run + `, "")));
      });
    } else {
      steps.push(itemText("Race-specific 1 km blocks", "keep transitions honest"));
      for (let i = 0; i < 4; i += 1) {
        const station = [sled.name, farmers.name, lunges.name, wb.name][i];
        const extra = station === sled.name
          ? `${station} • 90% Race Load • Men Open example: ${load} kg total, including the sled`
          : station === wb.name
            ? `${wb.name} x 20`
            : station;
        steps.push(itemRun("1 km", 3, extra));
      }
    }
    if (ctx.level === "beginner") {
      return [
        itemText("Technique + short stations", "stay smooth"),
        itemRun("400 m", 2, `${wb.name} x 6`),
        itemRun("400 m", 2, lunges.name),
        itemRun("400 m", 2, farmers.name),
        itemText("Easy walk", "3 min")
      ];
    }
    return steps;
  }

  function hyroxStationsContent(ctx) {
    const ski = Lib.resolveHyroxStation("ski", ctx);
    const row = Lib.resolveHyroxStation("row", ctx);
    const sledP = Lib.resolveHyroxStation("sled_push", ctx);
    const sledL = Lib.resolveHyroxStation("sled_pull", ctx);
    const farmers = Lib.resolveHyroxStation("farmers", ctx);
    const lunges = Lib.resolveHyroxStation("lunges", ctx);
    const wb = Lib.resolveHyroxStation("wall_ball", ctx);
    const bbj = Lib.resolveHyroxStation("bbj", ctx);
    const pushKg = Race.exampleTotal("sled_push", "men_open", ctx.block === 3 ? 90 : 75);
    const pullKg = Race.exampleTotal("sled_pull", "men_open", ctx.block === 3 ? 90 : 75);
    const orders = [
      [ski, sledP, wb, farmers, sledL, lunges],
      [ski, bbj, lunges, farmers, row, wb],
      [ski, sledP, sledL, farmers, wb, lunges]
    ];
    const order = orders[(ctx.week + ctx.block) % orders.length];
    const wbReps = ctx.block === 1 ? "10" : ctx.block === 2 ? "15" : "20";
    const steps = [itemText("No-run HYROX", "start with an erg when one is included")];
    order.forEach((st) => {
      if (st.intent === "ski") steps.push(itemHyrox("ski", `${st.name} — 500 m`, "damper 4–6"));
      else if (st.intent === "row") steps.push(itemHyrox("row", `${st.name} — 500 m`, "damper 5–6"));
      else if (st.intent === "sled_push") {
        steps.push(itemHyrox("sled_push", `20 m ${st.name}`, `75–90% Race Load • Men Open example: ${pushKg} kg total, including the sled`, {
          distance: "20 m", raceLoadPct: ctx.block === 3 ? 90 : 75
        }));
      } else if (st.intent === "sled_pull") {
        steps.push(itemHyrox("sled_pull", `20 m ${st.name}`, `Men Open example: ${pullKg} kg total, including the sled`, {
          distance: "20 m", raceLoadPct: ctx.block === 3 ? 90 : 75
        }));
      } else if (st.intent === "wall_ball") {
        steps.push(itemHyrox("wall_ball", st.name, `${wbReps} reps`, { notes: "Reps live in this workout." }));
      } else if (st.intent === "farmers") {
        steps.push(itemHyrox("farmers", `40 m ${st.name}`, "controlled grip"));
      } else if (st.intent === "lunges") {
        steps.push(itemHyrox("lunges", `20 m ${st.name}`, "upright torso"));
      } else {
        steps.push(itemHyrox(st.intent, st.name, "6–8 quality reps"));
      }
    });
    if (ctx.level === "beginner") {
      return [
        itemHyrox("ski", `${ski.name} — 250 m`, "easy rhythm"),
        itemHyrox("farmers", farmers.name, "20 m"),
        itemHyrox("lunges", lunges.name, "10 / leg"),
        itemHyrox("wall_ball", wb.name, "8 reps")
      ];
    }
    return steps;
  }

  function sessionShell(day, title, type, subtype, ctx, main, extra = {}) {
    const durationMin = durationFor(type, subtype, ctx);
    return {
      day,
      dayName: Layouts.DAY_NAMES[day - 1],
      title,
      type,
      subtype,
      durationMin,
      intensity: extra.intensity || extra.intensityLabel || "",
      intensityLabel: extra.intensityLabel || extra.intensity || "",
      objective: extra.objective || "",
      callouts: extra.callouts || [],
      warmup: extra.warmup || [],
      main,
      cooldown: extra.cooldown || [],
      coachNote: extra.coachNote || "",
      explanationKeys: extra.explanationKeys || [],
      equipmentUsed: extra.equipmentUsed || [],
      substitutionsApplied: extra.substitutionsApplied || [],
      isHardSession: Boolean(extra.isHardSession),
      lowerBodyStress: extra.lowerBodyStress || 0
    };
  }

  function fullStrength(day, ctx, secondary = false) {
    const title = secondary
      ? "Full-body volume"
      : (ctx.level === "beginner" ? "Beginner Full Body" : "Full-body strength");
    const main = [
      lift("squatPattern", ctx, { main: !secondary }),
      ctx.level === "beginner" ? lift("isolationLeg", ctx) : lift("hingePattern", ctx, { main: ctx.level === "advanced" && !secondary }),
      lift("horizontalPush", ctx, { main: ctx.level === "advanced" && !secondary }),
      ctx.level === "beginner" ? lift("verticalPull", ctx) : lift("horizontalPull", ctx),
      lift("singleLeg", ctx),
      ctx.level === "beginner" ? null : lift("verticalPull", ctx)
    ].filter(Boolean);
    addCore(main, ctx, day);
    return sessionShell(day, title, "strength", secondary ? "fullStrengthSecondary" : "fullStrength", ctx, main, {
      warmup: warmupLift(),
      cooldown: cooldown(),
      intensityLabel: secondary
        ? (ctx.level === "beginner" ? "Easy • extra volume" : "Moderate • extra volume")
        : (ctx.level === "beginner" ? "Easy–moderate • 3 RIR" : "Moderate • 2 RIR"),
      isHardSession: ctx.level === "advanced" && !secondary,
      lowerBodyStress: 2,
      explanationKeys: ["rir"].concat(ctx.level === "advanced" ? ["oneRM"] : []),
      coachNote: secondary
        ? "Extra full-body volume, not a second heavy day. Keep technique high and leave reps in reserve."
        : (ctx.level === "beginner" ? "Technique first. Finish with reps in reserve." : "Leave reps in the tank. Main lifts stay measurable.")
    });
  }

  function lowerStrength(day, ctx) {
    const main = [
      lift("squatPattern", ctx, { main: true }),
      lift("hingePattern", ctx, { main: ctx.level === "advanced" }),
      lift("singleLeg", ctx),
      lift("isolationLeg", ctx)
    ];
    addCore(main, ctx, day);
    return sessionShell(day, "Strength — lower", "strength", "lowerStrength", ctx, main, {
      warmup: warmupLift(),
      intensityLabel: "Moderate • lower body",
      isHardSession: ctx.level !== "beginner",
      lowerBodyStress: 3,
      explanationKeys: ["rir"],
      coachNote: "Legs that last. Not a max-out day."
    });
  }

  function upperStrength(day, ctx) {
    const main = [
      lift("horizontalPush", ctx, { main: true }),
      lift("horizontalPull", ctx),
      lift("verticalPull", ctx),
      lift("shoulderPress", ctx, { main: ctx.level === "advanced" })
    ];
    addCore(main, ctx, day);
    return sessionShell(day, "Strength — upper", "strength", "upperStrength", ctx, main, {
      warmup: warmupLift(),
      intensityLabel: "Moderate • upper body",
      isHardSession: false,
      explanationKeys: ["rir"]
    });
  }

  function easyRun(day, ctx, secondary = false) {
    const first5k = ctx.runningGoal === "first5k" && (ctx.level === "beginner" || ctx.runningBase === "new");
    return sessionShell(day, first5k ? "Easy Run / Walk" : "Easy run", "run", secondary ? "easyRunSecondary" : "easyRun", ctx, walkRunEasy(ctx), {
      warmup: warmupRun(),
      cooldown: cooldown(),
      intensityLabel: "Easy • Zone 2 • you can talk",
      explanationKeys: ["zones"].concat(ctx.level !== "beginner" && ctx.runningGoal !== "supportOnly" ? ["controlledAccel"] : []),
      callouts: [
        { label: "Easy rule", text: "You should be able to speak in full sentences. If you cannot, you are not in Zone 2 — slow down." },
        { label: "Example only", text: "If your Zone 2 is 5:30–6:15/km, stay inside that range. Your calculator values always take priority." }
      ],
      coachNote: "Finish feeling that you could comfortably continue."
    });
  }

  function qualityRun(day, ctx) {
    const first5k = ctx.runningGoal === "first5k";
    return sessionShell(day, first5k ? "Controlled Faster Run / Walk" : "Quality run", "run", "qualityRun", ctx, qualityContent(ctx), {
      warmup: warmupRun(),
      intensityLabel: "Moderate • controlled",
      isHardSession: ctx.runningGoal !== "supportOnly",
      lowerBodyStress: 2,
      callouts: [
        { label: "Quality cue", text: "The efforts should feel hard but repeatable. If the last interval is much slower than the first, you started too fast." },
        { label: "Example only", text: "If Zone 4 is 4:35–5:00/km, each quality effort sits there. Recover very easily, for example around 5:45–6:30/km." }
      ],
      coachNote: "Practice pace. Do not race this session."
    });
  }

  function longRun(day, ctx) {
    const first5k = ctx.runningGoal === "first5k";
    const weekB = ctx.week % 2 === 0 && ctx.level === "advanced" && ctx.runningGoal === "halfMarathon";
    return sessionShell(day, first5k ? "Longer Easy Run / Walk" : weekB ? "Shorter endurance run" : "Long run", "run", weekB ? "enduranceRun" : "longRun", ctx, longContent(ctx), {
      warmup: warmupRun(),
      cooldown: cooldown(),
      intensityLabel: "Easy–steady • Zone 2",
      isHardSession: ctx.runningGoal === "halfMarathon" && !weekB,
      lowerBodyStress: 2,
      callouts: [
        { label: "Example only", text: "Think ~5:45/km in Zone 2, then move toward ~5:10/km if the session includes a Zone 3 block. Finish near your target 21.1 km pace only if form stays clean." }
      ],
      coachNote: "Time on feet. Pride is finishing in control."
    });
  }

  function enduranceRun(day, ctx) {
    return sessionShell(day, "Endurance run", "run", "enduranceRun", ctx, enduranceContent(ctx), {
      warmup: warmupRun(),
      cooldown: cooldown(),
      intensityLabel: "Easy • Zone 2",
      lowerBodyStress: 1,
      callouts: [
        { label: "Easy rule", text: "Keep this run conversational. Finish feeling that you could comfortably continue." },
        { label: "Example only", text: "If Zone 2 is 5:30–6:15/km, stay there unless the session asks for a short Zone 3 finish." }
      ],
      coachNote: "Time on feet, not a race."
    });
  }

  function hybridConditioning(day, ctx) {
    const row = Lib.resolveHyroxStation("row", ctx);
    const farmers = Lib.resolveHyroxStation("farmers", ctx);
    const main = [
      itemText("4 rounds", `${Lib.resolveExercise("squatPattern", ctx).name} x 8 • push-up x 8 • ${Lib.resolveExercise("hingePattern", ctx).name} x 8 • 40s ${row.name}`),
      itemHold(farmers.name, "3 x 30 m")
    ];
    addCore(main, ctx, day);
    return sessionShell(day, "Hybrid conditioning", "hyrox", "hybridConditioning", ctx, main, {
      warmup: warmupLift(),
      cooldown: cooldown(),
      intensityLabel: "Moderate • mixed",
      isHardSession: ctx.level !== "beginner",
      lowerBodyStress: 2,
      coachNote: "Mixed work. Stay smooth."
    });
  }

  function hyroxRun(day, ctx) {
    return sessionShell(day, "HYROX run focus", "hyrox", "hyroxRun", ctx, hyroxRunContent(ctx), {
      warmup: warmupRun(),
      cooldown: cooldown(),
      intensityLabel: ctx.level === "beginner" ? "Technique • easy–moderate" : "Moderate–hard • compromised running",
      isHardSession: ctx.level !== "beginner",
      lowerBodyStress: 3,
      explanationKeys: ["raceLoad"],
      coachNote: "Always write the run. Stations serve the engine."
    });
  }

  function hyroxStations(day, ctx) {
    return sessionShell(day, "HYROX stations", "hyrox", "hyroxStations", ctx, hyroxStationsContent(ctx), {
      warmup: warmupLift(),
      cooldown: cooldown(),
      intensityLabel: "Station density",
      isHardSession: ctx.level === "advanced",
      lowerBodyStress: 2,
      explanationKeys: ["raceLoad"],
      coachNote: "If an erg is included, start there. Order changes with the objective."
    });
  }

  function strengthHyrox(day, ctx) {
    const sled = Lib.resolveHyroxStation("sled_push", ctx);
    const kg = Race.exampleTotal("sled_push", "men_open", 70);
    const main = [
      lift("squatPattern", ctx, { main: true }),
      lift("hingePattern", ctx),
      lift("horizontalPush", ctx),
      lift("horizontalPull", ctx),
      itemHyrox("sled_push", sled.name, `5 x 20 m • 70% Race Load • Men Open example: ${kg} kg total, including the sled`)
    ];
    addCore(main, ctx, day);
    return sessionShell(day, "Strength + HYROX", "strength", "strengthHyrox", ctx, main, {
      warmup: warmupLift(),
      intensityLabel: "Lift first, then stations",
      isHardSession: ctx.level === "advanced",
      lowerBodyStress: 3,
      explanationKeys: ["rir", "raceLoad"],
      coachNote: "Lift first. Conditioning after, not instead."
    });
  }

  function mobility(day, ctx) {
    return sessionShell(day, "Mobility & recover", "mobility", "mobility", ctx, [
      itemText("90/90 hip switches", "2 x 8 / side"),
      itemText("World’s greatest stretch", "2 x 5 / side"),
      itemText("Couch stretch", "2 x 45s / side"),
      itemText("Nasal breathing, lying down", "3 min")
    ], {
      intensityLabel: "Easy • low stress",
      coachNote: "All seven days are scheduled. This one is deliberately easy."
    });
  }

  function recovery(day, ctx) {
    return sessionShell(day, "Recovery", "recovery", "recovery", ctx, [
      itemText("Rest or 20–30 min easy walk", "Zone 1")
    ], {
      intensityLabel: "Easy",
      coachNote: "Complete rest is allowed. Walking counts."
    });
  }

  function resolveKey(key, ctx) {
    if (key === "easyOrQualityRun") {
      return ctx.level === "advanced" && ctx.week % 2 === 1 ? "qualityRun" : "easyRun";
    }
    if (key === "longOrEnduranceRun") {
      if (ctx.runningGoal === "halfMarathon" && ctx.level === "advanced" && ctx.week % 2 === 0) return "enduranceRun";
      if (ctx.runningGoal === "first5k" || ctx.runningGoal === "supportOnly") return "longRun";
      return ctx.week % 2 === 0 ? "enduranceRun" : "longRun";
    }
    return key;
  }

  const BUILDERS = {
    fullStrength: (d, c) => fullStrength(d, c, false),
    fullStrengthSecondary: (d, c) => fullStrength(d, c, true),
    lowerStrength,
    upperStrength,
    easyRun: (d, c) => easyRun(d, c, false),
    easyRunSecondary: (d, c) => easyRun(d, c, true),
    qualityRun,
    longRun,
    enduranceRun,
    hybridConditioning,
    hyroxRun,
    hyroxStations,
    strengthHyrox,
    mobility,
    recovery
  };

  function normalizeProfile(profile = {}) {
    const days = Number(profile.daysPerWeek);
    const equipment = profile.equipmentProfile
      || migrateEquipment(profile.trainingAccess)
      || "gym_no_hyrox";
    const runningBase = profile.runningBase === "performance" ? "endurance" : (profile.runningBase || "5k");
    const runningGoal = profile.runningGoal || defaultGoal(profile.priority, runningBase);
    return {
      priority: profile.priority || "balanced",
      daysPerWeek: PlanId.DAYS.includes(days) ? days : 4,
      level: profile.level || "intermediate",
      runningBase,
      runningGoal,
      strengthBase: profile.strengthBase || "some",
      equipmentProfile: equipment,
      hasConstraints: Boolean(profile.hasConstraints),
      constraintTags: profile.constraintTags || [],
      constraintText: profile.constraintText || "",
      runningVolumeKm: profile.runningVolumeKm || profile.runningVolume || "",
      target: profile.target || "",
      eventDate: profile.eventDate || profile.eventWindow || "",
      benchmark: profile.benchmark || "",
      sessionMinutes: profile.sessionMinutes ? Number(profile.sessionMinutes) : null,
      limitingFactor: profile.limitingFactor || profile.limitation || "",
      week: profile.week || 1,
      block: profile.block || getBlock(profile.week || 1)
    };
  }

  function migrateEquipment(access) {
    return {
      full_gym: "full_hyrox",
      basic_gym: "gym_no_hyrox",
      home_run: "minimal_home",
      mixed: "gym_no_hyrox"
    }[access] || null;
  }

  function defaultGoal(priority, runningBase) {
    if (priority === "strength") return "supportOnly";
    if (runningBase === "new") return "first5k";
    if (runningBase === "5k") return "improve5k";
    if (runningBase === "10k") return "10k";
    if (runningBase === "endurance") return "halfMarathon";
    return "performance";
  }

  function applyGuardrails(sessions, ctx) {
    const budget = hardBudget(ctx.level);
    let hard = 0;
    return sessions.map((s) => {
      if (ctx.level !== "advanced" && ctx.daysPerWeek === 7 && s.subtype === "qualityRun" && ctx.priority === "hyrox") {
        return easyRun(s.day, ctx);
      }
      if (isDeload(ctx.week) && s.isHardSession && s.type === "hyrox") {
        return { ...s, isHardSession: false, coachNote: "Consolidation week. Keep technique, cut the heroics.", intensityLabel: "Technique • reduced load" };
      }
      if (s.isHardSession) {
        hard += 1;
        if (hard > budget && s.type === "run") return easyRun(s.day, ctx);
        if (hard > budget && s.subtype === "hybridConditioning") return mobility(s.day, ctx);
      }
      return s;
    });
  }

  function explanationsFor(sessions) {
    const seen = new Set();
    const out = [];
    sessions.forEach((s) => {
      (s.explanationKeys || []).forEach((key) => {
        if (!seen.has(key) && Lib.EXPLANATIONS[key]) {
          seen.add(key);
          out.push({ key, text: Lib.EXPLANATIONS[key] });
        }
      });
    });
    return out;
  }

  function buildWeek(raw) {
    const ctx = normalizeProfile(raw);
    if (SuperFinal?.matches(ctx)) return SuperFinal.weekAsPlan(ctx.week, ctx);
    const keys = Layouts.getLayout(ctx.priority, ctx.daysPerWeek);
    if (!keys) return null;
    const sessions = keys.map((key, i) => {
      const resolved = resolveKey(key, ctx);
      const builder = BUILDERS[resolved] || recovery;
      return builder(i + 1, ctx);
    });
    const guarded = applyGuardrails(sessions, ctx);
    const copy = COPY[ctx.priority] || COPY.balanced;
    const recoveryDays = guarded.filter((s) => s.type === "recovery").map((s) => s.day);
    return {
      id: PlanId.getPlanId(ctx.priority, ctx.daysPerWeek),
      priority: ctx.priority,
      daysPerWeek: ctx.daysPerWeek,
      level: ctx.level,
      runningGoal: ctx.runningGoal,
      runningBase: ctx.runningBase,
      strengthBase: ctx.strengthBase,
      equipmentProfile: ctx.equipmentProfile,
      week: ctx.week,
      block: ctx.block,
      blockLabel: blockLabel(ctx.block),
      title: `${ctx.daysPerWeek}-Day ${TITLE_WORD[ctx.priority]} Hybrid Week`,
      subtitle: copy.subtitle,
      intro: copy.intro,
      weeklyGuidance: copy.guidance,
      sessions: guarded,
      recoveryDays,
      explanations: explanationsFor(guarded),
      disclaimer: DISCLAIMER,
      version: 2,
      updatedAt: "2026-09-05"
    };
  }

  function validateWeek(week, ctx) {
    const errors = [];
    if (!week || !Array.isArray(week.sessions) || week.sessions.length !== 7) errors.push("need 7 days");
    (week?.sessions || []).forEach((s) => {
      if (s.type !== "recovery" && (!s.durationMin || s.durationMin.min == null)) errors.push(`duration ${s.day}`);
      (s.main || []).forEach((item) => {
        if (item.kind === "run_block" && item.distance && !/run/i.test(item.distance) && !/run/i.test(item.name || "")) {
          errors.push(`run wording ${item.distance}`);
        }
        if (item.station === "wall_ball" && !/\d/.test(item.prescription || "")) errors.push("wall ball reps");
        if ((item.station === "sled_push" || item.station === "sled_pull") && /kg/.test(item.prescription || "") && !/including the sled/i.test(item.prescription || "")) {
          errors.push("sled total");
        }
      });
    });
    const forbid = Lib.forbiddenEquipment(ctx || week);
    if (forbid) {
      const blob = JSON.stringify(week.sessions);
      if (forbid.test(blob) && (ctx?.equipmentProfile === "minimal_home" || week.equipmentProfile === "minimal_home")) {
        if (/leg press|cable|lat pulldown|sled push|ski\s*erg/i.test(blob)) errors.push("forbidden equipment");
      }
    }
    return { ok: errors.length === 0, errors };
  }

  function buildFreeWeek(profile) {
    return buildWeek({ ...profile, week: 1, block: 1 });
  }

  function build12WeekPlan(profile, premiumProfile = {}) {
    const ctx = normalizeProfile({ ...profile, ...premiumProfile });
    if (SuperFinal?.matches(ctx)) return SuperFinal.allWeeks(ctx);
    return Array.from({ length: 12 }, (_, i) => {
      const week = i + 1;
      return buildWeek({ ...profile, ...premiumProfile, week, block: getBlock(week) });
    });
  }

  function buildPlanDocument(profile, premiumProfile = {}) {
    const weeks = build12WeekPlan(profile, premiumProfile);
    const first = weeks[0];
    return {
      ...first,
      weeks,
      title: first.documentTitle || first.title,
      subtitle: first.coverSubtitle || first.subtitle
    };
  }

  function summarizeSession(s) {
    const dur = s.durationMin ? `${s.durationMin.min}–${s.durationMin.max} min` : "";
    return {
      day: s.day,
      dayName: s.dayName,
      title: s.title,
      type: s.type,
      subtype: s.subtype,
      duration: dur,
      intensityLabel: s.intensityLabel
    };
  }

  function weekSummary(weekObj) {
    return {
      week: weekObj.week,
      block: weekObj.block,
      blockLabel: weekObj.blockLabel,
      title: weekObj.title,
      sessions: weekObj.sessions.filter((s) => s.type !== "recovery").map(summarizeSession),
      allDays: weekObj.sessions.map(summarizeSession)
    };
  }

  function build12WeekSummaries(profile, premiumProfile = {}) {
    return build12WeekPlan(profile, premiumProfile).map(weekSummary);
  }

  function futurePreview(profile, premiumProfile = {}) {
    const week = buildWeek({ ...profile, ...premiumProfile, week: 7, block: 2 });
    const pick = week.sessions.find((s) => s.isHardSession) || week.sessions.find((s) => s.type !== "recovery");
    return { week: 7, blockLabel: "PROGRESS", session: pick };
  }

  const api = {
    DISCLAIMER,
    getBlock,
    blockLabel,
    normalizeProfile,
    buildWeek,
    buildFreeWeek,
    build12WeekPlan,
    buildPlanDocument,
    build12WeekSummaries,
    futurePreview,
    validateWeek,
    BUILDERS,
    migrateEquipment
  };

  root.EGEngine = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
