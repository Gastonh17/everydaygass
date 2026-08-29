const EGProfile = require("../js/profile.js");
const EGCheckout = require("../js/checkout.js");
const assert = require("assert");

let n = 0;
function ok(cond, msg) {
  assert(cond, msg);
  n += 1;
}

ok(EGProfile.QUESTIONS.length <= 6, "at most 6 quiz2 questions");
ok(EGProfile.QUESTIONS.every((q) => !["strengthBase", "trainingAccess", "priority", "daysPerWeek"].includes(q.field)), "no quiz1 fields");

const quiz1 = {
  priority: "running",
  daysPerWeek: 5,
  level: "intermediate",
  runningBase: "10k",
  strengthBase: "some",
  trainingAccess: "full_gym"
};
const quiz2 = {
  runningVolume: "10to20",
  target: "hyrox",
  eventWindow: "8to12",
  sessionMinutes: "45",
  limitation: "endurance",
  success: "race"
};

ok(EGProfile.questionsFor(quiz2).length === 6, "event question included for HYROX");
ok(EGProfile.questionsFor({ target: "hybrid" }).length === 5, "no event question for general fitness");
ok(EGProfile.isComplete(quiz2), "complete hyrox answers");
ok(!EGProfile.isComplete({ runningVolume: "10to20", target: "hyrox" }), "incomplete");

const profile = EGProfile.build(quiz1, quiz2);
ok(profile.trainingDays === 5, "days from quiz1");
ok(profile.priority === "running", "priority from quiz1");
ok(profile.runningLevel === "10k", "running level from quiz1");
ok(profile.strengthLevel === "some", "strength from quiz1");
ok(profile.equipment === "full_gym", "equipment from quiz1");
ok(profile.sessionMinutes === 45, "session length from quiz2");
ok(profile.target === "hyrox", "target from quiz2");
ok(profile.limitation === "endurance", "limitation from quiz2");
ok(profile.eventDate === "8to12", "event window stored");

const lines = EGProfile.summaryLines(profile);
ok(lines.some((l) => l.includes("5 training days")), "days in summary");
ok(lines.some((l) => /running/i.test(l)), "priority in summary");
ok(lines.some((l) => /HYROX/i.test(l)), "target in summary");
ok(lines.some((l) => /endurance/i.test(l)), "limitation in summary");
ok(lines.some((l) => /Full gym/i.test(l)), "equipment in summary");

const road = EGProfile.roadmap(profile);
ok(road.length === 3, "three roadmap blocks");
ok(road[0].weeks === "Weeks 1–4" && /base/i.test(road[0].title), "block 1");
ok(road[1].weeks === "Weeks 5–8" && /volume/i.test(road[1].title), "block 2");
ok(road[2].weeks === "Weeks 9–12" && /progression/i.test(road[2].title), "block 3");
ok(/endurance/i.test(road[0].detail), "roadmap uses limitation");
ok(/aerobic/i.test(road[0].title) || /running/i.test(road[2].detail), "running priority wording");

const balanced = EGProfile.roadmap({ priority: "balanced", limitation: "consistency" });
ok(balanced[0].title === "Build your base", "balanced uses spec titles");
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
