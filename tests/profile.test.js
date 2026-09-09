const EGProfile = require("../js/profile.js");
const EGCheckout = require("../js/checkout.js");
const assert = require("assert");

let n = 0;
function ok(cond, msg) {
  assert(cond, msg);
  n += 1;
}

const quiz1 = {
  priority: "running",
  daysPerWeek: 5,
  level: "intermediate",
  runningBase: "10k",
  runningGoal: "10k",
  strengthBase: "some",
  equipmentProfile: "full_hyrox"
};
const quiz2 = {
  result: "race",
  eventWindow: "8to12",
  runningVolume: "10to20",
  sessionMinutes: "45",
  benchmark: "5k",
  runningTarget: "10k"
};

ok(EGProfile.questionsFor(quiz2, quiz1).length <= 6, "at most 6 quiz2 questions");
ok(EGProfile.questionsFor(quiz2, quiz1).every((q) => !["strengthBase", "trainingAccess", "priority", "daysPerWeek"].includes(q.field)), "no quiz1 fields");
ok(EGProfile.questionsFor(quiz2, { priority: "hyrox" }).some((q) => q.field === "limitingFactor"), "hyrox limitation question");
ok(EGProfile.questionsFor({ result: "hybrid" }, { priority: "balanced" }).length === 6, "universal + balanced focus");
ok(EGProfile.isComplete(quiz2, quiz1), "complete answers");
ok(!EGProfile.isComplete({ runningVolume: "10to20", result: "race" }, quiz1), "incomplete");

const profile = EGProfile.build(quiz1, quiz2);
ok(profile.trainingDays === 5, "days from quiz1");
ok(profile.priority === "running", "priority from quiz1");
ok(profile.runningLevel === "10k", "running level from quiz1");
ok(profile.strengthLevel === "some", "strength from quiz1");
ok(profile.equipment === "full_hyrox", "equipment from quiz1");
ok(profile.sessionMinutes === 45, "session length from quiz2");
ok(profile.target === "race", "result mapped to target");
ok(profile.eventDate === "8to12", "event window stored");

const lines = EGProfile.summaryLines(profile);
ok(lines.some((l) => l.includes("5 training days")), "days in summary");
ok(lines.some((l) => /running/i.test(l)), "priority in summary");
ok(lines.some((l) => /HYROX|Full gym/i.test(l)), "equipment in summary");

const road = EGProfile.roadmap(profile);
ok(road.length === 3, "three roadmap blocks");
ok(road[0].title === "BUILD", "block 1 BUILD");
ok(road[1].title === "PROGRESS", "block 2 PROGRESS");
ok(road[2].title === "PERFORM", "block 3 PERFORM");
ok(EGProfile.OFFER_ITEMS.length >= 8, "offer list");
ok(EGProfile.PREMIUM_ITEMS.length === 4, "premium bullets");
ok(EGProfile.PREMIUM_ITEMS.some((item) => /FIT Cookbook/i.test(item)), "cookbook");
ok(!JSON.stringify(EGProfile.QUESTIONS).includes("129"), "no price in quiz2");
ok(!JSON.stringify(EGProfile.QUESTIONS).includes("€"), "no euro in quiz2");

const href = EGCheckout.mailto(profile);
ok(href.startsWith("mailto:hello@everydaygass.com"), "mailto checkout");
ok(decodeURIComponent(href).includes("€129"), "price only at checkout");
ok(decodeURIComponent(href).includes("5 training days"), "profile in checkout body");
ok(!EGCheckout.usesStripe(), "stripe link empty until configured");
ok(EGCheckout.url(profile) === href, "falls back to mailto");

const premiumHref = EGCheckout.mailto(profile, "premium");
ok(decodeURIComponent(premiumHref).includes("€249"), "premium price at checkout");
ok(/Premium/i.test(decodeURIComponent(premiumHref)), "premium subject");

console.log(`ok ${n} assertions`);
