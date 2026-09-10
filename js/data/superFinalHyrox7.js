/* Master: Advanced_7_Days_HYROX_Focus_SUPER_FINAL — 12 weeks, 14-page mobile plan. */
(function (root) {
  if (typeof require !== "undefined" && !root.EGLibrary) require("./library.js");
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const COVER = {
    documentTitle: "12-Week Hybrid Performance Plan",
    subtitle: "A structured strength, running and HYROX progression designed to build performance without turning every day into a maximal session.",
    intro: "Build strength, improve half-marathon endurance, master HYROX race loads and finish the block with a full HYROX simulation in control — including the capacity to attack 100 Wall Balls with confidence.",
    rule: "Keep easy sessions genuinely easy. Seven training days only work when intensity is controlled. Core work is built into every gym day so HYROX sessions can stay specific.",
    structure: [
      ["Monday", "Gym 1 — Legs / Shoulders / Triceps"],
      ["Tuesday", "Week A: Easy Zone 2 | Week B: Quality / Fartlek"],
      ["Wednesday", "Gym 2 — Chest / Back / Biceps"],
      ["Thursday", "HYROX — Run Focus"],
      ["Friday", "Gym 3 — Full Body"],
      ["Saturday", "Week A: Progressive Long Run | Week B: Shorter Endurance Run"],
      ["Sunday", "HYROX — No Run"]
    ]
  };

  const WEEK_META = [
    { week: 1, weekLabel: "WEEK A", blockLabel: "FOUNDATION", subtitle: "Build capacity and establish working loads." },
    { week: 2, weekLabel: "WEEK B", blockLabel: "FOUNDATION", subtitle: "Build capacity and establish working loads." },
    { week: 3, weekLabel: "WEEK A", blockLabel: "FOUNDATION", subtitle: "Build capacity and establish working loads." },
    { week: 4, weekLabel: "WEEK B", blockLabel: "RECOVERY", subtitle: "Reduce fatigue. Keep every movement clean.", weekNote: "Reduce volume, keep movement quality high and finish sessions feeling better than you started." },
    { week: 5, weekLabel: "WEEK A", blockLabel: "INTENSIFICATION", subtitle: "Increase intensity without sacrificing running quality." },
    { week: 6, weekLabel: "WEEK B", blockLabel: "INTENSIFICATION", subtitle: "Increase intensity without sacrificing running quality." },
    { week: 7, weekLabel: "WEEK A", blockLabel: "INTENSIFICATION", subtitle: "Race-specific build. Keep transitions controlled.", weekNote: "Training becomes more specific. Protect running quality and HYROX execution; avoid turning accessory work into extra tests." },
    { week: 8, weekLabel: "WEEK B", blockLabel: "RECOVERY", subtitle: "Reduce fatigue. Keep every movement clean.", weekNote: "Reduce volume, keep movement quality high and finish sessions feeling better than you started." },
    { week: 9, weekLabel: "WEEK A", blockLabel: "SPECIFICITY", subtitle: "Strength + HYROX specificity. Protect execution.", weekNote: "Training becomes more specific. Protect running quality and HYROX execution; avoid turning accessory work into extra tests." },
    { week: 10, weekLabel: "WEEK B", blockLabel: "SPECIFICITY", subtitle: "Strength + HYROX specificity. Protect execution.", weekNote: "Training becomes more specific. Protect running quality and HYROX execution; avoid turning accessory work into extra tests." },
    { week: 11, weekLabel: "WEEK A", blockLabel: "SHARPEN", subtitle: "Sharpen. Finish sessions with energy in reserve.", weekNote: "Training becomes more specific. Protect running quality and HYROX execution; avoid turning accessory work into extra tests." },
    { week: 12, weekLabel: "PEAK WEEK", blockLabel: "PEAK", subtitle: "Peak week. Arrive fresh for the full HYROX simulation.", weekNote: "Do not chase extra fatigue. Keep the early week controlled and arrive at Sunday ready to execute a full HYROX with race-load confidence. If your actual half-marathon race is this week, replace Sunday’s full HYROX and move the HYROX rehearsal to Week 10 or Week 11." }
  ];

  const G1_NAMES = [
    ["Back Squat", true], ["Leg Press", false], ["Leg Curl", false], ["Hip Thrust", false],
    ["Military Press", true], ["Lateral Raise", false], ["Overhead Triceps Extension", false], ["Rope Pushdown", false]
  ];
  const G2_NAMES = [
    ["Bench Press", true], ["Incline DB Press", false], ["Cable / DB Fly", false], ["Lat Pulldown / Pull-Up", false],
    ["Seated Row", false], ["Single-Arm Row / Pulldown", false], ["Hammer Curl", false], ["Cable Curl", false]
  ];
  const G3_NAMES = [
    ["Deadlift", true], ["Incline Bench Press", false], ["Chest-Supported / Wide Row", false], ["DB Shoulder Press", false],
    ["Leg Extension", false], ["DB Shrugs", false], ["EZ-Bar Curl", false], ["Pushdown", false]
  ];

  const G1_RX = [
    ["Top 1 x 6 | 2 RIR | ~ 80% 1RM | Back-off 3 x 6 | 3 RIR | ~ 77% 1RM Rest 3-4 min", "3 x 10 | 3 RIR | ~ 67-70% 1RM Rest 2 min", "3 x 12 | 3 RIR | ~ 62-65% 1RM Rest 90-120 s", "3 x 10 | 3 RIR | ~ 68-70% 1RM Rest 2 min", "Top 1 x 6 | 2 RIR | ~ 80% 1RM | Back-off 3 x 6 | 3 RIR | ~ 77% 1RM Rest 3 min", "3 x 12-15 | 3 RIR | ~ 55-62% 1RM Rest 90 s", "3 x 10-12 | 3 RIR | ~ 62-68% 1RM Rest 90 s", "2 x 12-15 | 2 RIR | ~ 58-65% 1RM Rest 60-90 s"],
    ["Top 1 x 5 | 2 RIR | ~ 82% 1RM | Back-off 3 x 6 | 2 RIR | ~ 80% 1RM Rest 3-4 min", "3 x 10 | 2 RIR | ~ 70-72% 1RM Rest 2 min", "3 x 12 | 2 RIR | ~ 65-67% 1RM Rest 90-120 s", "3 x 10 | 2 RIR | ~ 70-72% 1RM Rest 2 min", "Top 1 x 5 | 2 RIR | ~ 82% 1RM | Back-off 3 x 6 | 2 RIR | ~ 80% 1RM Rest 3 min", "3 x 12-15 | 2 RIR | ~ 58-65% 1RM Rest 90 s", "3 x 10-12 | 2 RIR | ~ 65-70% 1RM Rest 90 s", "2 x 12-15 | 2 RIR | ~ 58-65% 1RM Rest 60-90 s"],
    ["Top 1 x 4 | 1-2 RIR | ~ 85% 1RM | Back-off 3 x 5 | 2 RIR | ~ 82% 1RM Rest 3-4 min", "3 x 8-10 | 1-2 RIR | ~ 73-78% 1RM Rest 2 min", "3 x 10-12 | 1-2 RIR | ~ 68-73% 1RM Rest 90-120 s", "3 x 8-10 | 1-2 RIR | ~ 73-78% 1RM Rest 2 min", "Top 1 x 4-5 | 1-2 RIR | ~ 84-86% 1RM | Back-off 3 x 5 | 2 RIR | ~ 82% 1RM Rest 3 min", "3 x 12-15 | 1 RIR | ~ 62-68% 1RM Rest 90 s", "3 x 8-12 | 1-2 RIR | ~ 68-75% 1RM Rest 90 s", "2 x 12-15 | 1 RIR | ~ 62-68% 1RM Rest 60-90 s"],
    ["3 x 5 | 4 RIR | ~ 75-77% 1RM Rest 3-4 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "2 x 12 | 4 RIR | ~ 57-60% 1RM Rest 90-120 s", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "3 x 5 | 4 RIR | ~ 75-77% 1RM Rest 3 min", "2 x 12-15 | 4 RIR | ~ 50-57% 1RM Rest 90 s", "2 x 10-12 | 4 RIR | ~ 58-63% 1RM Rest 90 s", "1-2 x 12-15 | 4 RIR | ~ 50-57% 1RM Rest 60-90 s"],
    ["Top 1 x 5 | 2 RIR | ~ 82% 1RM | Back-off 3 x 5 | 3 RIR | ~ 79% 1RM Rest 3-4 min", "3 x 8-10 | 3 RIR | ~ 70-74% 1RM Rest 2 min", "3 x 10-12 | 3 RIR | ~ 62-68% 1RM Rest 90-120 s", "3 x 8-10 | 3 RIR | ~ 70-74% 1RM Rest 2 min", "Top 1 x 5 | 2 RIR | ~ 82% 1RM | Back-off 3 x 5 | 3 RIR | ~ 79% 1RM Rest 3 min", "3 x 12-15 | 3 RIR | ~ 55-62% 1RM Rest 90 s", "3 x 8-12 | 3 RIR | ~ 65-72% 1RM Rest 90 s", "2 x 10-15 | 2 RIR | ~ 60-68% 1RM Rest 60-90 s"],
    ["Top 1 x 4 | 2 RIR | ~ 85% 1RM | Back-off 3 x 5 | 2 RIR | ~ 82% 1RM Rest 3-4 min", "3 x 8-10 | 2 RIR | ~ 73-77% 1RM Rest 2 min", "3 x 10-12 | 2 RIR | ~ 65-70% 1RM Rest 90-120 s", "3 x 8 | 2 RIR | ~ 75% 1RM Rest 2 min", "Top 1 x 4 | 2 RIR | ~ 85% 1RM | Back-off 3 x 5 | 2 RIR | ~ 82% 1RM Rest 3 min", "3 x 12-15 | 2 RIR | ~ 58-65% 1RM Rest 90 s", "3 x 8-12 | 2 RIR | ~ 68-74% 1RM Rest 90 s", "2 x 10-15 | 1-2 RIR | ~ 64-72% 1RM Rest 60-90 s"],
    ["Top 1 x 3 | 1-2 RIR | ~ 88% 1RM | Back-off 3 x 4 | 2 RIR | ~ 84-85% 1RM Rest 3-4 min", "3 x 8 | 1-2 RIR | ~ 78-80% 1RM Rest 2 min", "3 x 8-10 | 1-2 RIR | ~ 72-78% 1RM Rest 90-120 s", "3 x 6-8 | 1-2 RIR | ~ 78-83% 1RM Rest 2 min", "Top 1 x 3 | 1-2 RIR | ~ 88% 1RM | Back-off 3 x 4 | 2 RIR | ~ 84-85% 1RM Rest 3 min", "3 x 12-15 | 1 RIR | ~ 62-68% 1RM Rest 90 s", "3 x 8-10 | 1 RIR | ~ 73-78% 1RM Rest 90 s", "2 x 10-12 | 1 RIR | ~ 70-74% 1RM Rest 60-90 s"],
    ["3 x 4 | 4 RIR | ~ 76-78% 1RM Rest 3-4 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "2 x 12 | 4 RIR | ~ 57-60% 1RM Rest 90-120 s", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "3 x 4 | 4 RIR | ~ 76-78% 1RM Rest 3 min", "2 x 12-15 | 4 RIR | ~ 50-57% 1RM Rest 90 s", "2 x 10-12 | 4 RIR | ~ 58-63% 1RM Rest 90 s", "1-2 x 12 | 4 RIR | ~ 55-58% 1RM Rest 60-90 s"],
    ["Top 1 x 4 | 2 RIR | ~ 85% 1RM | Back-off 2 x 4 | 3 RIR | ~ 82% 1RM Rest 3-4 min", "3 x 8 | 3 RIR | ~ 72% 1RM Rest 2 min", "3 x 10 | 3 RIR | ~ 67% 1RM Rest 90-120 s", "3 x 8 | 3 RIR | ~ 72% 1RM Rest 2 min", "Top 1 x 4 | 2 RIR | ~ 85% 1RM | Back-off 2 x 4 | 3 RIR | ~ 82% 1RM Rest 3 min", "3 x 12 | 3 RIR | ~ 60-62% 1RM Rest 90 s", "3 x 8-10 | 3 RIR | ~ 68-72% 1RM Rest 90 s", "2 x 10-12 | 2 RIR | ~ 65-70% 1RM Rest 60-90 s"],
    ["Top 1 x 3 | 1-2 RIR | ~ 88% 1RM | Back-off 3 x 3 | 2 RIR | ~ 85% 1RM Rest 3-4 min", "3 x 6-8 | 2 RIR | ~ 76-82% 1RM Rest 2 min", "3 x 8-10 | 2 RIR | ~ 72-77% 1RM Rest 90-120 s", "3 x 6-8 | 2 RIR | ~ 76-82% 1RM Rest 2 min", "Top 1 x 3 | 1-2 RIR | ~ 88% 1RM | Back-off 3 x 3 | 2 RIR | ~ 85% 1RM Rest 3 min", "3 x 10-12 | 2 RIR | ~ 65-70% 1RM Rest 90 s", "3 x 8-10 | 2 RIR | ~ 72-75% 1RM Rest 90 s", "2 x 10 | 1-2 RIR | ~ 72-75% 1RM Rest 60-90 s"],
    ["Top 1 x 2-3 | 1 RIR | ~ 90-92% 1RM | Back-off 2 x 3 | 2 RIR | ~ 87% 1RM Rest 3-4 min", "2 x 6-8 | 1-2 RIR | ~ 80-84% 1RM Rest 2 min", "2 x 8-10 | 1-2 RIR | ~ 76-80% 1RM Rest 90-120 s", "2 x 6-8 | 1-2 RIR | ~ 80-84% 1RM Rest 2 min", "Top 1 x 2-3 | 1 RIR | ~ 90% 1RM | Back-off 2 x 3 | 2 RIR | ~ 87% 1RM Rest 3 min", "2 x 10-12 | 1 RIR | ~ 70-74% 1RM Rest 90 s", "2 x 8-10 | 1 RIR | ~ 75-78% 1RM Rest 90 s", "2 x 10 | 1 RIR | ~ 74-76% 1RM Rest 60-90 s"],
    ["2 x 5 | 4 RIR | ~ 72-75% 1RM Rest 3-4 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "2 x 12 | 4 RIR | ~ 57-60% 1RM Rest 90-120 s", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "2 x 5 | 4 RIR | ~ 72-75% 1RM Rest 3 min", "2 x 15 | 4 RIR | ~ 50-55% 1RM Rest 90 s", "2 x 12 | 4 RIR | ~ 55-58% 1RM Rest 90 s", "1-2 x 15 | 4 RIR | ~ 50-55% 1RM Rest 60-90 s"]
  ];

  const G2_RX = [
    ["Top 1 x 6 | 2 RIR | ~ 80% 1RM | Back-off 3 x 6 | 3 RIR | ~ 77% 1RM Rest 3-4 min", "3 x 10 | 3 RIR | ~ 67-70% 1RM Rest 2 min", "2 x 12-15 | 3 RIR | ~ 55-62% 1RM Rest 90 s", "4 x 8-10 | 3 RIR | ~ 68-74% 1RM Rest 2 min", "3 x 10 | 3 RIR | ~ 67-70% 1RM Rest 2 min", "3 x 10-12 | 3 RIR | ~ 62-68% 1RM Rest 90 s", "3 x 10-12 | 3 RIR | ~ 62-68% 1RM Rest 90 s", "2 x 12-15 | 2 RIR | ~ 58-65% 1RM Rest 60-90 s"],
    ["Top 1 x 5 | 2 RIR | ~ 82% 1RM | Back-off 3 x 6 | 2 RIR | ~ 80% 1RM Rest 3-4 min", "3 x 10 | 2 RIR | ~ 70-72% 1RM Rest 2 min", "2 x 12-15 | 2 RIR | ~ 58-65% 1RM Rest 90 s", "4 x 8-10 | 2 RIR | ~ 72-77% 1RM Rest 2 min", "3 x 10 | 2 RIR | ~ 70-72% 1RM Rest 2 min", "3 x 10-12 | 2 RIR | ~ 65-70% 1RM Rest 90 s", "3 x 10-12 | 2 RIR | ~ 65-70% 1RM Rest 90 s", "2 x 12-15 | 2 RIR | ~ 58-65% 1RM Rest 60-90 s"],
    ["Top 1 x 4 | 1-2 RIR | ~ 85% 1RM | Back-off 3 x 5 | 2 RIR | ~ 82% 1RM Rest 3-4 min", "3 x 8-10 | 1-2 RIR | ~ 73-78% 1RM Rest 2 min", "2 x 12-15 | 1 RIR | ~ 62-68% 1RM Rest 90 s", "4 x 6-10 | 1-2 RIR | ~ 76-83% 1RM Rest 2 min", "3 x 8-10 | 1-2 RIR | ~ 73-78% 1RM Rest 2 min", "3 x 10-12 | 1-2 RIR | ~ 68-73% 1RM Rest 90 s", "3 x 8-12 | 1 RIR | ~ 70-76% 1RM Rest 90 s", "2 x 12-15 | 1 RIR | ~ 62-68% 1RM Rest 60-90 s"],
    ["3 x 5 | 4 RIR | ~ 75-77% 1RM Rest 3-4 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "1-2 x 12-15 | 4 RIR | ~ 50-57% 1RM Rest 90 s", "3 x 8 | 4 RIR | ~ 65-68% 1RM Rest 2 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "2 x 10-12 | 4 RIR | ~ 58-63% 1RM Rest 90 s", "2 x 10-12 | 4 RIR | ~ 58-63% 1RM Rest 90 s", "1-2 x 12-15 | 4 RIR | ~ 50-57% 1RM Rest 60-90 s"],
    ["Top 1 x 5 | 2 RIR | ~ 82% 1RM | Back-off 3 x 5 | 3 RIR | ~ 79% 1RM Rest 3-4 min", "3 x 8-10 | 3 RIR | ~ 70-74% 1RM Rest 2 min", "2 x 12-15 | 3 RIR | ~ 55-62% 1RM Rest 90 s", "4 x 8 | 3 RIR | ~ 72% 1RM Rest 2 min", "3 x 8-10 | 3 RIR | ~ 70-74% 1RM Rest 2 min", "3 x 10 | 3 RIR | ~ 67-70% 1RM Rest 90 s", "3 x 8-12 | 3 RIR | ~ 65-72% 1RM Rest 90 s", "2 x 10-15 | 2 RIR | ~ 60-68% 1RM Rest 60-90 s"],
    ["Top 1 x 4 | 2 RIR | ~ 85% 1RM | Back-off 3 x 5 | 2 RIR | ~ 82% 1RM Rest 3-4 min", "3 x 8-10 | 2 RIR | ~ 73-77% 1RM Rest 2 min", "2 x 10-15 | 2 RIR | ~ 60-68% 1RM Rest 90 s", "4 x 6-8 | 2 RIR | ~ 76-82% 1RM Rest 2 min", "3 x 8-10 | 2 RIR | ~ 73-77% 1RM Rest 2 min", "3 x 8-10 | 2 RIR | ~ 73-77% 1RM Rest 90 s", "3 x 8-12 | 2 RIR | ~ 68-74% 1RM Rest 90 s", "2 x 10-15 | 1-2 RIR | ~ 64-72% 1RM Rest 60-90 s"],
    ["Top 1 x 3 | 1-2 RIR | ~ 88% 1RM | Back-off 3 x 4 | 2 RIR | ~ 84-85% 1RM Rest 3-4 min", "3 x 6-8 | 1-2 RIR | ~ 78-83% 1RM Rest 2 min", "2 x 10-12 | 1 RIR | ~ 70-74% 1RM Rest 90 s", "4 x 6-8 | 1-2 RIR | ~ 80-84% 1RM Rest 2 min", "3 x 8 | 1-2 RIR | ~ 78-80% 1RM Rest 2 min", "3 x 8-10 | 1-2 RIR | ~ 76-80% 1RM Rest 90 s", "3 x 8-10 | 1 RIR | ~ 73-78% 1RM Rest 90 s", "2 x 10-12 | 1 RIR | ~ 70-74% 1RM Rest 60-90 s"],
    ["3 x 4 | 4 RIR | ~ 76-78% 1RM Rest 3-4 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "1-2 x 12-15 | 4 RIR | ~ 50-57% 1RM Rest 90 s", "3 x 8 | 4 RIR | ~ 65-68% 1RM Rest 2 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 90 s", "2 x 10-12 | 4 RIR | ~ 58-63% 1RM Rest 90 s", "1-2 x 12 | 4 RIR | ~ 55-58% 1RM Rest 60-90 s"],
    ["Top 1 x 4 | 2 RIR | ~ 85% 1RM | Back-off 2 x 4 | 3 RIR | ~ 82% 1RM Rest 3-4 min", "3 x 8 | 3 RIR | ~ 72% 1RM Rest 2 min", "2 x 12 | 3 RIR | ~ 60-62% 1RM Rest 90 s", "4 x 6-8 | 3 RIR | ~ 76-80% 1RM Rest 2 min", "3 x 8 | 3 RIR | ~ 72% 1RM Rest 2 min", "3 x 8-10 | 3 RIR | ~ 70-74% 1RM Rest 90 s", "3 x 8-10 | 3 RIR | ~ 68-72% 1RM Rest 90 s", "2 x 10-12 | 2 RIR | ~ 65-70% 1RM Rest 60-90 s"],
    ["Top 1 x 3 | 1-2 RIR | ~ 88% 1RM | Back-off 3 x 3 | 2 RIR | ~ 85% 1RM Rest 3-4 min", "3 x 6-8 | 2 RIR | ~ 76-82% 1RM Rest 2 min", "2 x 10-12 | 2 RIR | ~ 65-70% 1RM Rest 90 s", "4 x 6 | 2 RIR | ~ 82% 1RM Rest 2 min", "3 x 6-8 | 2 RIR | ~ 76-82% 1RM Rest 2 min", "3 x 8 | 2 RIR | ~ 75% 1RM Rest 90 s", "3 x 8 | 2 RIR | ~ 75% 1RM Rest 90 s", "2 x 10 | 1-2 RIR | ~ 72-75% 1RM Rest 60-90 s"],
    ["Top 1 x 2-3 | 1 RIR | ~ 90-92% 1RM | Back-off 2 x 3 | 2 RIR | ~ 87% 1RM Rest 3-4 min", "2 x 6-8 | 1-2 RIR | ~ 80-84% 1RM Rest 2 min", "2 x 10 | 1 RIR | ~ 74-76% 1RM Rest 90 s", "3 x 5-6 | 1-2 RIR | ~ 84-87% 1RM Rest 2 min", "2 x 6-8 | 1-2 RIR | ~ 80-84% 1RM Rest 2 min", "2 x 8 | 1-2 RIR | ~ 78-80% 1RM Rest 90 s", "2 x 8 | 1 RIR | ~ 78-80% 1RM Rest 90 s", "2 x 8-10 | 1 RIR | ~ 75-80% 1RM Rest 60-90 s"],
    ["2 x 5 | 4 RIR | ~ 72-75% 1RM Rest 3-4 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "1-2 x 15 | 4 RIR | ~ 50-55% 1RM Rest 90 s", "3 x 8 | 4 RIR | ~ 65-68% 1RM Rest 2 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "2 x 10-12 | 4 RIR | ~ 58-63% 1RM Rest 90 s", "2 x 12 | 4 RIR | ~ 55-58% 1RM Rest 90 s", "1-2 x 15 | 4 RIR | ~ 50-55% 1RM Rest 60-90 s"]
  ];

  const G3_RX = [
    ["Top 1 x 5 | 2 RIR | ~ 82% 1RM | Back-off 2 x 5 | 3 RIR | ~ 78-79% 1RM Rest 3-4 min", "4 x 6 | 3 RIR | ~ 77% 1RM Rest 2-3 min", "4 x 8-10 | 3 RIR | ~ 68-74% 1RM Rest 2 min", "3 x 10 | 3 RIR | ~ 67-70% 1RM Rest 2 min", "2 x 12-15 | 3 RIR | ~ 55-62% 1RM Rest 90 s", "3 x 10-12 | 3 RIR | ~ 62-68% 1RM Rest 90 s", "2 x 10-12 | 3 RIR | ~ 62-68% 1RM Rest 90 s", "2 x 10-12 | 3 RIR | ~ 62-68% 1RM Rest 90 s"],
    ["Top 1 x 4 | 2 RIR | ~ 84% 1RM | Back-off 2 x 5 | 2-3 RIR | ~ 80-82% 1RM Rest 3-4 min", "4 x 6 | 2 RIR | ~ 80% 1RM Rest 2-3 min", "4 x 8-10 | 2 RIR | ~ 72-77% 1RM Rest 2 min", "3 x 8-10 | 2 RIR | ~ 72-77% 1RM Rest 2 min", "2 x 12-15 | 2 RIR | ~ 58-65% 1RM Rest 90 s", "3 x 10-12 | 2 RIR | ~ 65-70% 1RM Rest 90 s", "2 x 10-12 | 2 RIR | ~ 65-70% 1RM Rest 90 s", "2 x 10-12 | 2 RIR | ~ 65-70% 1RM Rest 90 s"],
    ["Top 1 x 3-4 | 1-2 RIR | ~ 86-89% 1RM | Back-off 2 x 4 | 2 RIR | ~ 84% 1RM Rest 3-4 min", "4 x 5-6 | 1-2 RIR | ~ 82-85% 1RM Rest 2-3 min", "4 x 8-10 | 1-2 RIR | ~ 75-80% 1RM Rest 2 min", "3 x 8-10 | 1-2 RIR | ~ 75-80% 1RM Rest 2 min", "2 x 10-15 | 1-2 RIR | ~ 64-72% 1RM Rest 90 s", "3 x 10-12 | 1 RIR | ~ 70-74% 1RM Rest 90 s", "2 x 10-12 | 1 RIR | ~ 70-74% 1RM Rest 90 s", "2 x 10-12 | 1 RIR | ~ 70-74% 1RM Rest 90 s"],
    ["2 x 4 | 4 RIR | ~ 75-78% 1RM Rest 3-4 min", "3 x 6 | 4 RIR | ~ 72-75% 1RM Rest 2-3 min", "3 x 8-10 | 4 RIR | ~ 63-68% 1RM Rest 2 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "1-2 x 12 | 4 RIR | ~ 55-58% 1RM Rest 90 s", "2 x 10-12 | 4 RIR | ~ 58-63% 1RM Rest 90 s", "1-2 x 10-12 | 4 RIR | ~ 58-63% 1RM Rest 90 s", "1-2 x 10-12 | 4 RIR | ~ 58-63% 1RM Rest 90 s"],
    ["Top 1 x 4 | 2 RIR | ~ 84% 1RM | Back-off 2 x 4 | 3 RIR | ~ 80-81% 1RM Rest 3-4 min", "4 x 5-6 | 3 RIR | ~ 78-80% 1RM Rest 2-3 min", "4 x 8 | 3 RIR | ~ 72% 1RM Rest 2 min", "3 x 8-10 | 3 RIR | ~ 70-74% 1RM Rest 2 min", "2 x 10-15 | 3 RIR | ~ 60-68% 1RM Rest 90 s", "3 x 10-12 | 3 RIR | ~ 62-68% 1RM Rest 90 s", "2 x 10-12 | 3 RIR | ~ 62-68% 1RM Rest 90 s", "2 x 10-12 | 3 RIR | ~ 62-68% 1RM Rest 90 s"],
    ["Top 1 x 3 | 2 RIR | ~ 87% 1RM | Back-off 2 x 4 | 2 RIR | ~ 84% 1RM Rest 3-4 min", "4 x 5-6 | 2 RIR | ~ 81-83% 1RM Rest 2-3 min", "4 x 8 | 2 RIR | ~ 75% 1RM Rest 2 min", "3 x 8 | 2 RIR | ~ 75% 1RM Rest 2 min", "2 x 10-12 | 2 RIR | ~ 65-70% 1RM Rest 90 s", "3 x 8-12 | 2 RIR | ~ 68-74% 1RM Rest 90 s", "2 x 8-12 | 2 RIR | ~ 68-74% 1RM Rest 90 s", "2 x 8-12 | 2 RIR | ~ 68-74% 1RM Rest 90 s"],
    ["Top 1 x 2-3 | 1-2 RIR | ~ 89-91% 1RM | Back-off 2 x 3 | 2 RIR | ~ 86% 1RM Rest 3-4 min", "4 x 4-6 | 1-2 RIR | ~ 83-87% 1RM Rest 2-3 min", "4 x 6-8 | 1-2 RIR | ~ 80-84% 1RM Rest 2 min", "3 x 6-8 | 1-2 RIR | ~ 80-84% 1RM Rest 2 min", "2 x 10-12 | 1 RIR | ~ 70-74% 1RM Rest 90 s", "3 x 8-10 | 1 RIR | ~ 73-78% 1RM Rest 90 s", "2 x 8-10 | 1 RIR | ~ 73-78% 1RM Rest 90 s", "2 x 8-10 | 1 RIR | ~ 73-78% 1RM Rest 90 s"],
    ["2 x 3 | 4 RIR | ~ 77-80% 1RM Rest 3-4 min", "3 x 6 | 4 RIR | ~ 72-75% 1RM Rest 2-3 min", "3 x 8 | 4 RIR | ~ 65-68% 1RM Rest 2 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "1-2 x 12 | 4 RIR | ~ 55-58% 1RM Rest 90 s", "2 x 10-12 | 4 RIR | ~ 58-63% 1RM Rest 90 s", "1-2 x 12 | 4 RIR | ~ 55-58% 1RM Rest 90 s", "1-2 x 12 | 4 RIR | ~ 55-58% 1RM Rest 90 s"],
    ["Top 1 x 3 | 2 RIR | ~ 87% 1RM | Back-off 2 x 3 | 3 RIR | ~ 83% 1RM Rest 3-4 min", "3 x 5-6 | 3 RIR | ~ 78-80% 1RM Rest 2-3 min", "4 x 6-8 | 3 RIR | ~ 76-80% 1RM Rest 2 min", "3 x 8 | 3 RIR | ~ 72% 1RM Rest 2 min", "2 x 10-12 | 3 RIR | ~ 62-68% 1RM Rest 90 s", "3 x 8-10 | 3 RIR | ~ 68-72% 1RM Rest 90 s", "2 x 8-10 | 3 RIR | ~ 68-72% 1RM Rest 90 s", "2 x 8-10 | 3 RIR | ~ 68-72% 1RM Rest 90 s"],
    ["Top 1 x 2-3 | 1-2 RIR | ~ 90% 1RM | Back-off 2 x 3 | 2 RIR | ~ 86% 1RM Rest 3-4 min", "3 x 5 | 2 RIR | ~ 82% 1RM Rest 2-3 min", "3 x 6-8 | 2 RIR | ~ 79-83% 1RM Rest 2 min", "3 x 6-8 | 2 RIR | ~ 76-82% 1RM Rest 2 min", "2 x 10 | 2 RIR | ~ 70-72% 1RM Rest 90 s", "3 x 8-10 | 2 RIR | ~ 72-75% 1RM Rest 90 s", "2 x 8-10 | 2 RIR | ~ 72-75% 1RM Rest 90 s", "2 x 8-10 | 2 RIR | ~ 72-75% 1RM Rest 90 s"],
    ["Top 1 x 2 | 1 RIR | ~ 91-93% 1RM | Back-off 2 x 2-3 | 2 RIR | ~ 87-89% 1RM Rest 3-4 min", "2-3 x 4-5 | 1-2 RIR | ~ 84-87% 1RM Rest 2-3 min", "3 x 6 | 1-2 RIR | ~ 84-86% 1RM Rest 2 min", "2 x 6-8 | 1-2 RIR | ~ 80-84% 1RM Rest 2 min", "2 x 8-10 | 1-2 RIR | ~ 75-80% 1RM Rest 90 s", "2 x 8-10 | 1 RIR | ~ 75-78% 1RM Rest 90 s", "2 x 8 | 1 RIR | ~ 78-80% 1RM Rest 90 s", "2 x 8 | 1 RIR | ~ 78-80% 1RM Rest 90 s"],
    ["2 x 4 | 4 RIR | ~ 72-75% 1RM Rest 3-4 min", "2 x 8 | 4 RIR | ~ 65-68% 1RM Rest 2-3 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "2 x 10 | 4 RIR | ~ 62-65% 1RM Rest 2 min", "1-2 x 15 | 4 RIR | ~ 50-55% 1RM Rest 90 s", "2 x 12 | 4 RIR | ~ 55-58% 1RM Rest 90 s", "1-2 x 12 | 4 RIR | ~ 55-58% 1RM Rest 90 s", "1-2 x 12 | 4 RIR | ~ 55-58% 1RM Rest 90 s"]
  ];

  const G_EST = [
    ["80-95", "75-90", "70-85"], ["80-95", "75-90", "70-85"], ["80-95", "75-90", "70-85"],
    ["60-75", "55-70", "50-65"], ["75-90", "70-85", "65-80"], ["75-90", "70-85", "65-80"],
    ["75-90", "70-85", "65-80"], ["55-70", "50-65", "50-65"], ["70-85", "65-80", "60-75"],
    ["70-85", "65-80", "60-75"], ["65-80", "60-75", "55-70"], ["50-65", "45-60", "45-60"]
  ];

  const ODD_CORE = [
    [["V-Ups", "2 x 12-15"], ["Side Plank", "2 x 30-40 sec / side"]],
    [["Front Plank", "2 x 45-60 sec"], ["Dumbbell Side Bend", "2 x 12-15 / side"]],
    [["V-Ups", "2 x 10-15"], ["Front Plank", "2 x 45 sec"]]
  ];
  const EVEN_CORE = [
    [["Front Plank", "2 x 45-60 sec"], ["Dumbbell Side Bend", "2 x 12-15 / side"]],
    [["V-Ups", "2 x 12-15"], ["Side Plank", "2 x 30-40 sec / side"]],
    [["Dumbbell Side Bend", "2 x 12 / side"], ["Side Plank", "2 x 30-40 sec / side"]]
  ];
  const RECOVERY_CORE = [
    [["Front Plank", "1-2 x 45-60 sec"], ["Dumbbell Side Bend", "1-2 x 12-15 / side"]],
    [["V-Ups", "1-2 x 12-15"], ["Side Plank", "1-2 x 30-40 sec / side"]],
    [["Dumbbell Side Bend", "1-2 x 12 / side"], ["Side Plank", "1-2 x 30-40 sec / side"]]
  ];

  const NOTE = {
    accel: { label: "Controlled acceleration", text: "Build speed smoothly for 20 sec until fast but relaxed (about 85-90% max speed). Do not sprint. Then walk/jog easily 60-90 sec." },
    easyEx: { label: "Example only", text: "If your Zone 2 is 5:30–6:15/km, stay inside that range for the easy block. Your calculator values always take priority." },
    easyRule: { label: "Easy rule", text: "You should be able to speak in full sentences. If you cannot, you are not in Zone 2 — slow down." },
    fartlekEx: { label: "Example only", text: "If Zone 4 is 4:35–5:00/km, each quality effort sits there. Recover very easily, for example around 5:45–6:30/km." },
    fartlekCue: { label: "Quality cue", text: "The efforts should feel hard but repeatable. If the last interval is much slower than the first, you started too fast." },
    endEx: { label: "Example only", text: "If Zone 2 is 5:30–6:15/km, keep most of the run there. A controlled Zone 3 finish would sit around 5:00–5:30/km only if you feel fresh." },
    recWeek: { label: "Recovery week", text: "This session is easy on purpose. Finish feeling better than you started. Do not add extra work." },
    longEx: { label: "Example only", text: "Think ~5:45/km in Zone 2, ~5:10/km in Zone 3, then finish near your own target 21.1 km pace only if form stays clean." },
    finishFresh: { label: "Finish fresh", text: "Keep the fast finish short and controlled. If form slips, stay in Zone 3 and end the run with energy in reserve." },
    taper: { label: "Taper", text: "Keep the run genuinely easy. The goal is freshness for Sunday, not extra kilometres." },
    hyroxRec: { label: "Recovery", text: "Loads stay reduced and the work stays technical. This is not a race rehearsal — finish fresh." },
    activation: { label: "Activation", text: "Keep every station short and crisp. Stop with energy in reserve — Sunday is the session that matters." }
  };

  function hasLabel(list, label) {
    return list.some((c) => String(c.label).toLowerCase() === label.toLowerCase());
  }

  function pushNote(list, note) {
    if (!note || list.length >= 2) return;
    if (hasLabel(list, note.label)) return;
    if (/example/i.test(note.label) && list.some((c) => /example/i.test(c.label))) return;
    list.push(note);
  }

  function enrichRunNotes(spec, week) {
    const notes = (spec.callouts || []).slice();
    const title = spec.title || "";
    const obj = spec.objective || "";
    const recovery = week === 4 || week === 8;
    if (/acceleration/i.test(obj)) {
      pushNote(notes, NOTE.accel);
      pushNote(notes, NOTE.easyEx);
    } else if (/taper|activation/i.test(title)) {
      pushNote(notes, NOTE.taper);
      pushNote(notes, NOTE.easyEx);
    } else if (/easy/i.test(title)) {
      pushNote(notes, NOTE.easyRule);
      pushNote(notes, NOTE.easyEx);
    } else if (/fartlek|quality/i.test(title)) {
      if (recovery) pushNote(notes, NOTE.recWeek);
      pushNote(notes, NOTE.fartlekCue);
      pushNote(notes, NOTE.fartlekEx);
    } else if (/endurance/i.test(title)) {
      if (recovery) pushNote(notes, NOTE.recWeek);
      pushNote(notes, NOTE.easyRule);
      pushNote(notes, NOTE.endEx);
    } else if (/progressive|long/i.test(title)) {
      pushNote(notes, NOTE.longEx);
      if (week >= 11) pushNote(notes, NOTE.finishFresh);
    }
    return notes;
  }

  function enrichHyroxNotes(spec, week) {
    const notes = (spec.callouts || []).slice();
    if (notes.length) return notes;
    if (week === 4 || week === 8) return [NOTE.hyroxRec];
    if (week === 12 && /run focus/i.test(spec.title || "")) return [NOTE.activation];
    return notes;
  }

  const COND = [
    {
      tue: { title: "Easy / Aerobic", est: "65-75", objective: "Session: 50 min Zone 2 + 6 x 20-second controlled accelerations. Easy walk/jog: 60-90 sec after each.", callouts: [
        { label: "Controlled acceleration", text: "Build speed smoothly for 20 sec until fast but relaxed (about 85-90% max speed). Do not sprint. Then walk/jog easily 60-90 sec." },
        { label: "Example only", text: "If your Zone 2 is 5:30-6:15/km, keep the 50 min inside that range. The 20-sec accelerations are fast and relaxed, not all-out sprints." }
      ] },
      sat: { title: "Progressive Long", est: "75-90", objective: "Session: 14 km progressive: 8 km Zone 2, then 4 km Zone 3, then 2 km at your target half-marathon pace if still controlled.", callouts: [
        { label: "Fast finish", text: "The final section is the fastest, but still controlled. Build pace gradually. If target half-marathon pace is not sustainable with clean form, finish in upper Zone 3 / low Zone 4." },
        { label: "Example only", text: "An athlete could progress from ~5:45/km in Zone 2 to ~5:10/km in Zone 3, then finish near a 4:45/km target 21.1 km pace." }
      ] },
      thu: { title: "Run Focus", est: "45-55", intensity: "Run intensity: Zone 3 for every run.", objective: "Execution: 90 sec easy between blocks.", steps: [
        "800 m run + 500 m SkiErg, damper 5.",
        "800 m run + 20 m Sled Push at 80% Race Load (Open Men: ~122 kg total incl. sled).",
        "800 m run + 50 m Farmers Carry at 100% Race Load (Open Men: 2 x 24 kg).",
        "800 m run + 20 Wall Balls at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Learn to return to smooth running after different types of fatigue: erg, heavy push, grip/carry and Wall Balls." },
      sun: { title: "No-Run", est: "50-65", objective: "Format: 3 rounds, then the Wall Ball block.", steps: [
        "400 m SkiErg, damper 5.",
        "10 m Sled Push at 80% Race Load (Open Men: ~122 kg total incl. sled).",
        "40 m Farmers Carry at 100% Race Load (Open Men: 2 x 24 kg).",
        "10 m Sled Pull at 80% Race Load (Open Men: ~82 kg total incl. sled).",
        "10 m Sandbag Lunges at 80% Race Load (Open Men: 16 kg).",
        "Wall Balls: 4 x 20 at 100% Race Load (Open Men: 6 kg). Rest 45-60 sec between sets."
      ], focus: "Technique first. Start with the erg, then alternate heavy, carry and lower-body stations before the Wall Ball block." }
    },
    {
      tue: { title: "Quality / Fartlek", est: "50-60", objective: "Session: 8 x 2 min in Zone 4. Recovery: 2 min easy Zone 1-2 after each effort.", callouts: [
        { label: "Example only", text: "If your Zone 4 is 4:35-5:00/km, each 2-min effort sits inside that range. Recover very easily, for example around 5:45-6:30/km." }
      ] },
      sat: { title: "Endurance", est: "70-80", objective: "Session: 60-70 min Zone 2. If you feel fresh, finish the final 10 min in Zone 3.", callouts: [
        { label: "Example only", text: "If Zone 2 is 5:30-6:15/km, keep most of the run there. A controlled final 10 min could move toward ~5:05-5:25/km." }
      ] },
      thu: { title: "Run Focus", est: "55-65", intensity: "Run intensity: Zone 3, progressing toward low Zone 4 only if controlled.", objective: "Execution: 60-90 sec easy between blocks.", steps: [
        "1 km run + 20 m Sled Push at 90% Race Load (Open Men: ~137 kg total incl. sled).",
        "1 km run + 20 m Sled Pull at 90% Race Load (Open Men: ~93 kg total incl. sled).",
        "1 km run + 40 m Burpee Broad Jumps.",
        "1 km run + 500 m RowErg, damper 5-6.",
        "1 km run + 25 Wall Balls at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Sled-compromised running, then burpee rhythm and rowing under fatigue." },
      sun: { title: "No-Run", est: "55-70", objective: "Format: 4 rounds, then the Wall Ball block.", steps: [
        "350 m RowErg, damper 5-6.",
        "15 m Sled Pull at 90% Race Load (Open Men: ~93 kg total incl. sled).",
        "20 m Burpee Broad Jumps.",
        "40 m Farmers Carry at 100% Race Load (Open Men: 2 x 24 kg).",
        "15 m Sled Push at 90% Race Load (Open Men: ~137 kg total incl. sled).",
        "Wall Balls: 3 x 25 at 100% Race Load (Open Men: 6 kg). Rest 45-60 sec."
      ], focus: "Grip + sled strength with a different station order. Stay technical, not frantic." }
    },
    {
      tue: { title: "Easy / Aerobic", est: "70-80", objective: "Session: 55 min Zone 2 + 6 x 20-second controlled accelerations." },
      sat: { title: "Progressive Long", est: "85-100", objective: "Session: 16 km progressive: 8 km Zone 2, then 5 km Zone 3, then 3 km at your target half-marathon pace if controlled.", callouts: [
        { label: "Example only", text: "Think ~5:45/km → ~5:10/km → ~4:45/km for an athlete whose zones match those values. Your own calculator values take priority." }
      ] },
      thu: { title: "Run Focus", est: "55-70", intensity: "Run intensity: your target half-marathon pace or low Zone 4. Stay controlled.", objective: "Execution: Move continuously; take up to 90 sec easy only if technique begins to break down.", steps: [
        "1 km run + 500 m SkiErg, damper 6.",
        "1 km run + 100 m Farmers Carry at 100% Race Load (Open Men: 2 x 24 kg).",
        "1 km run + 500 m RowErg, damper 6.",
        "1 km run + 50 m Sandbag Lunges at 100% Race Load (Open Men: 20 kg).",
        "1 km run + 30 Wall Balls at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Aerobic control across two ergs, grip fatigue and the first meaningful lunge-to-Wall-Ball finish." },
      sun: { title: "No-Run", est: "50-65", objective: "Format: 3 rounds. Lower-leg load stays controlled after the long run.", steps: [
        "500 m SkiErg, damper 5.",
        "50 m Farmers Carry at 100% Race Load (Open Men: 2 x 24 kg).",
        "20 m Burpee Broad Jumps.",
        "400 m RowErg, damper 5.",
        "15 m Sandbag Lunges at 100% Race Load (Open Men: 20 kg).",
        "Wall Balls: 30 + 30 + 20 at 100% Race Load (Open Men: 6 kg). Rest 45-75 sec between sets."
      ], focus: "Keep movement quality after the long run; no heavy sled overload today." }
    },
    {
      tue: { title: "Quality / Fartlek", est: "45-55", objective: "Session: 6 x 90 sec in Zone 4. Recovery: 2 min very easy running after each effort." },
      sat: { title: "Endurance", est: "60-70", objective: "Session: 55-60 min easy Zone 2 only." },
      thu: { title: "Run Focus", est: "35-45", intensity: "Run intensity: Zone 2-3. Recovery week.", objective: "Execution: Keep breathing under control. No racing.", steps: [
        "600 m run + 250 m SkiErg, damper 4.",
        "600 m run + 40 m Farmers Carry at 80% Race Load (Open Men: ~2 x 20 kg).",
        "600 m run + 250 m RowErg, damper 4.",
        "600 m run + 15 Wall Balls at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Easy transitions and clean technique. Finish fresh." },
      sun: { title: "No-Run", est: "35-45", objective: "Format: 2 easy rounds.", steps: [
        "300 m RowErg, damper 4.",
        "20 m Farmers Carry at 80% Race Load (Open Men: ~2 x 20 kg).",
        "300 m SkiErg, damper 4.",
        "10 m Sled Push at 80% Race Load (Open Men: ~122 kg total incl. sled).",
        "10 m Sandbag Lunges at 80% Race Load (Open Men: 16 kg).",
        "Wall Balls: 3 x 15 at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Recovery. Every rep should feel technically easy." }
    },
    {
      tue: { title: "Easy / Aerobic", est: "75-85", objective: "Session: 60 min Zone 2 + 6 x 20-second controlled accelerations." },
      sat: { title: "Progressive Long", est: "95-110", objective: "Session: 18 km progressive: 9 km Zone 2, then 5 km Zone 3, then 4 km at your target half-marathon pace.", callouts: [
        { label: "Example only", text: "Build the run gradually: easy aerobic first, steady middle, then finish around your own target 21.1 km pace only if form stays clean." }
      ] },
      thu: { title: "Run Focus", est: "55-70", intensity: "Run intensity: low Zone 4, controlled. Complete 6 x 800 m.", objective: "Execution: Use the next station after each run. Short transition only.", steps: [
        "800 m + 750 m SkiErg, damper 6.",
        "800 m + 25 m Sled Push at 100% Race Load (Open Men: 152 kg total incl. sled).",
        "800 m + 25 m Sled Pull at 100% Race Load (Open Men: 103 kg total incl. sled).",
        "800 m + 40 m Burpee Broad Jumps.",
        "800 m + 750 m RowErg, damper 6.",
        "800 m + 100 m Farmers Carry at 100% Race Load (Open Men: 2 x 24 kg).",
        "Finish with 25 Wall Balls at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Broad station exposure while holding repeatable running intensity." },
      sun: { title: "No-Run", est: "60-75", objective: "Format: 3 rounds, controlled after the progressive long run.", steps: [
        "500 m SkiErg, damper 5-6.",
        "10 m Sled Pull at 100% Race Load (Open Men: 103 kg total incl. sled).",
        "50 m Farmers Carry at 100% Race Load (Open Men: 2 x 24 kg).",
        "10 m Sled Push at 100% Race Load (Open Men: 152 kg total incl. sled).",
        "15 m Burpee Broad Jumps.",
        "10 m Sandbag Lunges at 100% Race Load (Open Men: 20 kg).",
        "Wall Balls: 50 + 25 + 15 at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Station density without repeating the race order. Keep the first 50 Wall Balls controlled." }
    },
    {
      tue: { title: "Quality / Fartlek", est: "55-65", objective: "Session: 6 x 3 min in Zone 4. Recovery: 2 min Zone 2 after each effort." },
      sat: { title: "Endurance", est: "75-85", objective: "Session: 65-75 min Zone 2. Finish the final 10-15 min in Zone 3 only if your legs feel good." },
      thu: { title: "Run Focus", est: "60-75", intensity: "Run intensity: around your target half-marathon pace / low Zone 4. Complete 5 x 1 km.", objective: "Execution: Short transitions; control the first 300 m after each station.", steps: [
        "1 km + 20 m Sandbag Lunges at 100% Race Load (Open Men: 20 kg) + 20 Wall Balls at 100% Race Load (Open Men: 6 kg).",
        "1 km + 500 m SkiErg, damper 6.",
        "1 km + 25 m Sled Push at 105% Race Load (Open Men: ~160 kg total incl. sled).",
        "1 km + 500 m RowErg, damper 6.",
        "1 km + 25 m Sled Pull at 105% Race Load (Open Men: ~108 kg total incl. sled) + 50 m Farmers Carry at 100% Race Load (Open Men: 2 x 24 kg)."
      ], focus: "Mixed station pairings. Learn to run well after both local leg fatigue and full-body fatigue." },
      sun: { title: "No-Run", est: "60-75", objective: "Format: 3 strength-endurance rounds.", steps: [
        "400 m RowErg, damper 6.",
        "20 m Sled Push at 105% Race Load (Open Men: ~160 kg total incl. sled).",
        "20 m Burpee Broad Jumps.",
        "400 m SkiErg, damper 6.",
        "20 m Sled Pull at 105% Race Load (Open Men: ~108 kg total incl. sled).",
        "20 m Sandbag Lunges at 100% Race Load (Open Men: 20 kg).",
        "Wall Balls: 60 + 20 + 20 at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Heavy sled work with the two ergs separated by muscular stations." }
    },
    {
      tue: { title: "Easy / Aerobic", est: "70-80", objective: "Session: 60 min Zone 2. Keep the full run genuinely easy." },
      sat: { title: "Progressive Long", est: "105-120", objective: "Session: 20 km progressive: 10 km Zone 2, then 5 km Zone 3, then 5 km at your target half-marathon pace.", callouts: [
        { label: "Example only", text: "The first 10 km should feel deliberately easy. The final 5 km is the key section; do not reach target pace too early." }
      ] },
      thu: { title: "Run Focus", est: "60-75", intensity: "Run intensity: planned HYROX race effort. Do not chase pace early.", objective: "Execution: Half-HYROX first half. Keep transitions race-like.", steps: [
        "1 km run + 1,000 m SkiErg, damper 6.",
        "1 km run + 50 m Sled Push at 100% Race Load (Open Men: 152 kg total incl. sled).",
        "1 km run + 50 m Sled Pull at 100% Race Load (Open Men: 103 kg total incl. sled).",
        "1 km run + 80 m Burpee Broad Jumps.",
        "Finish with 40 Wall Balls at 100% Race Load (Open Men: 6 kg), controlled, not for time."
      ], focus: "First-half race sequencing plus Wall Ball skill under accumulated fatigue." },
      sun: { title: "No-Run", est: "40-55", objective: "Format: 2 controlled rounds after the 20 km long run.", steps: [
        "400 m SkiErg, damper 5.",
        "50 m Farmers Carry at 100% Race Load (Open Men: 2 x 24 kg).",
        "400 m RowErg, damper 5.",
        "10 m Sled Pull at 80% Race Load (Open Men: ~82 kg total incl. sled).",
        "Wall Balls: 50 + 30 at 100% Race Load (Open Men: 6 kg). Rest briefly between sets."
      ], focus: "Low-impact station quality after the longest run. No heavy sled or lunge volume." }
    },
    {
      tue: { title: "Quality / Fartlek", est: "45-55", objective: "Session: 5 x 2 min in Zone 4. Recovery: 2 min very easy running after each effort." },
      sat: { title: "Endurance", est: "60-70", objective: "Session: 55-60 min easy Zone 2." },
      thu: { title: "Run Focus", est: "35-45", intensity: "Run intensity: Zone 2-3. Recovery week.", objective: "Execution: Stay smooth and finish fresh.", steps: [
        "600 m run + 300 m RowErg, damper 4-5.",
        "600 m run + 40 m Farmers Carry at 80% Race Load (Open Men: ~2 x 20 kg).",
        "600 m run + 300 m SkiErg, damper 4-5.",
        "Finish with 20 Wall Balls at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Recovery with a different erg order. Keep all transitions relaxed." },
      sun: { title: "No-Run", est: "35-45", objective: "Format: 2 easy rounds.", steps: [
        "300 m RowErg, damper 4.",
        "10 m Sled Pull at 80% Race Load (Open Men: ~82 kg total incl. sled).",
        "20 m Farmers Carry at 80% Race Load (Open Men: ~2 x 20 kg).",
        "300 m SkiErg, damper 4.",
        "10 m Sandbag Lunges at 80% Race Load (Open Men: 16 kg).",
        "Wall Balls: 3 x 20 at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Recovery and technique only. Stop well before form degrades." }
    },
    {
      tue: { title: "Easy / Aerobic", est: "65-75", objective: "Session: 50-55 min Zone 2 + 4 x 20-second controlled accelerations." },
      sat: { title: "Progressive Long", est: "95-115", objective: "Session: 18-20 km progressive: start with 9 km Zone 2, move to 5 km Zone 3, then finish 4-6 km at your target half-marathon pace. Stop the fast finish early if form deteriorates.", callouts: [
        { label: "Example only", text: "Start conservatively. If target pace is 4:45/km, the fast finish should approach 4:45/km only in the final 4-6 km, not before." }
      ] },
      thu: { title: "Run Focus", est: "55-70", intensity: "Run intensity: planned HYROX race effort — repeatable and controlled.", objective: "Execution: Second-half race specificity. Move continuously.", steps: [
        "1 km run + 1,000 m RowErg, damper 6.",
        "1 km run + 200 m Farmers Carry at 100% Race Load (Open Men: 2 x 24 kg).",
        "1 km run + 100 m Sandbag Lunges at 100% Race Load (Open Men: 20 kg).",
        "1 km run + 60 Wall Balls at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Exact second-half sequence: row, carry, lunges, Wall Balls." },
      sun: { title: "No-Run", est: "45-60", objective: "Format: 2 technique rounds after the long progressive run.", steps: [
        "500 m SkiErg, damper 5.",
        "10 m Sled Pull at 100% Race Load (Open Men: 103 kg total incl. sled).",
        "50 m Farmers Carry at 100% Race Load (Open Men: 2 x 24 kg).",
        "500 m RowErg, damper 5.",
        "10 m Sled Push at 100% Race Load (Open Men: 152 kg total incl. sled).",
        "Wall Balls: 60 + 20 at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Preserve sled and grip skill without adding another large lunge dose after Saturday." }
    },
    {
      tue: { title: "Quality / Fartlek", est: "50-60", objective: "Session: 3 x 8 min at your target half-marathon pace. Recovery: 3 min Zone 2 between blocks.", callouts: [
        { label: "Example only", text: "If your target 21.1 km pace is 4:45/km, run each 8-min block close to 4:45/km and keep the 3-min recoveries genuinely easy." }
      ] },
      sat: { title: "Endurance", est: "70-80", objective: "Session: 60-70 min Zone 2. Optional final 10 min Zone 3 if fresh." },
      thu: { title: "Run Focus", est: "75-90", intensity: "Run intensity: planned HYROX race effort. This is an ~75% full-race rehearsal.", objective: "Execution: Use race order. Do not race the clock.", steps: [
        "800 m run + 750 m SkiErg, damper 6.",
        "800 m run + 40 m Sled Push at 100% Race Load (Open Men: 152 kg total incl. sled).",
        "800 m run + 40 m Sled Pull at 100% Race Load (Open Men: 103 kg total incl. sled).",
        "800 m run + 60 m Burpee Broad Jumps.",
        "800 m run + 750 m RowErg, damper 6.",
        "800 m run + 150 m Farmers Carry at 100% Race Load (Open Men: 2 x 24 kg).",
        "800 m run + 75 m Sandbag Lunges at 100% Race Load (Open Men: 20 kg).",
        "800 m run + 75 Wall Balls at 100% Race Load (Open Men: 6 kg)."
      ], focus: "The main race rehearsal before the final simulation. Control every transition." },
      sun: { title: "No-Run", est: "65-80", objective: "Format: One sequence, not rounds. Weakness / overload session.", steps: [
        "500 m RowErg, damper 6.",
        "Sled Push: 5 x 10 m at 105-110% Race Load (Open Men: ~160-167 kg total incl. sled).",
        "500 m SkiErg, damper 6.",
        "Sled Pull: 5 x 10 m at 105-110% Race Load (Open Men: ~108-113 kg total incl. sled).",
        "Farmers Carry: 4 x 50 m at 100% Race Load (Open Men: 2 x 24 kg).",
        "Sandbag Lunges: 4 x 25 m at 100% Race Load (Open Men: 20 kg).",
        "Wall Balls: 90 + 10 at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Overload the sleds, then practice the 90-rep Wall Ball barrier without turning the session into a race." }
    },
    {
      tue: { title: "Easy / Aerobic", est: "55-65", objective: "Session: 45 min Zone 2 + 4 x 20-second controlled accelerations." },
      sat: { title: "Progressive Long", est: "65-80", objective: "Session: 12-14 km progressive: mostly Zone 2, then Zone 3, then final 2-4 km at your target half-marathon pace. Finish fresh." },
      thu: { title: "Run Focus", est: "45-55", intensity: "Run intensity: planned HYROX race effort. Complete 4 x 1 km.", objective: "Execution: Sharpening session: stop with energy in reserve.", steps: [
        "1 km + 500 m SkiErg, damper 6.",
        "1 km + 25 m Sled Push at 100% Race Load (Open Men: 152 kg total incl. sled).",
        "1 km + 500 m RowErg, damper 6.",
        "1 km + 30 Wall Balls at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Sharp, race-specific work with low total fatigue." },
      sun: { title: "No-Run", est: "50-65", objective: "Format: Short race-specific rehearsal.", steps: [
        "500 m SkiErg, damper 5.",
        "25 m Sled Push at 100% Race Load (Open Men: 152 kg total incl. sled).",
        "25 m Sled Pull at 100% Race Load (Open Men: 103 kg total incl. sled).",
        "40 m Burpee Broad Jumps.",
        "500 m RowErg, damper 5.",
        "100 m Farmers Carry at 100% Race Load (Open Men: 2 x 24 kg).",
        "25 m Sandbag Lunges at 100% Race Load (Open Men: 20 kg).",
        "Wall Balls: attempt 100 unbroken at 100% Race Load (Open Men: 6 kg) only if Week 10’s first 90 were controlled. Otherwise use 60 + 40."
      ], focus: "Final Wall Ball rehearsal. Quality and breathing matter more than forcing an unbroken set." }
    },
    {
      tue: { title: "Easy / Activation", est: "45-55", objective: "Session: 35-40 min Zone 2 + 4 x 20-second controlled accelerations." },
      sat: { title: "Easy / Taper", est: "40-50", objective: "Session: 30-40 min easy Zone 2 only. Keep your legs fresh for Sunday’s full HYROX simulation." },
      thu: { title: "Run Focus", est: "30-40", intensity: "Run intensity: Zone 3. Activation only.", objective: "Execution: Stop fresh. Sunday is the full HYROX simulation.", steps: [
        "600 m run + 250 m SkiErg, damper 5.",
        "600 m run + 40 m Farmers Carry at 80% Race Load (Open Men: ~2 x 20 kg).",
        "600 m run + 15 Wall Balls at 100% Race Load (Open Men: 6 kg)."
      ], focus: "Activation, rhythm and confidence. No fatigue chasing." },
      sun: { title: "Full Simulation", est: "80-110", objective: "", steps: [
        "1 km Run — planned HYROX running intensity; controlled.",
        "1,000 m SkiErg — damper 6.",
        "1 km Run — settle quickly back into rhythm.",
        "50 m Sled Push — 100% Race Load (Open Men: 152 kg total incl. sled).",
        "1 km Run — controlled.",
        "50 m Sled Pull — 100% Race Load (Open Men: 103 kg total incl. sled).",
        "1 km Run — controlled.",
        "80 m Burpee Broad Jumps — clean race-standard movement.",
        "1 km Run — no early surge after burpees.",
        "1,000 m RowErg — damper 6.",
        "1 km Run — controlled.",
        "200 m Farmers Carry — 100% Race Load (Open Men: 2 x 24 kg).",
        "1 km Run — settle grip and breathing.",
        "100 m Sandbag Lunges — 100% Race Load (Open Men: 20 kg).",
        "1 km Run — final controlled run.",
        "100 Wall Balls — 100% Race Load (Open Men: 6 kg). Goal: unbroken only while depth, target accuracy and breathing stay controlled."
      ], focus: "", callouts: [
        { label: "Wall Ball goal", text: "Attempt 100 unbroken only if the first 60-70 reps remain controlled. The target is 100 technically clean reps without a major pace collapse." }
      ] }
    }
  ];

  function estRange(text) {
    const m = String(text).match(/(\d+)\s*[–-]\s*(\d+)/);
    return m ? { min: Number(m[1]), max: Number(m[2]) } : { min: Number(text), max: Number(text) };
  }

  function lift(name, rx, strength) {
    return { kind: "exercise", name, prescription: rx, emphasis: strength ? "main_lift" : null };
  }

  function corePair(pairs) {
    return pairs.map(([name, rx]) => ({ kind: "exercise", name, prescription: rx }));
  }

  function gymSession(day, gymIndex, title, est, names, rx, core) {
    return {
      day,
      dayName: DAYS[day - 1],
      type: "strength",
      subtype: gymIndex === 1 ? "lowerStrength" : gymIndex === 2 ? "upperStrength" : "fullStrengthSecondary",
      gymIndex,
      title,
      durationMin: estRange(est),
      duration: `${est.replace("-", "–")} min`,
      intensityLabel: title,
      main: names.map(([name, strength], i) => lift(name, rx[i], strength)).concat(corePair(core))
    };
  }

  function runSession(day, spec, week) {
    return {
      day,
      dayName: DAYS[day - 1],
      type: "run",
      subtype: /quality|fartlek/i.test(spec.title) ? "qualityRun" : /long/i.test(spec.title) ? "longRun" : "easyRun",
      title: spec.title,
      durationMin: estRange(spec.est),
      duration: `${spec.est.replace("-", "–")} min`,
      intensityLabel: spec.intensity || "",
      objective: spec.objective || "",
      callouts: enrichRunNotes(spec, week),
      coachNote: spec.focus || "",
      main: spec.steps
        ? spec.steps.map((line) => ({ kind: "step", name: line }))
        : spec.objective
          ? [{ kind: "step", name: spec.objective.replace(/^Session:\s*/i, "") }]
          : []
    };
  }

  function hyroxSession(day, spec, subtype, week) {
    return {
      day,
      dayName: DAYS[day - 1],
      type: "hyrox",
      subtype,
      title: spec.title,
      durationMin: estRange(spec.est),
      duration: `${spec.est.replace("-", "–")} min`,
      intensityLabel: spec.intensity || "",
      objective: spec.objective || "",
      callouts: enrichHyroxNotes(spec, week),
      coachNote: spec.focus || "",
      main: (spec.steps || []).map((line) => ({ kind: "step", name: line }))
    };
  }

  function coresFor(week, gymIndex) {
    if (week === 4 || week === 8 || week === 12) return RECOVERY_CORE[gymIndex];
    return (week % 2 === 1 ? ODD_CORE : EVEN_CORE)[gymIndex];
  }

  function recoverySession(day) {
    return {
      day,
      dayName: DAYS[day - 1],
      type: "recovery",
      subtype: "recovery",
      title: "Rest",
      durationMin: { min: 20, max: 30 },
      duration: "Rest",
      intensityLabel: "Off",
      main: [{ kind: "step", name: "Rest or easy walk", prescription: "Complete rest or 20–30 min easy walk." }],
      objective: "Complete rest or an easy 20–30 min walk. Gym sessions stay full-length; this day is empty on purpose."
    };
  }

  const KEEP = {
    hyrox: {
      3: [1, 1, 0, 1, 0, 0, 0],
      4: [1, 1, 0, 1, 0, 0, 1],
      5: [1, 1, 1, 1, 0, 0, 1],
      6: [1, 1, 1, 1, 0, 1, 1],
      7: [1, 1, 1, 1, 1, 1, 1]
    },
    running: {
      3: [1, 1, 0, 0, 0, 1, 0],
      4: [1, 1, 0, 1, 0, 1, 0],
      5: [1, 1, 1, 1, 0, 1, 0],
      6: [1, 1, 1, 1, 0, 1, 1],
      7: [1, 1, 1, 1, 1, 1, 1]
    },
    strength: {
      3: [1, 0, 1, 0, 1, 0, 0],
      4: [1, 1, 1, 0, 1, 0, 0],
      5: [1, 1, 1, 0, 1, 1, 0],
      6: [1, 1, 1, 1, 1, 1, 0],
      7: [1, 1, 1, 1, 1, 1, 1]
    },
    balanced: {
      3: [1, 1, 0, 1, 0, 0, 0],
      4: [1, 1, 1, 1, 0, 0, 0],
      5: [1, 1, 1, 1, 0, 1, 0],
      6: [1, 1, 1, 1, 1, 1, 0],
      7: [1, 1, 1, 1, 1, 1, 1]
    }
  };

  const LIFT_ADAPT = {
    "Back Squat": { beginner: { full_hyrox: "Leg Press", gym_no_hyrox: "Goblet Box Squat", minimal_home: "Sit-to-stand squat" }, intermediate: { full_hyrox: "Goblet Squat", gym_no_hyrox: "Goblet Squat", minimal_home: "Goblet or backpack squat" }, advanced: { gym_no_hyrox: "Back Squat or Goblet Squat", minimal_home: "Loaded backpack squat" } },
    "Leg Press": { beginner: { minimal_home: "Chair squat" }, intermediate: { minimal_home: "Backpack squat" }, advanced: { minimal_home: "Loaded backpack squat" } },
    "Leg Curl": { beginner: { minimal_home: "Slider / towel hamstring curl" }, intermediate: { minimal_home: "Slider hamstring curl" }, advanced: { minimal_home: "Single-leg slider curl" } },
    "Hip Thrust": { beginner: { minimal_home: "Glute bridge" }, intermediate: { minimal_home: "Shoulder-elevated glute bridge" }, advanced: { minimal_home: "Loaded glute bridge" } },
    "Military Press": { beginner: { full_hyrox: "Seated DB Press", gym_no_hyrox: "Seated DB Press", minimal_home: "Seated DB press or pike push-up" }, intermediate: { full_hyrox: "Standing DB Press", gym_no_hyrox: "Standing DB Press", minimal_home: "Standing DB Press" }, advanced: { gym_no_hyrox: "Military Press or DB Press", minimal_home: "DB Military Press" } },
    "Lateral Raise": { beginner: { minimal_home: "Band lateral raise" }, intermediate: { minimal_home: "DB or band lateral raise" }, advanced: { minimal_home: "DB lateral raise" } },
    "Overhead Triceps Extension": { beginner: { minimal_home: "Band triceps press-down" }, intermediate: { minimal_home: "DB overhead extension" }, advanced: { minimal_home: "DB overhead extension" } },
    "Rope Pushdown": { beginner: { gym_no_hyrox: "Cable or band pushdown", minimal_home: "Band pushdown" }, intermediate: { minimal_home: "Band pushdown" }, advanced: { minimal_home: "Band pushdown" } },
    "Bench Press": { beginner: { full_hyrox: "Chest Press Machine", gym_no_hyrox: "Chest Press Machine", minimal_home: "Kneeling or elevated push-up" }, intermediate: { full_hyrox: "DB Bench Press", gym_no_hyrox: "DB Bench Press", minimal_home: "Push-up or DB floor press" }, advanced: { gym_no_hyrox: "Barbell or DB Bench Press", minimal_home: "Deficit push-up or DB floor press" } },
    "Incline DB Press": { beginner: { full_hyrox: "Incline chest press machine", gym_no_hyrox: "Incline DB press (light)", minimal_home: "Hands-elevated push-up" }, intermediate: { minimal_home: "DB floor press" }, advanced: { minimal_home: "Deficit push-up" } },
    "Cable / DB Fly": { beginner: { minimal_home: "Band fly" }, intermediate: { minimal_home: "DB floor fly" }, advanced: { minimal_home: "DB fly" } },
    "Lat Pulldown / Pull-Up": { beginner: { full_hyrox: "Lat Pulldown", gym_no_hyrox: "Lat Pulldown", minimal_home: "Band pulldown or towel door row" }, intermediate: { full_hyrox: "Lat Pulldown / Assisted Pull-Up", gym_no_hyrox: "Lat Pulldown / Assisted Pull-Up", minimal_home: "Band pulldown" }, advanced: { gym_no_hyrox: "Pull-Up or heavy pulldown", minimal_home: "Band-assisted pull-up or door row" } },
    "Seated Row": { beginner: { full_hyrox: "Seated Machine Row", gym_no_hyrox: "Seated Machine Row", minimal_home: "Band row or backpack row" }, intermediate: { gym_no_hyrox: "Cable Row", minimal_home: "One-arm DB row" }, advanced: { minimal_home: "Heavy one-arm DB row" } },
    "Single-Arm Row / Pulldown": { beginner: { minimal_home: "Band row" }, intermediate: { minimal_home: "One-arm DB row" }, advanced: { minimal_home: "Heavy one-arm DB row" } },
    "Hammer Curl": { beginner: { minimal_home: "Band curl" }, intermediate: { minimal_home: "DB hammer curl" }, advanced: { minimal_home: "DB hammer curl" } },
    "Cable Curl": { beginner: { gym_no_hyrox: "DB curl", minimal_home: "Band curl" }, intermediate: { minimal_home: "DB curl" }, advanced: { minimal_home: "DB curl" } },
    "Deadlift": { beginner: { full_hyrox: "Cable Pull-Through", gym_no_hyrox: "Light DB Romanian Deadlift", minimal_home: "Hip hinge good morning" }, intermediate: { full_hyrox: "Romanian Deadlift", gym_no_hyrox: "DB Romanian Deadlift", minimal_home: "DB or backpack Romanian Deadlift" }, advanced: { gym_no_hyrox: "Deadlift", minimal_home: "DB Romanian Deadlift" } },
    "Incline Bench Press": { beginner: { full_hyrox: "Incline machine press", gym_no_hyrox: "Incline DB press", minimal_home: "Hands-elevated push-up" }, intermediate: { minimal_home: "DB floor press" }, advanced: { minimal_home: "Deficit push-up" } },
    "Chest-Supported / Wide Row": { beginner: { full_hyrox: "Seated Machine Row", gym_no_hyrox: "Chest-supported DB row", minimal_home: "Band row" }, intermediate: { minimal_home: "One-arm DB row" }, advanced: { minimal_home: "Heavy one-arm DB row" } },
    "DB Shoulder Press": { beginner: { full_hyrox: "Seated DB Press", gym_no_hyrox: "Seated DB Press", minimal_home: "Seated DB press" }, intermediate: { minimal_home: "Standing DB Press" }, advanced: { minimal_home: "DB Military Press" } },
    "Leg Extension": { beginner: { minimal_home: "Sit-to-stand squat" }, intermediate: { minimal_home: "Split squat to a chair" }, advanced: { minimal_home: "DB reverse lunge" } },
    "DB Shrugs": { beginner: { minimal_home: "Backpack shrug" }, intermediate: { minimal_home: "DB shrug" }, advanced: { minimal_home: "DB shrug" } },
    "EZ-Bar Curl": { beginner: { gym_no_hyrox: "DB curl", minimal_home: "Band curl" }, intermediate: { minimal_home: "DB curl" }, advanced: { minimal_home: "DB curl" } },
    "Pushdown": { beginner: { gym_no_hyrox: "Band pushdown", minimal_home: "Band pushdown" }, intermediate: { minimal_home: "Band pushdown" }, advanced: { minimal_home: "Band pushdown" } },
    "V-Ups": { beginner: { full_hyrox: "Dead Bug", gym_no_hyrox: "Dead Bug", minimal_home: "Dead Bug" } },
    "Dumbbell Side Bend": { beginner: { full_hyrox: "Dead Bug", gym_no_hyrox: "Dead Bug", minimal_home: "Dead Bug" } }
  };

  const PRIORITY_COPY = {
    hyrox: { title: "12-Week Hybrid Performance Plan", subtitle: COVER.subtitle, intro: COVER.intro },
    running: { title: "12-Week Running-Priority Hybrid Plan", subtitle: "Same gym logic as the master. Running gets the extra vote; HYROX days become run-focused.", intro: "You still lift the master sessions. Extra room in the week goes to easy and long running, not extra max gym days." },
    strength: { title: "12-Week Strength-Priority Hybrid Plan", subtitle: "Same gym sessions as the master. Running and stations scale around the lifts.", intro: "The three gym days stay intact whenever the week has room. Conditioning is support, not a second peak." },
    balanced: { title: "12-Week Balanced Hybrid Plan", subtitle: "The master week, with days and intensity scaled to a mixed goal.", intro: "Lift, run and condition from the same template. Nothing is a random workout." }
  };

  function libApi() {
    return root.EGLibrary || {};
  }

  function adaptLiftName(name, ctx) {
    const level = ctx.level === "beginner" || ctx.strengthBase === "new" ? "beginner" : ctx.level === "advanced" && (ctx.strengthBase === "advanced" || ctx.strengthBase === "consistent") ? "advanced" : "intermediate";
    const eq = ctx.equipmentProfile || "gym_no_hyrox";
    const row = LIFT_ADAPT[name];
    if (!row) return name;
    const byLevel = row[level] || row.advanced || {};
    return byLevel[eq] || byLevel.full_hyrox || name;
  }

  function adaptDose(rx, level) {
    if (!rx || level === "advanced") return rx;
    let out = String(rx);
    if (/^Top 1 x/i.test(out)) {
      if (level === "beginner") return "3 x 8-10 | 3 RIR | technique load | Rest 2 min";
      const back = out.match(/Back-off\s+(\d+)\s+x\s+([^|]+)\s*\|\s*([^|]+)\s*\|\s*(.+)/i);
      if (back) {
        const rest = (back[4].match(/Rest\s+(.+)/i) || [])[1] || "2-3 min";
        return `${back[1]} x ${back[2].trim()} | ${back[3].trim()} | ~ 70-75% 1RM | Rest ${rest.trim()}`;
      }
    }
    if (level === "beginner") {
      out = out.replace(/(\d+)\s*RIR/g, (_, n) => `${Math.min(4, Number(n) + 1)} RIR`);
      out = out.replace(/~\s*(\d{2,3})(?:-\d{2,3})?%/g, (_, n) => `~ ${Math.max(50, Number(n) - 12)}%`);
      out = out.replace(/^4 x /g, "3 x ");
      out = out.replace(/1-2 x /g, "2 x ");
      out = out.replace(/2 x 45-60 sec/g, "2 x 20-30 sec");
      out = out.replace(/2 x 30-40 sec/g, "2 x 15-20 sec");
      out = out.replace(/2 x 12-15/g, "2 x 8-10");
    } else {
      out = out.replace(/~\s*(8[8-9]|9\d)(?:-\d+)?%/g, "~ 80-82%");
      out = out.replace(/1-2 RIR/g, "2-3 RIR");
      out = out.replace(/\| 1 RIR/g, "| 2 RIR");
    }
    return out;
  }

  function adaptEst(range, level) {
    if (level === "advanced" || !range) return range;
    const cut = level === "beginner" ? 15 : 8;
    return { min: Math.max(40, range.min - cut), max: Math.max(52, range.max - cut) };
  }

  function adaptHyroxLine(text, ctx) {
    let out = String(text || "");
    const Lib = libApi();
    if (Lib.resolveHyroxStation && ctx.equipmentProfile && ctx.equipmentProfile !== "full_hyrox") {
      const pairs = [
        ["SkiErg", "ski"], ["RowErg", "row"], ["Sled Push", "sled_push"], ["Sled Pull", "sled_pull"],
        ["Farmers Carry", "farmers"], ["Sandbag Lunges", "lunges"], ["Wall Balls", "wall_ball"],
        ["Wall Ball", "wall_ball"], ["Burpee Broad Jumps", "bbj"], ["Burpee Broad Jump", "bbj"]
      ];
      pairs.forEach(([label, intent]) => {
        const sub = Lib.resolveHyroxStation(intent, ctx);
        if (sub && sub.name) out = out.split(label).join(sub.name);
      });
      out = out.replace(/\(Open Men:[^)]+\)/g, "(use a hard but controlled substitute load)");
      out = out.replace(/,\s*damper\s+\d(?:-\d)?/gi, "");
    }
    if (ctx.level === "beginner") {
      out = out.replace(/105–110%|105-110%/g, "75%");
      out = out.replace(/100% Race Load/g, "70% Race Load");
      out = out.replace(/90% Race Load/g, "70% Race Load");
    }
    return out;
  }

  function adaptRunCopy(text, ctx) {
    let out = String(text || "");
    const first5k = ctx.runningGoal === "first5k" || ctx.runningBase === "new";
    const support = ctx.runningGoal === "supportOnly";
    if (ctx.level === "beginner" || first5k || support) {
      out = out.replace(/8 x 2 min in Zone 4/gi, "6 x 20-second controlled accelerations");
      out = out.replace(/6 x 3 min in Zone 4/gi, "6 x 20-second controlled accelerations");
      out = out.replace(/6 x 90 sec in Zone 4/gi, "5 x 20-second controlled accelerations");
      out = out.replace(/5 x 2 min in Zone 4/gi, "5 x 20-second controlled accelerations");
      out = out.replace(/3 x 8 min at your target half-marathon pace/gi, "3 x 3 min slightly quicker than easy");
      out = out.replace(/14 km progressive[^.]*/i, first5k ? "30-40 min easy walk / run" : "8 km easy, last 10 min steady if fresh");
      out = out.replace(/16 km progressive[^.]*/i, first5k ? "35-40 min easy walk / run" : "9 km easy, last 10 min steady if fresh");
      out = out.replace(/18 km progressive[^.]*/i, first5k ? "40 min easy walk / run" : "10 km easy");
      out = out.replace(/18-20 km progressive[^.]*/i, first5k ? "40 min easy walk / run" : "10-12 km easy");
      out = out.replace(/20 km progressive[^.]*/i, first5k ? "40 min easy walk / run" : "11 km easy");
      out = out.replace(/12-14 km progressive[^.]*/i, first5k ? "30 min easy walk / run" : "8 km easy");
      out = out.replace(/50 min Zone 2/gi, first5k ? "25 min easy walk / run" : "35 min Zone 2");
      out = out.replace(/55 min Zone 2/gi, first5k ? "28 min easy walk / run" : "40 min Zone 2");
      out = out.replace(/60 min Zone 2/gi, first5k ? "30 min easy walk / run" : "45 min Zone 2");
      out = out.replace(/50-55 min Zone 2/gi, first5k ? "25 min easy walk / run" : "35 min Zone 2");
      out = out.replace(/45 min Zone 2/gi, first5k ? "22 min easy walk / run" : "30 min Zone 2");
      out = out.replace(/35-40 min Zone 2/gi, first5k ? "20 min easy walk / run" : "30 min Zone 2");
    }
    return out;
  }

  function adaptExercise(ex, ctx) {
    const next = { ...ex };
    next.name = adaptRunCopy(adaptHyroxLine(adaptLiftName(ex.name, ctx), ctx), ctx);
    next.prescription = adaptDose(adaptHyroxLine(ex.prescription || "", ctx), ctx.level);
    if (ex.notes) next.notes = adaptHyroxLine(ex.notes, ctx);
    return next;
  }

  function adaptSession(s, ctx) {
    if (s.type === "recovery") return s;
    const session = {
      ...s,
      durationMin: adaptEst(s.durationMin, ctx.level),
      objective: adaptRunCopy(adaptHyroxLine(s.objective || "", ctx), ctx),
      coachNote: adaptHyroxLine(s.coachNote || "", ctx),
      callouts: (s.callouts || []).map((c) => ({ ...c, text: adaptRunCopy(adaptHyroxLine(c.text, ctx), ctx) })),
      main: (s.main || []).map((ex) => adaptExercise(ex, ctx))
    };
    if (session.durationMin) {
      session.duration = `${session.durationMin.min}–${session.durationMin.max} min`;
    }
    if (!session.main.length && session.objective) {
      session.main = [{ kind: "step", name: session.objective.replace(/^Session:\s*/i, "") }];
    }
    const first5k = ctx.runningGoal === "first5k" || ctx.runningBase === "new";
    if (session.type === "run" && (first5k || ctx.level === "beginner")) {
      const walk = { kind: "step", name: "Walk / run", prescription: "Alternate easy walking and easy jogging. Stay able to talk." };
      if (!session.main.some((ex) => /walk\s*\/\s*run|^walk\b/i.test(ex.name || ""))) session.main = [walk].concat(session.main);
    }
    if (ctx.priority === "running" && session.type === "hyrox") {
      session.type = "run";
      session.subtype = session.subtype === "hyroxStations" ? "easyRun" : "qualityRun";
      session.title = session.subtype === "easyRun" ? "Easy aerobic" : "Quality / compromised run";
      session.callouts = (session.callouts || []).slice(0, 1).concat([{ label: "Running focus", text: "Keep the runs. Treat any station as a short, easy transition — not a race rehearsal." }]).slice(0, 2);
    }
    if (ctx.level === "beginner" && session.type === "hyrox" && session.subtype === "hyroxStations" && session.main.length > 6) {
      session.main = session.main.slice(0, 6);
      session.title = session.title === "Full Simulation" ? "Short HYROX rehearsal" : session.title;
    }
    return session;
  }

  function structureFrom(sessions) {
    return sessions.map((s) => {
      if (s.type === "recovery") return [s.dayName, "Rest"];
      if (s.type === "strength") return [s.dayName, `Gym ${s.gymIndex} — ${s.title}`];
      if (s.type === "hyrox") return [s.dayName, `${s.title} — HYROX`];
      return [s.dayName, `${s.title} — Run`];
    });
  }

  function rawMasterWeek(weekNumber) {
    const w = Number(weekNumber) || 1;
    const i = w - 1;
    const meta = WEEK_META[i];
    const cond = COND[i];
    const gEst = G_EST[i];
    const sessions = [
      gymSession(1, 1, "Legs / Shoulders / Triceps", gEst[0], G1_NAMES, G1_RX[i], coresFor(w, 0)),
      runSession(2, cond.tue, w),
      gymSession(3, 2, "Chest / Back / Biceps", gEst[1], G2_NAMES, G2_RX[i], coresFor(w, 1)),
      hyroxSession(4, cond.thu, "hyroxRun", w),
      gymSession(5, 3, "Full Body", gEst[2], G3_NAMES, G3_RX[i], coresFor(w, 2)),
      runSession(6, cond.sat, w),
      hyroxSession(7, cond.sun, "hyroxStations", w)
    ];
    return { w, meta, sessions };
  }

  function keepMask(ctx) {
    const days = Number(ctx.daysPerWeek) || 7;
    const table = KEEP[ctx.priority] || KEEP.hyrox;
    return table[days] || table[7];
  }

  function weekForProfile(ctx = {}) {
    const { w, meta, sessions: raw } = rawMasterWeek(ctx.week || 1);
    const keep = keepMask(ctx);
    const sessions = raw.map((s, idx) => (keep[idx] ? adaptSession(s, ctx) : recoverySession(idx + 1)));
    const copy = PRIORITY_COPY[ctx.priority] || PRIORITY_COPY.hyrox;
    const days = Number(ctx.daysPerWeek) || 7;
    return {
      id: `${ctx.priority || "hyrox"}-${days}d`,
      masterId: "Advanced_7_Days_HYROX_Focus_SUPER_FINAL",
      isMaster: true,
      priority: ctx.priority || "hyrox",
      daysPerWeek: days,
      level: ctx.level || "advanced",
      runningGoal: ctx.runningGoal || "halfMarathon",
      runningBase: ctx.runningBase || "endurance",
      strengthBase: ctx.strengthBase || "advanced",
      equipmentProfile: ctx.equipmentProfile || "full_hyrox",
      week: w,
      block: w <= 4 ? 1 : w <= 8 ? 2 : 3,
      blockLabel: meta.blockLabel,
      weekLabel: meta.weekLabel,
      weekNote: meta.weekNote || "",
      documentTitle: copy.title,
      title: copy.title,
      subtitle: meta.subtitle,
      coverSubtitle: copy.subtitle,
      intro: copy.intro,
      weeklyGuidance: [COVER.rule],
      weeklyStructure: structureFrom(sessions),
      sessions,
      recoveryDays: sessions.filter((s) => s.type === "recovery").map((s) => s.day),
      explanations: [],
      disclaimer: "This plan is general hybrid training for healthy adults. It is not medical, physiotherapy or individualized clinical advice.",
      version: 2,
      updatedAt: "2026-09-10"
    };
  }

  function matches() {
    return true;
  }

  function weekAsPlan(weekNumber, ctx = {}) {
    return weekForProfile({ ...ctx, week: weekNumber });
  }

  function allWeeks(ctx = {}) {
    return WEEK_META.map((m) => weekForProfile({ ...ctx, week: m.week }));
  }

  function allWeeksForProfile(ctx = {}) {
    return allWeeks(ctx);
  }

  function document(ctx = {}) {
    const weeks = allWeeks(ctx);
    return { ...weeks[0], weeks, title: weeks[0].title, subtitle: weeks[0].coverSubtitle };
  }

  const api = { COVER, WEEK_META, matches, weekAsPlan, weekForProfile, allWeeks, allWeeksForProfile, document };
  root.EGSuperFinal = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
