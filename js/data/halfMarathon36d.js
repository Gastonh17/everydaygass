/* EverydayGass — 5-week half-marathon block. Beginner gym, running priority, 6 days. */
(function (root) {
  function lift(name, rx, strength) {
    return { kind: "exercise", name, prescription: rx, emphasis: strength ? "main_lift" : null };
  }

  function corePair(pairs) {
    return pairs.map(([name, rx]) => ({ kind: "exercise", name, prescription: rx }));
  }

  function gymSession(day, gymIndex, title, est, items, core, dayName) {
    const [min, max] = est.split("-").map(Number);
    return {
      day,
      dayName,
      type: "strength",
      gymIndex,
      title,
      durationMin: { min, max },
      duration: `${min}–${max} min`,
      intensityLabel: title,
      finisherLabel: "Pull-ups + abs",
      coachNote: "You can do 3–4 banded pull-ups today. Stop at the last clean rep. Then abs. Skill, not a max test.",
      main: items.concat(corePair(core))
    };
  }

  function runSession(day, spec) {
    const [min, max] = spec.est.split("-").map(Number);
    return {
      day,
      dayName: spec.dayName,
      type: "run",
      title: spec.title,
      durationMin: { min, max },
      duration: `${min}–${max} min`,
      intensityLabel: spec.intensity || "",
      objective: spec.objective || "",
      callouts: spec.callouts || [],
      coachNote: spec.focus || "",
      main: (spec.steps || []).map((name) => ({ kind: "step", name }))
    };
  }

  const SHARED = {
    id: "marina-half-roma",
    priority: "running",
    daysPerWeek: 6,
    level: "beginner",
    weekTotal: 6,
    targetHeading: "Your race target",
    ruleHeading: "The rule that matters",
    structureHeading: "The long-run ladder",
    title: "Marina Training Plan",
    coverSubtitle: "GYM + Half Marathon Roma. 14 September – 20 October. Race Tuesday 20 October in Rome. Three runs, three full-body gym days. The last long is 18 km on Saturday 10 October — ten days before the race.",
    intro: "You already have a half in your legs, but 10 km still cooks you and the gym is brand new. This block is running-first. Longs go 12 → 14 → 16 → 18 km: two extra kilometres each Saturday. Gym is machine-based toning. Every gym day ends with banded pull-ups (you can do 3–4 now) plus abs. Leave 3 reps in the tank. Never smash the legs on Friday.",
    weeklyGuidance: [
      "The 18 km on 10 October is the last hard aerobic day. After that you only remove fatigue. Longs stay Zone 2 — full sentences. If you cannot talk, you are too fast. Do not add a fourth run."
    ],
    coreGuide: {
      title: "Pull-ups + abs",
      lead: "Every gym day ends with banded pull-ups, then abs. You can do 3–4 clean reps with a band today. Use the band that lets you get your chin over the bar without kicking. Stop at the last clean rep — never an ugly fifth.",
      note: "If 4 reps become easy on every set, switch to a thinner band the next gym day. Abs stay controlled: dead bug, plank, V-ups or machine crunch. This is skill and tone, not a burnout."
    },
    zonesLine: "No paces to copy. Easy running is Zone 2: full sentences, nose breathing if you can. If 10 km already finishes you, the first kilometres were too fast. Half-marathon rhythm is controlled and repeatable, never a 10 km race.",
    runWarmupNote: "8–10 min easy before every run. Open every long run slower than you think for the first 3 km. Walk 60 seconds only if you must, then resume easy. Do not turn the long into intervals.",
    zoneTiles: [
      ["Z1 Recovery", "Walk / shake-out"],
      ["Z2 Easy", "Full sentences"],
      ["Z3 Steady", "Short sentences"],
      ["Z4 Hard", "Quality only, never the long"],
      ["Z5 Very hard", "Strides 15–20 s only"],
      ["Half race rhythm", "Sustainable, not a 10 km"]
    ],
    weeklyStructure: [
      ["Sat 19 Sep", "Long 1 — 12 km easy Zone 2"],
      ["Sat 26 Sep", "Long 2 — 14 km"],
      ["Sat 3 Oct", "Long 3 — 16 km"],
      ["Sat 10 Oct", "Last long — 18 km, 10 days out"],
      ["Sat 17 Oct", "Taper — 8 km shake-out"],
      ["Tue 20 Oct", "Race — Half Marathon Roma 21.1 km"]
    ]
  };

  const G1 = [
    [lift("Leg Press", "2 x 12 | 3 RIR | Rest 90 s", true), lift("Chest Press", "2 x 12 | 3 RIR | Rest 75 s"), lift("Lat Pulldown", "2 x 12 | 3 RIR | Rest 75 s"), lift("Hip Abduction", "2 x 15 | 3 RIR | Rest 60 s"), lift("Lying Leg Curl", "2 x 12 | 3 RIR | Rest 60 s")],
    [lift("Leg Press", "3 x 12 | 3 RIR | Rest 90 s", true), lift("Chest Press", "3 x 12 | 3 RIR | Rest 75 s"), lift("Lat Pulldown", "3 x 12 | 3 RIR | Rest 75 s"), lift("Hip Abduction", "3 x 15 | 3 RIR | Rest 60 s"), lift("Lying Leg Curl", "2 x 12 | 3 RIR | Rest 60 s")],
    [lift("Leg Press", "3 x 12 | 3 RIR | Rest 90 s", true), lift("Chest Press", "3 x 12 | 3 RIR | Rest 75 s"), lift("Lat Pulldown", "3 x 12 | 3 RIR | Rest 75 s"), lift("Hip Abduction", "3 x 15 | 3 RIR | Rest 60 s"), lift("Lying Leg Curl", "3 x 12 | 3 RIR | Rest 60 s")],
    [lift("Leg Press", "2 x 12 | 3 RIR | Rest 90 s", true), lift("Chest Press", "2 x 12 | 3 RIR | Rest 75 s"), lift("Lat Pulldown", "2 x 12 | 3 RIR | Rest 75 s"), lift("Hip Abduction", "2 x 15 | 3 RIR | Rest 60 s"), lift("Lying Leg Curl", "2 x 12 | 3 RIR | Rest 60 s")],
    [lift("Leg Press", "2 x 12 | 4 RIR | Rest 90 s", true), lift("Chest Press", "2 x 12 | 4 RIR | Rest 75 s"), lift("Lat Pulldown", "2 x 12 | 4 RIR | Rest 75 s"), lift("Hip Abduction", "2 x 12 | 4 RIR | Rest 60 s")]
  ];

  const G2 = [
    [lift("Hip Thrust Machine", "2 x 12 | 3 RIR | Rest 75 s", true), lift("Seated Row", "2 x 12 | 3 RIR | Rest 75 s"), lift("Shoulder Press Machine", "2 x 12 | 3 RIR | Rest 75 s"), lift("Adductor Machine", "2 x 15 | 3 RIR | Rest 60 s"), lift("Triceps Pushdown", "2 x 12 | 3 RIR | Rest 45 s")],
    [lift("Hip Thrust Machine", "3 x 12 | 3 RIR | Rest 75 s", true), lift("Seated Row", "3 x 12 | 3 RIR | Rest 75 s"), lift("Shoulder Press Machine", "3 x 12 | 3 RIR | Rest 75 s"), lift("Adductor Machine", "3 x 15 | 3 RIR | Rest 60 s"), lift("Triceps Pushdown", "2 x 12 | 3 RIR | Rest 45 s")],
    [lift("Hip Thrust Machine", "3 x 12 | 3 RIR | Rest 75 s", true), lift("Seated Row", "3 x 12 | 3 RIR | Rest 75 s"), lift("Shoulder Press Machine", "3 x 12 | 3 RIR | Rest 75 s"), lift("Adductor Machine", "3 x 15 | 3 RIR | Rest 60 s"), lift("Triceps Pushdown", "3 x 12 | 3 RIR | Rest 45 s")],
    [lift("Hip Thrust Machine", "2 x 12 | 3 RIR | Rest 75 s", true), lift("Seated Row", "2 x 12 | 3 RIR | Rest 75 s"), lift("Shoulder Press Machine", "2 x 12 | 3 RIR | Rest 75 s"), lift("Adductor Machine", "2 x 15 | 3 RIR | Rest 60 s"), lift("Triceps Pushdown", "2 x 12 | 3 RIR | Rest 45 s")],
    [lift("Hip Thrust Machine", "2 x 12 | 4 RIR | Rest 75 s", true), lift("Seated Row", "2 x 12 | 4 RIR | Rest 75 s"), lift("Shoulder Press Machine", "2 x 12 | 4 RIR | Rest 75 s"), lift("Adductor Machine", "2 x 12 | 4 RIR | Rest 60 s")]
  ];

  const G3 = [
    [lift("Leg Extension", "2 x 12 | 3 RIR | Rest 60 s", true), lift("Pec Deck", "2 x 12 | 3 RIR | Rest 60 s"), lift("Face Pull", "2 x 12 | 3 RIR | Rest 60 s"), lift("Cable Glute Kickback", "2 x 12 / side | 3 RIR | Rest 45 s"), lift("Standing Calf Raise", "2 x 15 | 3 RIR | Rest 45 s")],
    [lift("Leg Extension", "2 x 12 | 3 RIR | Rest 60 s", true), lift("Pec Deck", "3 x 12 | 3 RIR | Rest 60 s"), lift("Face Pull", "3 x 12 | 3 RIR | Rest 60 s"), lift("Cable Glute Kickback", "2 x 12 / side | 3 RIR | Rest 45 s"), lift("Standing Calf Raise", "2 x 15 | 3 RIR | Rest 45 s")],
    [lift("Leg Extension", "2 x 12 | 3 RIR | Rest 60 s", true), lift("Pec Deck", "3 x 12 | 3 RIR | Rest 60 s"), lift("Face Pull", "3 x 12 | 3 RIR | Rest 60 s"), lift("Cable Glute Kickback", "3 x 12 / side | 3 RIR | Rest 45 s"), lift("Standing Calf Raise", "2 x 15 | 3 RIR | Rest 45 s")],
    [lift("Leg Extension", "2 x 12 | 4 RIR | Rest 60 s"), lift("Pec Deck", "2 x 12 | 4 RIR | Rest 60 s"), lift("Face Pull", "2 x 12 | 4 RIR | Rest 60 s"), lift("Standing Calf Raise", "2 x 12 | 4 RIR | Rest 45 s")]
  ];

  const PULL = [
    "3 x 3–4 | band | Rest 90 s | last clean rep",
    "4 x 3–4 | same band | Rest 90 s",
    "4 x 4 | same band, or thinner if 4 are easy | Rest 90 s",
    "3 x 3 | easy band | Rest 90 s",
    "3 x 3 | easy band | Rest 90 s"
  ];
  const ABS = [
    ["Dead Bug + Plank", "2 x 6 / side then Front Plank 2 x 25 s"],
    ["V-Ups + Side Plank", "2 x 8 then Side Plank 2 x 20 s / side"],
    ["Machine Crunch + Plank", "2 x 12 then Front Plank 2 x 25 s"]
  ];
  function finisher(weekIdx, absIdx) {
    return [["Banded Pull-Up", PULL[weekIdx]], ABS[absIdx % ABS.length]];
  }

  const WEEKS = [
    {
      week: 1,
      weekLabel: "LEARN",
      blockLabel: "BUILD",
      subtitle: "14–20 September. First long at 12 km. Learn the week. Gym stays easy.",
      weekNote: "Sunday is empty — do not add a fourth run. Every gym day ends with banded pull-ups (3–4 clean reps) plus abs. Lat Pulldown is Monday only. Seated Row is Wednesday only. Friday stays light so Saturday’s 12 km can stay easy.",
      sessions: [
        gymSession(1, 1, "Toning / Push", "40-50", G1[0], finisher(0, 0), "Mon 14 Sep"),
        runSession(2, {
          dayName: "Tue 15 Sep",
          title: "Easy / Aerobic",
          est: "40-50",
          objective: "6 km Zone 2. Full sentences the whole way.",
          steps: [
            "8–10 min easy walk-jog.",
            "6 km Zone 2. If you cannot talk, slow down.",
            "4 min walk to close."
          ],
          focus: "This run only works if it feels too easy. Save the legs for Saturday."
        }),
        gymSession(3, 2, "Toning / Pull", "40-50", G2[0], finisher(0, 1), "Wed 16 Sep"),
        runSession(4, {
          dayName: "Thu 17 Sep",
          title: "Easy / Strides",
          est: "40-50",
          intensity: "Easy. Strides are fast legs, not a sprint.",
          objective: "6 km easy. Finish with 4 short strides.",
          steps: [
            "6 km Zone 2.",
            "4 × 20 s controlled strides on a flat path. Walk back to recover.",
            "Stop each stride before you tighten up."
          ],
          focus: "Strides teach the legs to turn over. They are not intervals."
        }),
        gymSession(5, 3, "Toning / Light", "35-45", G3[0], finisher(0, 2), "Fri 18 Sep"),
        runSession(6, {
          dayName: "Sat 19 Sep",
          title: "Long / 12 km",
          est: "75-95",
          intensity: "Zone 2 for the whole long.",
          objective: "12 km easy. First long of the block.",
          steps: [
            "8–10 min easy. First 3 km slower than the rest.",
            "12 km Zone 2. Full sentences.",
            "Walk 60 s only if you must, then resume easy. Do not sprint the last kilometres."
          ],
          callouts: [
            { label: "The ladder", text: "12 today → 14 → 16 → 18 km on 10 October. Each long is only 2 km longer. Stay easy so next Saturday is possible." }
          ],
          focus: "If kilometre 10 already feels like a 10 km race, you started too fast. Finish the 12 km as a conversation."
        })
      ]
    },
    {
      week: 2,
      weekLabel: "BUILD",
      blockLabel: "BUILD",
      subtitle: "21–27 September. Long 14 km. First real quality run, still short.",
      weekNote: "Thursday is the only session that may feel honest. Saturday’s 14 km stays easy. Friday gym stays light.",
      sessions: [
        gymSession(1, 1, "Toning / Push", "45-55", G1[1], finisher(1, 0), "Mon 21 Sep"),
        runSession(2, {
          dayName: "Tue 22 Sep",
          title: "Easy / Aerobic",
          est: "45-55",
          objective: "7 km Zone 2. Same rule: full sentences.",
          steps: [
            "8 min easy.",
            "7 km Zone 2.",
            "If Tuesday leaves you cooked for Thursday, you ran it too hard."
          ],
          focus: "Volume is the point. Not pace."
        }),
        gymSession(3, 2, "Toning / Pull", "45-55", G2[1], finisher(1, 1), "Wed 23 Sep"),
        runSession(4, {
          dayName: "Thu 24 Sep",
          title: "Quality / Steady",
          est: "45-55",
          intensity: "Zone 3 on the 3-minute pieces only. Short sentences.",
          objective: "First quality dose. Repeatable, not a time trial.",
          steps: [
            "12–15 min Zone 2.",
            "4 × 3 min Zone 3. Jog 90 s easy after each.",
            "10 min Zone 2 to close."
          ],
          callouts: [
            { label: "Quality", text: "The last 3-minute piece should look like the first. If it falls apart, you started too fast." }
          ],
          focus: "One quality run a week is enough. Do not add extra speed."
        }),
        gymSession(5, 3, "Toning / Light", "35-45", G3[1], finisher(1, 2), "Fri 25 Sep"),
        runSession(6, {
          dayName: "Sat 26 Sep",
          title: "Long / 14 km",
          est: "85-105",
          intensity: "Zone 2. Two km more than last Saturday.",
          objective: "14 km easy. Same feel as the 12 km.",
          steps: [
            "8–10 min easy. First 3 km slower than the rest.",
            "14 km Zone 2. Water with you.",
            "Last 2 km stay easy. Do not test the half."
          ],
          callouts: [
            { label: "Fuel", text: "Breakfast before you leave. If you are out longer than 90 min, take a gel or a few chews around minute 60." }
          ],
          focus: "14 km is only +2 km. The jump is small on purpose."
        })
      ]
    },
    {
      week: 3,
      weekLabel: "RHYTHM",
      blockLabel: "SPECIFIC",
      subtitle: "28 September – 4 October. Long 16 km. Taste race rhythm once.",
      weekNote: "Thursday practises race rhythm in short pieces. Saturday’s 16 km stays easy — not race pace.",
      sessions: [
        gymSession(1, 1, "Toning / Push", "45-55", G1[2], finisher(2, 0), "Mon 28 Sep"),
        runSession(2, {
          dayName: "Tue 29 Sep",
          title: "Easy / Aerobic",
          est: "45-55",
          objective: "7–8 km Zone 2.",
          steps: [
            "8 min easy.",
            "7–8 km Zone 2. Choose 7 km if the legs are heavy.",
            "You must be able to talk."
          ],
          focus: "Tuesday never steals Saturday."
        }),
        gymSession(3, 2, "Toning / Pull", "45-55", G2[2], finisher(2, 1), "Wed 30 Sep"),
        runSession(4, {
          dayName: "Thu 1 Oct",
          title: "Quality / Rhythm",
          est: "50-60",
          intensity: "Half rhythm on the 6-minute pieces. Controlled, not a 10 km.",
          objective: "Feel race rhythm without racing.",
          steps: [
            "15 min Zone 2.",
            "3 × 6 min at half-marathon rhythm. Jog 2 min easy after each.",
            "10 min Zone 2 to close."
          ],
          callouts: [
            { label: "Rhythm", text: "Half rhythm is ‘I can hold this’. If you are gasping it is a 10 km, not a half. Slow down." }
          ],
          focus: "This is the most specific quality of the block. Once is enough."
        }),
        gymSession(5, 3, "Toning / Light", "35-45", G3[2], finisher(2, 2), "Fri 2 Oct"),
        runSession(6, {
          dayName: "Sat 3 Oct",
          title: "Long / 16 km",
          est: "95-115",
          intensity: "Zone 2. Last long before the 18 km.",
          objective: "16 km easy. Time on your feet, not pace.",
          steps: [
            "8–10 min easy. First 3 km slower than the rest.",
            "16 km Zone 2. Water. Gel around minute 60–70.",
            "If the last 3 km feel honest, that is fine — they stay Zone 2, not a surge."
          ],
          callouts: [
            { label: "Next Saturday", text: "The 18 km on 10 October is the last long, ten days before the race. Arrive at that run healthy, not heroic today." }
          ],
          focus: "16 km is +2 km again. Same easy feel as 12 and 14."
        })
      ]
    },
    {
      week: 4,
      weekLabel: "PEAK",
      blockLabel: "PEAK",
      subtitle: "5–11 October. Protect Saturday. The 18 km on the 10th is the last hard day.",
      weekNote: "Thursday stays easy on purpose. Friday gym is activation only. The 18 km on Saturday 10 October is ten days before the race — after that you only taper.",
      sessions: [
        gymSession(1, 1, "Toning / Push", "35-45", G1[3], finisher(3, 0), "Mon 5 Oct"),
        runSession(2, {
          dayName: "Tue 6 Oct",
          title: "Easy / Aerobic",
          est: "40-50",
          objective: "6 km Zone 2. Freshness over kilometres.",
          steps: [
            "6 km Zone 2.",
            "Finish better than you started."
          ],
          focus: "Do not sneak in extra kilometres this week."
        }),
        gymSession(3, 2, "Toning / Pull", "35-45", G2[3], finisher(3, 1), "Wed 7 Oct"),
        runSession(4, {
          dayName: "Thu 8 Oct",
          title: "Easy / Strides",
          est: "35-45",
          intensity: "Easy. Saturday is the session.",
          objective: "5 km easy + 4 strides. Keep the 18 km intact.",
          steps: [
            "5 km Zone 2.",
            "4 × 20 s strides. Walk back.",
            "Stop. Go home."
          ],
          focus: "Thursday is not quality this week."
        }),
        gymSession(5, 3, "Activation", "25-35", G3[3], finisher(3, 2), "Fri 9 Oct"),
        runSession(6, {
          dayName: "Sat 10 Oct",
          title: "Last long / 18 km",
          est: "110-130",
          intensity: "Zone 2. Last long. Ten days before the race.",
          objective: "18 km easy. Then the hard work is done.",
          steps: [
            "8–10 min easy. First 3 km slower than the rest.",
            "18 km Zone 2. Water. Gel at 60 min and again near 100 min if you need it.",
            "Do not finish at race pace. The point is to complete 18 km and recover."
          ],
          callouts: [
            { label: "Ten days out", text: "Race is Tuesday 20 October. This is the last long. From tomorrow you only remove fatigue. No extra 16 km, no one more quality." }
          ],
          focus: "18 km is +2 km from last Saturday. Same conversation pace. Then taper."
        })
      ]
    },
    {
      week: 5,
      weekLabel: "TAPER",
      blockLabel: "TAPER",
      subtitle: "12–18 October. Take fatigue out. Two gym days only. Saturday is 8 km.",
      weekNote: "The 18 km is done. Gym drops to Monday and Wednesday. Friday is empty. Do not test yourself.",
      sessions: [
        gymSession(1, 1, "Toning / Push", "30-40", G1[4], finisher(4, 0), "Mon 12 Oct"),
        runSession(2, {
          dayName: "Tue 13 Oct",
          title: "Easy / Taper",
          est: "35-45",
          objective: "5–6 km Zone 2. Genuinely easy.",
          steps: [
            "5–6 km Zone 2.",
            "Finish light."
          ],
          focus: "Taper means you feel under-trained. That is the point."
        }),
        gymSession(3, 2, "Toning / Pull", "30-40", G2[4], finisher(4, 1), "Wed 14 Oct"),
        runSession(4, {
          dayName: "Thu 15 Oct",
          title: "Openers / Rhythm",
          est: "35-45",
          intensity: "Mostly easy. Four short tastes of race rhythm.",
          objective: "Remind the legs of race rhythm. Stop fresh.",
          steps: [
            "15–20 min Zone 2.",
            "4 × 1 min at half-marathon rhythm. Jog 1 min after each.",
            "4 × 20 s strides. Walk back. Stop."
          ],
          callouts: [
            { label: "Taper", text: "These minutes are a reminder, not a workout. If you finish tired, you did too much." }
          ],
          focus: "Openers, then home. Saturday is only 8 km."
        }),
        runSession(6, {
          dayName: "Sat 17 Oct",
          title: "Shake-out / 8 km",
          est: "45-55",
          objective: "8 km easy + 4 strides. Three days before the race.",
          steps: [
            "8 km Zone 2.",
            "4 × 20 s strides.",
            "Sunday is empty."
          ],
          focus: "Last run before Monday’s shake-out. Keep it boring."
        })
      ]
    },
    {
      week: 6,
      weekLabel: "RACE",
      blockLabel: "RACE",
      subtitle: "19–20 October. Arrive light. Race Tuesday — Half Marathon Roma.",
      weekNote: "No gym. Monday is a short shake-out. Tuesday is the half. First 3 km slower than the rhythm you want to hold.",
      sessions: [
        runSession(1, {
          dayName: "Mon 19 Oct",
          title: "Shake-out",
          est: "30-40",
          objective: "25 min easy + 4 strides. Then rest.",
          steps: [
            "25 min Zone 2.",
            "4 × 20 s strides.",
            "Normal meals. Lay out race kit. Sleep."
          ],
          focus: "Legs should feel springy, not trained."
        }),
        runSession(2, {
          dayName: "Tue 20 Oct",
          title: "Race Day",
          est: "120-160",
          intensity: "Half Marathon Roma 21.1 km. Controlled, not a 10 km.",
          objective: "Race. First 3 km slower than the rhythm you want to hold.",
          steps: [
            "Warm-up: 8–10 min easy jog, 3 strides, then to the start.",
            "km 1–3: slower than goal rhythm. Let people go.",
            "km 4–16: half-marathon rhythm. Short sentences. Even effort.",
            "km 16–21.1: only then, if the legs are still yours, squeeze."
          ],
          callouts: [
            { label: "Do not", text: "Do not race the first 10 km. That is how you fade. You ran 18 km ten days ago — trust the easy engine, not a fast open." }
          ],
          focus: "Hold back early. The race starts at kilometre 16, not at the gun."
        })
      ]
    }
  ];

  function document() {
    const weeks = WEEKS.map((week) => ({
      ...SHARED,
      ...week,
      title: SHARED.title,
      subtitle: week.subtitle,
      intro: SHARED.intro,
      weeklyGuidance: SHARED.weeklyGuidance,
      weeklyStructure: SHARED.weeklyStructure
    }));
    return {
      ...SHARED,
      subtitle: SHARED.coverSubtitle,
      weeks,
      sessions: weeks[0].sessions
    };
  }

  const api = { document, WEEKS, SHARED };
  root.EGHalf36 = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
