const { getPlanId, PRIORITIES, DAYS } = require("../js/getPlanId.js");
const Layouts = require("../js/data/weeklyLayouts.js");
const Race = require("../js/data/hyroxRaceLoads.js");
const Engine = require("../js/engine/engine.js");
const assert = require("assert");

let n = 0;
function ok(cond, msg) {
  assert(cond, msg);
  n += 1;
}

ok(Layouts.allLayoutIds().length === 20, "exactly 20 layouts");
PRIORITIES.forEach((p) => {
  DAYS.forEach((d) => {
    const keys = Layouts.getLayout(p, d);
    ok(keys && keys.length === 7, `7-day skeleton ${p}-${d}d`);
    const active = keys.filter((k) => k !== "recovery").length;
    ok(active === d, `${p}-${d}d active ${active}`);
  });
});

ok(getPlanId("running", 4) === "running-4d", "plan id deterministic");
ok(Engine.getBlock(1) === 1 && Engine.getBlock(4) === 1, "block 1");
ok(Engine.getBlock(5) === 2 && Engine.getBlock(8) === 2, "block 2");
ok(Engine.getBlock(9) === 3 && Engine.getBlock(12) === 3, "block 3");

const beginner = Engine.buildFreeWeek({
  priority: "running",
  daysPerWeek: 4,
  level: "beginner",
  runningBase: "new",
  runningGoal: "first5k",
  strengthBase: "new",
  equipmentProfile: "gym_no_hyrox"
});
const advanced = Engine.buildFreeWeek({
  priority: "running",
  daysPerWeek: 4,
  level: "advanced",
  runningBase: "endurance",
  runningGoal: "halfMarathon",
  strengthBase: "advanced",
  equipmentProfile: "full_hyrox"
});

ok(beginner.sessions.length === 7, "beginner 7 days");
ok(advanced.sessions.length === 7, "advanced 7 days");
ok(JSON.stringify(beginner.sessions) !== JSON.stringify(advanced.sessions), "beginner ≠ advanced");
ok(beginner.sessions.some((s) => /walk/i.test(JSON.stringify(s.main))), "first5k walk/run");
ok(advanced.sessions.some((s) => /long|endurance|progressive/i.test(JSON.stringify(s))), "HM long-run language");

const blob = JSON.stringify(beginner);
ok(/run/i.test(blob), "running content exists");
beginner.sessions.forEach((s) => {
  (s.main || []).forEach((item) => {
    if (item.kind === "run_block") ok(/run/i.test(item.name || item.distance), "distance includes run");
  });
  if (s.type !== "recovery") ok(s.durationMin && s.durationMin.min != null, `duration ${s.day}`);
});
ok(beginner.sessions.filter((s) => s.type === "strength").every((s) =>
  s.main.some((ex) => /plank|dead bug|v-up|crunch|pallof|knee raise|side bend/i.test(ex.name))
), "gym sessions include core");

const home = Engine.buildFreeWeek({
  priority: "hyrox",
  daysPerWeek: 5,
  level: "intermediate",
  runningBase: "5k",
  runningGoal: "performance",
  strengthBase: "some",
  equipmentProfile: "minimal_home"
});
const homeNames = JSON.stringify(home.sessions.flatMap((s) => [...(s.warmup || []), ...(s.main || []), ...(s.cooldown || [])].map((i) => i.name)));
ok(!/SkiErg|RowErg|Sled Push|Lat Pulldown|Leg Press/i.test(homeNames), "minimal_home has no gym-only kit");

const gym = Engine.buildFreeWeek({
  priority: "hyrox",
  daysPerWeek: 5,
  level: "advanced",
  runningBase: "10k",
  runningGoal: "performance",
  strengthBase: "advanced",
  equipmentProfile: "gym_no_hyrox"
});
ok(!/SkiErg|RowErg/i.test(JSON.stringify(gym.sessions.map((s) => s.main))), "gym_no_hyrox substitutes ergs");

const full = Engine.buildFreeWeek({
  priority: "hyrox",
  daysPerWeek: 7,
  level: "advanced",
  runningBase: "endurance",
  runningGoal: "performance",
  strengthBase: "advanced",
  equipmentProfile: "full_hyrox"
});
ok(/incl\.?\s*sled|including the sled/i.test(JSON.stringify(full)), "sled totals include the sled");
ok(/\d+\s*reps|x \d+|Wall Balls/i.test(JSON.stringify(full)), "wall ball reps in workout");
ok(Object.keys(Race.RACE_LOADS.categories).length >= 2, "race loads from config");

ok(full.isMaster && full.masterId === "Advanced_7_Days_HYROX_Focus_SUPER_FINAL", "advanced 7d HYROX uses SUPER_FINAL master");
ok(full.sessions[0].title === "Legs / Shoulders / Triceps", "master gym 1 title");
ok(full.sessions[0].durationMin.min >= 70, "master gym 1 stays a full session");
ok(full.sessions[6].title === "No-Run", "master Sunday is no-run HYROX");

const hyrox5 = Engine.buildFreeWeek({
  priority: "hyrox",
  daysPerWeek: 5,
  level: "advanced",
  runningBase: "endurance",
  runningGoal: "halfMarathon",
  strengthBase: "advanced",
  equipmentProfile: "full_hyrox"
});
ok(hyrox5.isMaster, "advanced 5d HYROX uses the same master gym");
ok(hyrox5.sessions[0].title === "Legs / Shoulders / Triceps", "5d gym 1 is the master lift day");
ok(hyrox5.sessions[0].durationMin.min >= 70, "5d gym 1 is not shortened");
ok(hyrox5.sessions[0].main.filter((ex) => !/plank|v-up|side bend/i.test(ex.name)).length >= 8, "5d gym 1 keeps 8 lifts");
ok(hyrox5.sessions[4].type === "recovery", "5d drops Friday gym instead of cutting Monday");

const noRun = full.sessions.find((s) => s.subtype === "hyroxStations");
ok(noRun && /500 m|250 m|400 m|erg|Ski|Row|Cardio/i.test(JSON.stringify(noRun.main[0]) + JSON.stringify(noRun.main[1])), "no-run starts with erg");

const weeks = Engine.build12WeekPlan(beginner);
ok(weeks.length === 12, "12 weeks");
ok(weeks[0].block === 1 && weeks[5].block === 2 && weeks[11].block === 3, "three blocks");
ok(JSON.stringify(weeks[0]) !== JSON.stringify(weeks[6]), "progression changes content");

const masterWeeks = Engine.build12WeekPlan({
  priority: "hyrox",
  daysPerWeek: 7,
  level: "advanced",
  runningBase: "endurance",
  runningGoal: "halfMarathon",
  strengthBase: "advanced",
  equipmentProfile: "full_hyrox"
});
ok(masterWeeks.length === 12, "SUPER_FINAL is 12 weeks");
ok(masterWeeks[11].weekLabel === "PEAK WEEK", "week 12 is peak");
ok(masterWeeks[11].sessions[6].title === "Full Simulation", "week 12 Sunday is full HYROX simulation");
masterWeeks.forEach((week) => {
  week.sessions.filter((s) => s.type === "run").forEach((s) => {
    ok((s.callouts || []).length > 0, `week ${week.week} ${s.dayName} has examples/notes`);
  });
});
ok(masterWeeks[2].sessions[1].callouts.some((c) => /acceleration|example|easy/i.test(c.label + c.text)), "week 3 Tuesday easy run has notes");
ok(Engine.buildPlanDocument(full).weeks.length === 12, "plan document bundles 12 weeks");

const v = Engine.validateWeek(beginner, beginner);
ok(v.ok, `validate beginner: ${v.errors.join(",")}`);

const newStrength = Engine.buildFreeWeek({
  priority: "strength",
  daysPerWeek: 3,
  level: "beginner",
  runningBase: "new",
  runningGoal: "supportOnly",
  strengthBase: "new",
  equipmentProfile: "gym_no_hyrox"
});
const advStrength = Engine.buildFreeWeek({
  priority: "strength",
  daysPerWeek: 3,
  level: "advanced",
  runningBase: "5k",
  runningGoal: "supportOnly",
  strengthBase: "advanced",
  equipmentProfile: "full_hyrox"
});
ok(JSON.stringify(newStrength.sessions) !== JSON.stringify(advStrength.sessions), "strengthBase changes lifts");
ok(newStrength.isMaster && advStrength.isMaster, "strength plans start from the master week");
ok(!/Top 1 x/i.test(JSON.stringify(newStrength.sessions)), "beginner strength has no true top set");
ok(/Top 1 x/i.test(JSON.stringify(advStrength.sessions)), "advanced strength keeps master top sets");
ok(beginner.isMaster && advanced.isMaster, "running plans start from the master week");

const balancedHome = Engine.buildFreeWeek({
  priority: "balanced",
  daysPerWeek: 6,
  level: "intermediate",
  runningBase: "10k",
  runningGoal: "10k",
  strengthBase: "some",
  equipmentProfile: "minimal_home"
});
ok(balancedHome.isMaster, "balanced plans start from the master week");
ok(!/SkiErg|RowErg|Sled Push|Lat Pulldown|Leg Press/i.test(
  JSON.stringify(balancedHome.sessions.flatMap((s) => (s.main || []).map((i) => i.name)))
), "balanced home substitutes master kit");

console.log(`ok ${n} engine assertions`);
