const Migrate = require("../js/quiz/migrateState.js");
const assert = require("assert");

let n = 0;
function ok(cond, msg) {
  assert(cond, msg);
  n += 1;
}

const v1 = {
  priority: "running",
  daysPerWeek: 4,
  level: "beginner",
  runningBase: "performance",
  strengthBase: "some",
  trainingAccess: "home_run",
  hasConstraints: false
};
const next = Migrate.migrate(v1);
ok(next.runningBase === "endurance", "performance → endurance");
ok(next.equipmentProfile === "minimal_home", "home_run → minimal_home");
ok(next.runningGoal === "performance", "default goal from old performance base");
ok(next.schemaVersion === 2, "schema v2");
ok(Migrate.migrateEquipment("full_gym") === "full_hyrox", "full gym maps");
ok(Migrate.migrateEquipment("basic_gym") === "gym_no_hyrox", "basic gym maps");

console.log(`ok ${n} migrate assertions`);
