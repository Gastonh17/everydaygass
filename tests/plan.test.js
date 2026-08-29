const { getPlanId, PRIORITIES, DAYS } = require("../js/getPlanId.js");
const { PLANS, getPlan, allPlanIds } = require("../js/data/plans.js");
const assert = require("assert");

let n = 0;
function ok(cond, msg) {
  assert(cond, msg);
  n += 1;
}

PRIORITIES.forEach((p) => {
  DAYS.forEach((d) => {
    const id = getPlanId(p, d);
    ok(id === `${p}-${d}d`, `id ${p} ${d}`);
    const plan = getPlan(id);
    ok(plan, `plan exists ${id}`);
    ok(plan.id === id, "plan.id matches");
    ok(plan.priority === p, "priority");
    ok(plan.daysPerWeek === d, "days");
    ok(plan.title && plan.intro && plan.disclaimer, "copy");
    ok(Array.isArray(plan.sessions) && plan.sessions.length === 7, "7 calendar days");
    ok(plan.sessions.every((s) => s.main && s.main.length), "sessions have main");
    const train = plan.sessions.filter((s) => s.type !== "recovery").length;
    ok(train === d, `${id} should have ${d} training/mobility days, got ${train}`);
  });
});

ok(allPlanIds().length === 20, "20 plans");
ok(getPlanId("running", 2) === null, "reject days 2");
ok(getPlanId("yoga", 4) === null, "reject priority");
ok(getPlan("nope") === null, "missing plan");
ok(!getPlanId("balanced", 5) || getPlan(getPlanId("balanced", 5)).id === "balanced-5d", "balanced-5d");

console.log(`ok ${n} assertions, ${allPlanIds().length} plans`);
