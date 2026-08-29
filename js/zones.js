/* EverydayGass — Polar %HRmax + Jack Daniels VDOT zone calculator. */
(function (root) {
  const HR_MIN = 120;
  const HR_MAX = 230;
  const FIVEK_SEC_MIN = 12 * 60;
  const FIVEK_SEC_MAX = 45 * 60;

  const ZONES = [
    { id: 1, name: "Z1 · Recovery", rpe: "Walk. Nose breathing. RPE 1–2.", hrLo: 0.5, hrHi: 0.6, vdotLo: 0.5, vdotHi: 0.59 },
    { id: 2, name: "Z2 · Easy", rpe: "You can talk. Easy runs. RPE 3–4.", hrLo: 0.6, hrHi: 0.7, vdotLo: 0.59, vdotHi: 0.74, focus: true },
    { id: 3, name: "Z3 · Steady", rpe: "Short sentences. Quality sessions. RPE 5–6.", hrLo: 0.7, hrHi: 0.8, vdotLo: 0.74, vdotHi: 0.84 },
    { id: 4, name: "Z4 · Hard", rpe: "A few words. Threshold. RPE 7–8.", hrLo: 0.8, hrHi: 0.9, vdotLo: 0.84, vdotHi: 0.95 },
    { id: 5, name: "Z5 · Max", rpe: "Few words or none. Intervals. RPE 9–10.", hrLo: 0.9, hrHi: 1, vdotLo: 0.95, vdotHi: 1.1 }
  ];

  const pad = (n) => String(n).padStart(2, "0");

  function formatClock(totalSec) {
    const sec = Math.max(0, Math.round(Number(totalSec) || 0));
    return `${Math.floor(sec / 60)}:${pad(sec % 60)}`;
  }

  function formatPace(minPerKm) {
    if (!Number.isFinite(minPerKm) || minPerKm <= 0) return "";
    return formatClock(minPerKm * 60);
  }

  function clockToSec(min, sec) {
    const m = Number(min);
    const s = sec === "" || sec == null ? 0 : Number(sec);
    if (!Number.isFinite(m) || m < 0 || !Number.isFinite(s) || s < 0 || s > 59) return null;
    return Math.round(m * 60 + s);
  }

  function vo2(v) {
    return -4.6 + 0.182258 * v + 0.000104 * v * v;
  }

  function pctVo2max(tMin) {
    return 0.8 + 0.1894393 * Math.exp(-0.012778 * tMin) + 0.2989558 * Math.exp(-0.1932605 * tMin);
  }

  function vdotFromFiveK(fiveKSec) {
    const tMin = fiveKSec / 60;
    const v = 5000 / tMin;
    return vo2(v) / pctVo2max(tMin);
  }

  function velocityAtPct(vdot, pct) {
    const target = vdot * pct;
    const a = 0.000104;
    const b = 0.182258;
    const c = -4.6 - target;
    const disc = b * b - 4 * a * c;
    if (disc < 0) return 0;
    return (-b + Math.sqrt(disc)) / (2 * a);
  }

  function minPerKm(v) {
    return v > 0 ? 1000 / v : 0;
  }

  function fromMaxHr(value) {
    const maxHr = Number(value);
    if (!Number.isFinite(maxHr) || maxHr < HR_MIN || maxHr > HR_MAX) return null;
    return { method: "hr", maxHr: Math.round(maxHr) };
  }

  function fromFiveK({ mode, min, sec }) {
    const clock = clockToSec(min, sec);
    if (clock == null || clock <= 0) return null;
    const fiveKMode = mode === "pace" ? "pace" : "time";
    const fiveKSec = fiveKMode === "pace" ? clock * 5 : clock;
    if (fiveKSec < FIVEK_SEC_MIN || fiveKSec > FIVEK_SEC_MAX) return null;
    return {
      method: "fivek",
      fiveKSec,
      fiveKMode,
      clockMin: Number(min),
      clockSec: sec === "" || sec == null ? 0 : Number(sec)
    };
  }

  function normalize(saved) {
    if (!saved || typeof saved !== "object") return null;
    if (saved.method === "fivek" && saved.fiveKSec >= FIVEK_SEC_MIN && saved.fiveKSec <= FIVEK_SEC_MAX) {
      return {
        method: "fivek",
        fiveKSec: saved.fiveKSec,
        fiveKMode: saved.fiveKMode === "pace" ? "pace" : "time",
        clockMin: saved.clockMin,
        clockSec: saved.clockSec
      };
    }
    if (saved.maxHr >= HR_MIN && saved.maxHr <= HR_MAX) {
      return { method: "hr", maxHr: saved.maxHr };
    }
    return null;
  }

  function hrBands(maxHr) {
    return ZONES.map((z) => {
      const lo = Math.round(maxHr * z.hrLo);
      const hi = Math.round(maxHr * z.hrHi);
      return {
        ...z,
        lo,
        hi,
        unit: "bpm",
        display: `${lo}–${hi} bpm`
      };
    });
  }

  function paceBands(fiveKSec) {
    const vdot = vdotFromFiveK(fiveKSec);
    return {
      vdot,
      bands: ZONES.map((z) => {
        const fast = minPerKm(velocityAtPct(vdot, z.vdotHi));
        const slow = minPerKm(velocityAtPct(vdot, z.vdotLo));
        const miFast = fast * 1.609344;
        const miSlow = slow * 1.609344;
        return {
          ...z,
          lo: slow,
          hi: fast,
          unit: "/km",
          display: `${formatPace(fast)}–${formatPace(slow)} /km`,
          displayMi: `${formatPace(miFast)}–${formatPace(miSlow)} /mi`
        };
      })
    };
  }

  function compute(saved) {
    const z = normalize(saved);
    if (!z) return null;
    if (z.method === "hr") {
      const bands = hrBands(z.maxHr);
      return {
        ...z,
        label: `From your max HR of ${z.maxHr} bpm. Easy running should live in Z2.`,
        sourceLine: `Max HR ${z.maxHr} bpm`,
        bands
      };
    }
    const { vdot, bands } = paceBands(z.fiveKSec);
    const pace = formatPace(z.fiveKSec / 5 / 60);
    return {
      ...z,
      vdot,
      label: `From a ${formatClock(z.fiveKSec)} 5K (${pace} /km). Easy running should live in Z2.`,
      sourceLine: `5K ${formatClock(z.fiveKSec)} · ${pace} /km`,
      bands
    };
  }

  function hint(saved) {
    const result = compute(saved);
    if (!result) return "What RPE means, and how to set your running zones.";
    const z2 = result.bands[1];
    return `Z2 easy · ${z2.display} · tap to review RPE and zones.`;
  }

  function summarize(saved) {
    const result = compute(saved);
    if (!result) return null;
    const z2 = result.bands[1];
    return {
      line: `${result.sourceLine} · Z2 easy ${z2.display}`,
      result
    };
  }

  const api = {
    ZONES,
    HR_MIN,
    HR_MAX,
    FIVEK_SEC_MIN,
    FIVEK_SEC_MAX,
    formatClock,
    formatPace,
    fromMaxHr,
    fromFiveK,
    normalize,
    vdotFromFiveK,
    compute,
    hint,
    summarize
  };

  root.EGZones = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
