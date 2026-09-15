/* EverydayGass — HYROX Doubles Apolline / Gaston. 14 Sep–9 Oct. 4 sessions / week. */
(function (root) {
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  function runSession(day, spec) {
    const [min, max] = spec.est.split("-").map(Number);
    return {
      day,
      dayName: spec.dayName || DAYS[day - 1],
      type: "run",
      title: spec.title,
      durationMin: { min, max },
      duration: `${min}–${max} min`,
      intensityLabel: spec.intensity || "",
      objective: spec.objective || "",
      callouts: spec.callouts || [],
      coachNote: spec.focus || "",
      main: spec.steps
        ? spec.steps.map((name) => ({ kind: "step", name }))
        : [{ kind: "step", name: spec.objective.replace(/^Session:\s*/i, "") }]
    };
  }

  function hyroxSession(day, spec) {
    const [min, max] = spec.est.split("-").map(Number);
    return {
      day,
      dayName: spec.dayName || DAYS[day - 1],
      type: "hyrox",
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
    id: "hyrox-doubles-apolline-gaston",
    priority: "hyrox",
    daysPerWeek: 4,
    level: "advanced",
    weekTotal: 4,
    targetHeading: "Your target",
    ruleHeading: "The rule that matters",
    structureHeading: "Key dates",
    raceLoadTitle: "Race load — Doubles Mixed / Men Open",
    title: "HYROX Doubles Apolline/Gaston",
    coverChips: ["Apolline", "Gaston", "HYROX"],
    coverSubtitle: "14 September – 9 October. Race Friday 9 October. Four sessions a week, always run then HYROX, never two HYROX days in a row. Tuesday is a Functional Run with Leman Movement Team (squat each km).",
    intro: "Race Friday 9 October. Both of you run all 8 × 1 km. Stations use the page-1 split. Threshold 4:30/km. Race running sits in Zone 4 at 4:45–4:50/km. When you train alone, do your own share and rest for the partner’s share.",
    weeklyGuidance: [
      "Alternate every time: run day, HYROX day, run day, HYROX day. Tuesday = Functional Run with Leman Movement Team — squat at the end of each kilometre. Pace-change strong parts are 4:50/km. Together: Fri 18 Sep, then 70% doubles simulations on Sat 26 Sep and Thu 1 Oct."
    ],
    strategy: {
      kicker: "Doubles Mixed  /  Men Open  /  Race Friday 9 October",
      title: "Race strategy",
      lead: "You both run every kilometre. Only one person works on a station at a time. Three sessions together: Friday 18 September, Saturday 26 September, Thursday 1 October. This is the split.",
      chips: ["Doubles Mixed", "Men Open loads", "Your split"],
      rulesTitle: "HYROX Doubles rules",
      rules: [
        "You both run all 8 × 1 km. The runs are not split.",
        "On a station, one person works at a time. The other stays in the area, ready, and does not touch the equipment.",
        "You may change whenever you want. You cannot push, pull or throw at the same time.",
        "Leave the station only when the work is finished. Incomplete distance or reps = a penalty.",
        "Mixed Open uses men’s loads: sled push 152 kg, sled pull 103 kg, farmer’s 2 × 24 kg, lunges 20 kg, wall ball 6 kg.",
        "Apolline throws to the 2.70 m target. Gaston throws to the 3.00 m target. Same 6 kg ball.",
        "Standards: squat below parallel on wall balls, hips extended at the top. The whole sled must cross the line."
      ],
      splitTitle: "How you split",
      splitHeaders: ["Station", "Race split", "Apolline"],
      split: [
        { station: "Ski 1000 m", how: "250 m each, twice each. 4 pieces.", her: "2 × 250 m" },
        { station: "Sled Push 50 m", how: "6.25 m each (half of a 12.5 m lane), 4 times each. 8 pieces.", her: "4 × 6.25 m" },
        { station: "Sled Pull 50 m", how: "Same as push: 6.25 m, 4 times each.", her: "4 × 6.25 m" },
        { station: "Burpee Broad Jump 80 m", how: "Change every 6 burpees until 80 m is done.", her: "Sets of 6" },
        { station: "Row 1000 m", how: "500 m each. One change only, to save time.", her: "1 × 500 m" },
        { station: "Farmer’s 200 m", how: "50 m each. 4 pieces, 4 changes. Twice each.", her: "2 × 50 m" },
        { station: "Lunges 100 m", how: "25 m each, or 10 steps. 4 pieces, 4 changes.", her: "2 × 25 m" },
        { station: "Wall Balls 100", how: "10 each, rotating, to 100. Apolline 2.70 m / Gaston 3.00 m.", her: "5 × 10" }
      ],
      trainLabel: "When you train alone",
      trainNote: "Do your own pieces only, then stand still for the partner’s piece. The rest is part of the session. Circuits use these race pieces, not singles distances.",
      footer: "Race strategy  /  Apolline / Gaston"
    },
    scaleCard: {
      title: "If a men’s load will not move",
      noteLabel: "Race-day rule",
      note: "Hand over before form collapses. A clean short piece beats a stalled lane. Gaston can take an extra piece so the station still finishes.",
      blocks: [
        {
          label: "Sled push / pull.",
          text: "If 152 / 103 kg will not move cleanly, use 80% (~122 / ~82 kg) and keep 6.25 m hits. If that still stalls, use Women Open (102 / 78 kg) for technique, then try 1–2 men’s-load hits. Never grind a dead sled — reset the hips or change."
        },
        {
          label: "Farmer’s carry.",
          text: "If 2 × 24 kg will not stay up, use 2 × 20 kg or 2 × 16 kg. Cut pieces to 25 m and change more often. Gaston can take 3 of the 4 pieces if grip goes."
        },
        {
          label: "Wall balls.",
          text: "If 6 kg breaks down, switch to 4 kg at 2.70 m and keep sets of 10. Or stay on 6 kg and drop to sets of 5–8. Gaston can take more tens. Depth and the target matter more than forcing 10."
        }
      ]
    },
    zonesLine: "Threshold 4:30/km. Zone 2 5:10–5:40/km. Zone 3 4:55–5:10/km. Zone 4 race run 4:45–4:50/km. Pace-change strong parts 4:50/km.",
    runWarmupNote: "8–10 min easy Zone 1–2 before every run. Threshold 4:30/km. Zone 2 ~5:10–5:40/km. Zone 4 race running 4:45–4:50/km. Do not open the first kilometre at 4:30.",
    zoneTiles: [
      ["Z1 Recovery", "Walk / shake-out"],
      ["Z2 Easy", "5:10–5:40/km"],
      ["Z3 Steady", "4:55–5:10/km"],
      ["Z4 Race run", "4:45–4:50/km"],
      ["Threshold", "4:30/km"],
      ["Pace-change strong", "4:50/km"]
    ],
    weeklyStructure: [
      ["Tuesday", "Functional Run — Leman Movement Team, squat each km"],
      ["HYROX", "Always the day after a run — never two HYROX days in a row"],
      ["Pace-change", "Fractioned run — strong parts at 4:50/km"],
      ["HYROX", "Together or solo. 70% simulations: 26 Sep and 1 Oct"],
      ["Together", "Fri 18 Sep · Sat 26 Sep (70%) · Thu 1 Oct (70%)"],
      ["Race", "Friday 9 October — Doubles Mixed, Men Open"]
    ]
  };

  const WEEKS = [
    {
      week: 1,
      weekLabel: "LEARN",
      blockLabel: "STATIONS",
      subtitle: "14–20 September. Run / HYROX / run / HYROX. Friday 18 is together.",
      weekNote: "Never two HYROX days in a row. Tuesday Functional Run. Wednesday HYROX. Thursday pace-change. Friday 18 together.",
      sessions: [
        runSession(2, {
          dayName: "Tue 15 Sep",
          title: "Functional Run",
          est: "50-60",
          intensity: "Zone 2. Leman Movement Team.",
          objective: "Easy Functional Run. Squat at the end of every kilometre.",
          steps: [
            "6 km Zone 2 at 5:10–5:40/km.",
            "At the end of each kilometre: 12 squats (bodyweight or light goblet), then jog the next kilometre. Leman Movement Team."
          ],
          focus: "The run stays easy. Squats are crisp, not a sprint. This is Leman Movement Team training.",
          callouts: [
            { label: "Leman Movement Team", text: "Functional Run: easy kilometres + squat each km." }
          ]
        }),
        hyroxSession(3, {
          dayName: "Wed 16 Sep",
          title: "HYROX",
          est: "40-50",
          intensity: "Run 4:45–4:50/km. First-half pieces only.",
          objective: "Ski, sleds, burpees. Stop fresh. Friday is together.",
          steps: [
            "600 m run + 250 m SkiErg, damper 6. Rest 250 m time.",
            "600 m run + 2 × 6.25 m Sled Push: 80% (~122 kg), then 100% (152 kg) if the first hit is clean.",
            "600 m run + 2 × 6.25 m Sled Pull: 80% then 100% (103 kg) if clean.",
            "400 m run + 2 × 6 Burpee Broad Jumps. Rest after every 6."
          ],
          focus: "No row, farmer’s, lunges or wall balls today. Those are Friday with Gaston. If a sled will not move, drop the load — see the guide."
        }),
        runSession(4, {
          dayName: "Thu 17 Sep",
          title: "Pace change",
          est: "40-50",
          intensity: "Fractioned. Strong parts at 4:50/km.",
          objective: "Change pace. Strong parts use 4:50/km as the reference.",
          steps: [
            "10 min easy Zone 2.",
            "6 × 2 min at 4:50/km. Recover 90 s very easy jogging after each.",
            "8 min easy close."
          ],
          focus: "4:50/km is the strong-part reference, not 4:30. If the last block fades, you started too hard."
        }),
        hyroxSession(5, {
          dayName: "Fri 18 Sep",
          title: "HYROX together",
          est: "50-65",
          intensity: "With Gaston. 600 m runs at 4:45–4:50/km.",
          objective: "Second-half split. Do not race the clock.",
          steps: [
            "600 m run together.",
            "RowErg 500 m + 500 m, damper 6. One change only.",
            "600 m run together.",
            "Sandbag Lunges 4 × 25 m (or 10 steps) at 20 kg. Alternate.",
            "600 m run together.",
            "Farmer’s Carry 4 × 50 m at 2 × 24 kg. Alternate. Scale to 2 × 20 or 2 × 16 if needed.",
            "600 m run together.",
            "Wall Balls 6 × 10 at 6 kg (60 reps). Apolline 2.70 m / Gaston 3.00 m. Tens only."
          ],
          focus: "Apolline: 1 × 500 m row, 2 × 25 m lunges, 2 × 50 m farmer’s, 3 × 10 wall balls. One works, one waits."
        })
      ]
    },
    {
      week: 2,
      weekLabel: "SPECIFIC",
      blockLabel: "COMPROMISE",
      subtitle: "21–27 September. Thursday 24 is a no-run circuit. Saturday 26 is a 70% doubles simulation.",
      weekNote: "Run / pace-change / HYROX / rest / HYROX. Never two HYROX days in a row. Friday 25 is off so Saturday can be the 70% simulation.",
      sessions: [
        runSession(2, {
          dayName: "Tue 22 Sep",
          title: "Functional Run",
          est: "50-60",
          intensity: "Zone 2. Leman Movement Team.",
          objective: "Easy Functional Run. Squat at the end of every kilometre.",
          steps: [
            "7 km Zone 2 at 5:10–5:40/km.",
            "At the end of each kilometre: 12 squats, then jog on. Leman Movement Team."
          ],
          focus: "Keep talking on the run. Squats stay controlled."
        }),
        runSession(3, {
          dayName: "Wed 23 Sep",
          title: "Pace change",
          est: "45-55",
          intensity: "Fractioned. Strong parts at 4:50/km.",
          objective: "Strong parts use 4:50/km as the reference.",
          steps: [
            "10 min easy Zone 2.",
            "5 × 3 min at 4:50/km. Recover 2 min very easy jogging after each.",
            "8 min easy close."
          ],
          focus: "4:50/km on the strong parts. Not 4:30. Repeatable, not a time trial.",
          callouts: [
            { label: "Quality cue", text: "If the last interval is much slower than the first, you started too fast." }
          ]
        }),
        hyroxSession(4, {
          dayName: "Thu 24 Sep",
          title: "HYROX no-run",
          est: "40-55",
          intensity: "No run. Station circuit only.",
          objective: "No-run circuit. Your race pieces. Rest = the partner’s piece.",
          steps: [
            "SkiErg 2 × 250 m, damper 6. Rest = 250 m time after each.",
            "Sled Push 4 × 6.25 m at 152 kg, or 80% if it will not move. Rest 10–15 s.",
            "Sled Pull 4 × 6.25 m at 103 kg, or 80% if needed. Same rest.",
            "Farmer’s Carry 2 × 50 m at 2 × 24 kg, or 2 × 20 / 2 × 16 if grip goes.",
            "Sandbag Lunges 2 × 25 m (or 10 steps) at 20 kg.",
            "Wall Balls 5 × 10 at 6 kg or 4 kg, 2.70 m. Burpees 3 × 6."
          ],
          focus: "No running today. Friday is off. Saturday 26 is the 70% doubles simulation with Gaston."
        }),
        hyroxSession(6, {
          dayName: "Sat 26 Sep",
          title: "HYROX together",
          est: "70-85",
          intensity: "With Gaston. 70% doubles simulation. Runs at 4:45–4:50/km.",
          objective: "70% race-order simulation. Page-1 split. Do not race the clock.",
          steps: [
            "700 m run + SkiErg 4 × 250 m alternate, damper 6.",
            "700 m run + Sled Push 8 × 6.25 m at 152 kg. Alternate. Scale if needed.",
            "700 m run + Sled Pull 8 × 6.25 m at 103 kg. Alternate.",
            "700 m run + Burpee Broad Jumps, change every 6, to ~60 m.",
            "700 m run + RowErg 500 m + 500 m, damper 6. One change.",
            "700 m run + Farmer’s 4 × 50 m at 2 × 24 kg. Alternate.",
            "700 m run + Lunges 4 × 25 m at 20 kg (or 10 steps). Alternate.",
            "700 m run + Wall Balls in 10s to ~70 reps. Apolline 2.70 m / Gaston 3.00 m."
          ],
          focus: "About 70% of race volume: 700 m runs, full split, ~70 wall balls. Keep energy. Next 70% simulation is 1 October.",
          callouts: [
            { label: "70% simulation", text: "Race order, race split, not race intensity. Runs at 4:45–4:50/km." }
          ]
        })
      ]
    },
    {
      week: 3,
      weekLabel: "SHARPEN",
      blockLabel: "REHEARSAL",
      subtitle: "28 September – 4 October. Thursday 1 Oct is the 70% simulation. Saturday 3 Oct is an intense HYROX circuit.",
      weekNote: "Functional Run, pace-change, 70% simulation, Friday off, then Saturday intense HYROX. Never two HYROX days in a row.",
      sessions: [
        runSession(2, {
          dayName: "Tue 29 Sep",
          title: "Functional Run",
          est: "45-55",
          intensity: "Zone 2. Leman Movement Team.",
          objective: "Easy Functional Run. Squat at the end of every kilometre.",
          steps: [
            "5–6 km Zone 2 at 5:10–5:40/km.",
            "At the end of each kilometre: 10–12 squats, then jog on. Leman Movement Team."
          ],
          focus: "Keep it light before Thursday’s 70% simulation. No sleds today."
        }),
        runSession(3, {
          dayName: "Wed 30 Sep",
          title: "Pace change",
          est: "40-50",
          intensity: "Fractioned. Strong parts at 4:50/km.",
          objective: "Stay crisp for tomorrow. Strong parts at 4:50/km.",
          steps: [
            "10 min easy Zone 2.",
            "4 × 2 min at 4:50/km. Recover 2 min very easy.",
            "8 min easy close."
          ],
          focus: "Shorter than last week. Thursday is the session that matters."
        }),
        hyroxSession(4, {
          dayName: "Thu 1 Oct",
          title: "HYROX together",
          est: "70-85",
          intensity: "With Gaston. 70% doubles simulation. Runs at 4:45–4:50/km.",
          objective: "70% race-order simulation. Page-1 split. Do not race the clock.",
          steps: [
            "700 m run + SkiErg 4 × 250 m alternate, damper 6.",
            "700 m run + Sled Push 8 × 6.25 m at 152 kg. Alternate. Scale if needed.",
            "700 m run + Sled Pull 8 × 6.25 m at 103 kg. Alternate.",
            "700 m run + Burpee Broad Jumps, change every 6, to ~60 m.",
            "700 m run + RowErg 500 m + 500 m, damper 6. One change.",
            "700 m run + Farmer’s 4 × 50 m at 2 × 24 kg. Alternate. Scale if grip goes.",
            "700 m run + Lunges 4 × 25 m at 20 kg (or 10 steps). Alternate.",
            "700 m run + Wall Balls in 10s to ~70 reps. Apolline 2.70 m / Gaston 3.00 m."
          ],
          focus: "Same 70% format as 26 September. If a piece breaks, take the rest and continue. Friday is off. Saturday is an intense circuit.",
          callouts: [
            { label: "70% simulation", text: "Race order, race split, not a full race. Runs at 4:45–4:50/km. Keep energy for 9 October." }
          ]
        }),
        hyroxSession(6, {
          dayName: "Sat 3 Oct",
          title: "HYROX",
          est: "45-60",
          intensity: "Intense circuit. Runs at 4:45–4:50/km.",
          objective: "Hard station density. Your race pieces. Short rest. Not a full simulation.",
          steps: [
            "4 rounds. Rest 90–120 s between rounds only.",
            "500 m run at 4:45–4:50/km.",
            "250 m SkiErg, damper 6.",
            "2 × 6.25 m Sled Push at 152 kg, or 80% if it will not move.",
            "250 m RowErg, damper 6.",
            "10 Wall Balls at 6 kg, 2.70 m + 6 Burpee Broad Jumps.",
            "After the 4 rounds: Farmer’s 2 × 50 m + Lunges 2 × 25 m at race load, or scaled."
          ],
          focus: "This is meant to be hard. Keep the run at 4:45–4:50/km. Scale sleds, farmer’s or wall balls if a men’s load will not move.",
          callouts: [
            { label: "Intense", text: "Friday was off on purpose. Stop a round if form collapses, then finish the remaining rounds." }
          ]
        })
      ]
    },
    {
      week: 4,
      weekLabel: "TAPER",
      blockLabel: "RACE",
      subtitle: "5–9 October. Arrive light. Race is Friday 9 October.",
      weekNote: "Functional Run, short HYROX, easy shake-out, race. Never two HYROX days in a row.",
      sessions: [
        runSession(2, {
          dayName: "Tue 6 Oct",
          title: "Functional Run",
          est: "35-45",
          intensity: "Zone 2. Leman Movement Team. Taper.",
          objective: "Short Functional Run. Squat at the end of every kilometre.",
          steps: [
            "4 km Zone 2 at 5:10–5:40/km.",
            "At the end of each kilometre: 8–10 squats, then jog on. Leman Movement Team."
          ],
          focus: "Feel the rhythm. Do not chase fatigue."
        }),
        hyroxSession(3, {
          dayName: "Wed 7 Oct",
          title: "HYROX",
          est: "25-35",
          intensity: "Activation only. Runs at 4:45–4:50/km.",
          objective: "Stop fresh. Friday is the race.",
          steps: [
            "600 m run + 250 m SkiErg, damper 5.",
            "600 m run + 50 m Farmer’s at 80% (~2 × 20 kg) or lighter.",
            "600 m run + 10 Wall Balls at 6 kg, 2.70 m."
          ],
          focus: "One ski piece, one farmer’s piece, one wall-ball ten. No sled, no lunges."
        }),
        runSession(4, {
          dayName: "Thu 8 Oct",
          title: "Rest / shake-out",
          est: "15-25",
          objective: "Arrive tomorrow light.",
          steps: ["Rest, or 15–20 min easy jog + 3 strides. No stations. No squats."],
          focus: "A run / rest day after HYROX. If you feel the need to train, you are already doing enough."
        }),
        hyroxSession(5, {
          dayName: "Fri 9 Oct",
          title: "Race day",
          est: "75-100",
          intensity: "HYROX Doubles Mixed — Men Open loads.",
          objective: "Race. You both run all 8 × 1 km. Stations use the page-1 split.",
          steps: [
            "Warm-up: 10 min easy jog, 3 strides, 150 m ski, 10 wall balls, 6.25 m empty / light sled.",
            "Open every run at 4:45–4:50/km. Threshold 4:30/km is not the race-run pace.",
            "Ski 2 × 250 m · Push 4 × 6.25 m · Pull 4 × 6.25 m · Burpees every 6 · Row 1 × 500 m · Farmer’s 2 × 50 m · Lunges 2 × 25 m · Wall Balls 5 × 10.",
            "Loads: Push 152 kg · Pull 103 kg · Farmer’s 2 × 24 kg · Lunges 20 kg · Wall Ball 6 kg. Apolline 2.70 m / Gaston 3.00 m.",
            "If a men’s load will not move, change sooner — Gaston takes the extra piece."
          ],
          focus: "Run the split you practised on 18 Sep, 26 Sep and 1 Oct.",
          callouts: [
            { label: "Wall balls", text: "10 and off. Apolline 2.70 m. Gaston 3.00 m. Same 6 kg ball." }
          ]
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
  root.EGDoubles25 = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
