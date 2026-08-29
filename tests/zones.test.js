const EGZones = require("../js/zones.js");
const assert = require("assert");

let n = 0;
function ok(cond, msg) {
  assert(cond, msg);
  n += 1;
}

ok(EGZones.fromMaxHr(119) === null, "reject low HR");
ok(EGZones.fromMaxHr(231) === null, "reject high HR");
ok(EGZones.fromMaxHr(185).maxHr === 185, "accept max HR");

const hr = EGZones.compute({ method: "hr", maxHr: 180 });
ok(hr.bands[0].display === "90–108 bpm", "Z1 Polar 50–60%");
ok(hr.bands[1].display === "108–126 bpm", "Z2 Polar 60–70%");
ok(hr.bands[1].focus, "Z2 is the focus zone");
ok(hr.bands[4].display === "162–180 bpm", "Z5 Polar 90–100%");

ok(EGZones.fromFiveK({ mode: "time", min: 11, sec: 59 }) === null, "reject fast 5K");
ok(EGZones.fromFiveK({ mode: "time", min: 45, sec: 1 }) === null, "reject slow 5K");

const fromTime = EGZones.fromFiveK({ mode: "time", min: 25, sec: 0 });
ok(fromTime.fiveKSec === 1500, "25:00 5K in seconds");
ok(EGZones.formatClock(1500) === "25:00", "format 25:00");

const fromPace = EGZones.fromFiveK({ mode: "pace", min: 5, sec: 0 });
ok(fromPace.fiveKSec === 1500, "5:00 /km is a 25:00 5K");

const vdot25 = EGZones.vdotFromFiveK(25 * 60);
ok(vdot25 > 38 && vdot25 < 38.6, `25:00 5K VDOT ~38.3, got ${vdot25}`);

const vdot50 = EGZones.vdotFromFiveK(19 * 60 + 57);
ok(vdot50 > 49.7 && vdot50 < 50.3, `19:57 5K VDOT ~50, got ${vdot50}`);

const pace = EGZones.compute(fromTime);
ok(pace.bands.length === 5, "five pace zones");
ok(pace.bands[1].display.includes("/km"), "pace shown per km");
ok(pace.bands[1].hi < pace.bands[1].lo, "faster end of Z2 is a lower min/km");
ok(pace.bands[4].hi < pace.bands[0].hi, "Z5 is faster than Z1");

const hint = EGZones.hint(hr);
ok(hint.includes("108–126 bpm"), "banner hint uses Z2");

const sum = EGZones.summarize(fromTime);
ok(sum.line.includes("5K 25:00"), "week PDF summary includes 5K time");
ok(sum.line.includes("Z2 easy"), "week PDF summary includes Z2");

ok(EGZones.normalize({ maxHr: 190, source: "tested" }).method === "hr", "legacy max-HR save still works");
ok(EGZones.compute(null) === null, "empty save is empty");

console.log(`ok ${n} assertions`);
