/* Free quiz V2 — every answer changes training, substitutions, safety, or segmentation. */
(function (root) {
  const PRIORITY = [
    ["running", "Running", "Run better, while keeping useful strength"],
    ["strength", "Strength", "Get stronger, with conditioning as support"],
    ["balanced", "Balanced", "Build strength and endurance together"],
    ["hyrox", "HYROX", "Prepare for HYROX-style performance"]
  ];

  const CONSTRAINT_CHIPS = [
    ["impact", "High-impact running / jumping"],
    ["knee", "Knee-dominant movements"],
    ["hinge_back", "Hip hinge / lower back loading"],
    ["overhead", "Overhead movements"],
    ["other", "Other"]
  ];

  function runningGoals(priority) {
    const all = [
      ["first5k", "Run my first 5K", "Continuous running is the goal"],
      ["improve5k", "Improve my 5K", "Economy and controlled speed"],
      ["10k", "Prepare for a 10K", "Volume and threshold"],
      ["halfMarathon", "Prepare for a Half Marathon", "Sustainable long-run development"],
      ["performance", "Improve general running performance", "No assumed race distance"],
      ["supportOnly", "Running is only support training", "Keep it mostly easy"]
    ];
    if (priority === "strength") {
      const support = all.find((o) => o[0] === "supportOnly");
      return [support, ...all.filter((o) => o[0] !== "supportOnly")];
    }
    return all;
  }

  function questionsFor(state = {}) {
    return [
      {
        id: "priority",
        field: "priority",
        title: "What's your main training focus?",
        options: PRIORITY
      },
      {
        id: "daysPerWeek",
        field: "daysPerWeek",
        title: "How many days per week can you realistically train?",
        hint: "Choose the schedule you can sustain, not the maximum you could do once.",
        options: [
          ["3", "3 days", "Enough to start"],
          ["4", "4 days", "The usual busy-week fit"],
          ["5", "5 days", "Only if this is honest"],
          ["6", "6 days", "High frequency, still recoverable"],
          ["7", "7 days", "Six sessions + one easy recovery"]
        ]
      },
      {
        id: "level",
        field: "level",
        title: "What's your current overall training level?",
        options: [
          ["beginner", "Beginner", "I'm new to structured training or still learning most exercises."],
          ["intermediate", "Intermediate", "I train consistently and know the main gym and running movements."],
          ["advanced", "Advanced", "I have several years of structured training and can manage demanding sessions."]
        ]
      },
      {
        id: "runningBase",
        field: "runningBase",
        title: "What's your current running level?",
        options: [
          ["new", "New to running", "I cannot yet comfortably run 5 km continuously."],
          ["5k", "Around 5K", "I can comfortably complete around 5 km."],
          ["10k", "Around 10K", "I can comfortably complete around 10 km."],
          ["endurance", "Endurance", "I regularly run 10 km+ and use structured sessions."]
        ]
      },
      {
        id: "runningGoal",
        field: "runningGoal",
        title: "What would you like your running to achieve?",
        options: runningGoals(state.priority)
      },
      {
        id: "strengthBase",
        field: "strengthBase",
        title: "What's your strength-training experience?",
        options: [
          ["new", "New", "Little or no gym experience."],
          ["some", "Some experience", "I know basic machines and dumbbell exercises."],
          ["consistent", "Consistent", "I train regularly and use free weights confidently."],
          ["advanced", "Advanced", "I have structured strength experience with compound lifts."]
        ]
      },
      {
        id: "equipmentProfile",
        field: "equipmentProfile",
        title: "What equipment do you normally have access to?",
        options: [
          ["full_hyrox", "Full gym + HYROX", "Ergs, sled, carries, wall balls / sandbag."],
          ["gym_no_hyrox", "Regular gym", "Standard gym, no complete HYROX setup."],
          ["minimal_home", "Home / minimal", "Bodyweight, running, maybe dumbbells or bands."]
        ]
      },
      {
        id: "hasConstraints",
        field: "hasConstraints",
        title: "Do you have any movement limitations or exercises you need to avoid?",
        confirm: true,
        chips: CONSTRAINT_CHIPS,
        options: [
          ["no", "No", "I’ll use the standard substitutions"],
          ["yes", "Yes", "I’ll pick what to avoid — this is not rehab"]
        ]
      }
    ];
  }

  const api = { PRIORITY, CONSTRAINT_CHIPS, runningGoals, questionsFor };
  root.EGQuiz = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
