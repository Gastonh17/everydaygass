/* EverydayGass — SUPER_FINAL mobile plan format, white / beige scale. */
window.EGPdf = (() => {
  const TYPE_LABEL = {
    run: "Run",
    strength: "Gym",
    hyrox: "HYROX",
    mobility: "Mobility",
    recovery: "Rest"
  };
  const PRIORITY_LABEL = {
    running: "Running",
    strength: "Strength",
    balanced: "Balanced hybrid",
    hyrox: "HYROX"
  };
  const LEVEL_LABEL = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced"
  };
  const CORE_RE = /plank|v-up|dead bug|side bend|pallof|crunch|knee raise/i;
  const C = {
    ink: "#1F1A14",
    charcoal: "#4A4238",
    paper: "#FFFFFF",
    sand: "#E8DCCB",
    mist: "#F0E8DC",
    page: "#F6F1E9",
    muted: "#7A7166",
    accent: "#C4B193",
    deep: "#3F372E",
    line: "rgba(31, 26, 20, .10)"
  };

  const esc = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  function durationText(s) {
    const d = s.durationMin;
    if (!d) return s.duration || "";
    if (typeof d === "number") return `${d} min`;
    if (d.min != null && d.max != null) return `${d.min}–${d.max} min`;
    return "";
  }

  function chip(text) {
    return text ? `<span class="chip">${esc(text)}</span>` : "";
  }

  function metaLine(plan, state) {
    const level = LEVEL_LABEL[state.level] || LEVEL_LABEL[plan.level] || "Intermediate";
    const days = `${plan.daysPerWeek} days`;
    const priority = PRIORITY_LABEL[state.priority] || PRIORITY_LABEL[plan.priority] || plan.priority;
    const focus = (state.priority || plan.priority) === "hyrox" ? " FOCUS" : "";
    return `${esc(level)}  /  ${esc(days)}  /  ${esc(priority)}${focus}`.toUpperCase();
  }

  function weekLetter(plan) {
    if (plan.weekLabel) return plan.weekLabel;
    if (Number(plan.week) === 12) return "PEAK WEEK";
    return Number(plan.week || 1) % 2 === 0 ? "WEEK B" : "WEEK A";
  }

  function splitItems(s) {
    const main = s.main || [];
    const core = [];
    const work = [];
    main.forEach((ex) => (CORE_RE.test(ex.name || "") ? core : work).push(ex));
    return { work, core };
  }

  function doseLine(ex) {
    let rx = ex.prescription || "";
    rx = rx.replace(/Men Open example:\s*/i, "");
    rx = rx.replace(/approx\.\s*/gi, "~");
    rx = rx.replace(/ • /g, " | ");
    rx = rx.replace(/\s+\|\s+/g, " | ");
    rx = rx.replace(/1RM\s+Rest\b/gi, "1RM | Rest");
    if (ex.rest && !/rest/i.test(rx)) rx += ` | Rest ${ex.rest}`;
    else if (ex.restSec && !/rest/i.test(rx)) {
      const mins = Math.round(ex.restSec / 60);
      rx += mins ? ` | Rest ${mins} min` : ` | Rest ${ex.restSec}s`;
    }
    rx = rx.replace(/(\d+)\s*[-–]\s*(\d+)\s*(min|sec|s)\b/gi, "$1–$2\u00a0$3");
    rx = rx.replace(/Rest\s+/gi, "Rest\u00a0");
    rx = rx.replace(/%\s*1RM/g, "%\u00a01RM");
    rx = rx.replace(/\s+\|\s+/g, "\u00a0|\u00a0");
    return rx.trim();
  }

  function gymEx(ex) {
    const tag = ex.emphasis === "main_lift" ? `<span class="mini-tag">Strength</span>` : "";
    const notes = ex.notes ? `<small>${esc(ex.notes)}</small>` : "";
    return `<div class="ex">
      <div class="ex__top">
        <strong>${esc(ex.name)}</strong>
        ${tag}
      </div>
      <p>${esc(doseLine(ex))}</p>
      ${notes}
    </div>`;
  }

  function sessionSteps(list = []) {
    return `<ol class="steps">${list.map((ex, i) => `
      <li>
        <span class="n">${i + 1}</span>
        <div>
          <strong>${esc(ex.name)}</strong>
          ${ex.prescription ? `<span>${esc(doseLine(ex))}</span>` : ""}
          ${ex.notes ? `<small>${esc(ex.notes)}</small>` : ""}
        </div>
      </li>`).join("")}</ol>`;
  }

  function callout(label, text, kind = "note") {
    if (!text) return "";
    return `<div class="callout callout--${kind}"><i></i><div><b>${esc(label)}</b>${esc(text)}</div></div>`;
  }

  function gymCard(s, index, cols = 1) {
    const { work, core } = splitItems(s);
    const items = work.length ? work : s.main || [];
    const dense = cols === 1 && items.length > 4 ? " is-split" : "";
    return `<article class="card card--gym${dense}">
      <header class="card__bar">
        <p class="day">${esc(s.dayName)}</p>
        <span class="tag tag--gym">Gym ${s.gymIndex || index + 1}</span>
      </header>
      <div class="card__meta">
        <h3>${esc(s.title)}</h3>
        <p class="est">Est. ${esc(durationText(s))}</p>
      </div>
      <div class="card__body">
        <div class="ex-list">${items.map(gymEx).join("")}</div>
        ${core.length ? `<div class="core"><b>Core finisher</b>${core.map((ex, i) => `${i + 1}) ${esc(ex.name)} ${esc(ex.prescription || "")}`).join("  ")}</div>` : ""}
      </div>
    </article>`;
  }

  function condCard(s) {
    const { work, core } = splitItems(s);
    const steps = work.length ? work : (s.main || []);
    const numbered = steps.length > 1 && (s.type === "hyrox" || steps.some((ex) => ex.kind === "hyrox_station" || ex.kind === "step"));
    const extraCallouts = (s.callouts || []).map((c) => callout(c.label, c.text)).join("");
    let body = "";
    if (numbered) body = sessionSteps(steps);
    else if (steps.length) {
      body = `<p class="session-copy">${steps.map((ex) => `<strong>${esc(ex.name)}</strong>${ex.prescription ? ` ${esc(doseLine(ex))}` : ""}${ex.notes ? `. ${esc(ex.notes)}` : ""}`).join(" ")}</p>`;
    }
    return `<article class="card card--cond">
      <header class="card__bar">
        <p class="day">${esc(s.dayName)}</p>
        <span class="tag tag--${s.type}">${esc(TYPE_LABEL[s.type] || s.type)}</span>
      </header>
      <div class="card__meta">
        <h3>${esc(s.title)}</h3>
        <p class="est">Est. ${esc(durationText(s))}</p>
      </div>
      <div class="card__body">
        ${s.intensityLabel ? `<p class="intensity">${esc(s.intensityLabel)}</p>` : ""}
        ${s.objective ? `<p class="session-copy">${esc(s.objective)}</p>` : ""}
        ${body}
        ${core.length ? `<div class="core"><b>Core finisher</b>${core.map((ex, i) => `${i + 1}) ${esc(ex.name)} ${esc(ex.prescription || "")}`).join("  ")}</div>` : ""}
        ${extraCallouts}
        ${callout("Focus", s.coachNote, "focus")}
      </div>
    </article>`;
  }

  function weekDots(week = 1, total = 12) {
    return `<ol class="dots">${Array.from({ length: total }, (_, i) =>
      `<li class="${i + 1 === Number(week) ? "is-on" : ""}"></li>`
    ).join("")}</ol>`;
  }

  function weekPage(plan) {
    const gym = plan.sessions.filter((s) => s.type === "strength");
    const cond = plan.sessions.filter((s) => s.type === "run" || s.type === "hyrox" || s.type === "mobility");
    const gymGrid = gym.length >= 3 ? "cols-3" : gym.length === 2 ? "cols-2" : "cols-1";
    const condGrid = cond.length === 4 || cond.length === 2 ? "cols-2" : cond.length >= 3 ? "cols-3" : "cols-1";
    return `<section class="page page--week">
      <div class="page__bar"></div>
      <div class="page__in">
        <header class="week-head">
          <div>
            <h1>Week ${esc(plan.week || 1)} <em>${esc(weekLetter(plan))}</em></h1>
            <p>${esc(plan.subtitle || plan.intro || "")}</p>
          </div>
          <div class="week-head__side">
            <span class="pill">${esc(plan.blockLabel || "BUILD")}</span>
            ${weekDots(plan.week || 1)}
          </div>
        </header>
        <i class="week-rule"></i>
        ${plan.weekNote ? callout("This week", plan.weekNote) : ""}
        ${gym.length ? `<p class="sec-k">Strength / Gym</p><div class="grid ${gymGrid}">${gym.map((s, i) => gymCard(s, i, gym.length)).join("")}</div>` : ""}
        ${cond.length ? `<p class="sec-k">Running + HYROX</p><div class="grid ${condGrid}">${cond.map(condCard).join("")}</div>` : ""}
      </div>
      <footer class="page__foot">
        <span>${metaLine(plan, plan)}</span>
        <span class="pg"></span>
      </footer>
    </section>`;
  }

  function structureRows(plan) {
    const rows = plan.weeklyStructure || (plan.sessions || []).map((s) => [
      s.dayName,
      `${s.title}${s.type === "recovery" ? "" : ` — ${TYPE_LABEL[s.type] || s.type}`}`
    ]);
    return rows.map((row) => `
      <li>
        <span>${esc((row[0] || "").toUpperCase())}</span>
        <strong>${esc(row[1] || "")}</strong>
      </li>`).join("");
  }

  function coverPage(plan, state) {
    const chips = [
      chip("Strength"),
      chip("Running"),
      chip(plan.priority === "hyrox" ? "HYROX" : "Hybrid")
    ].join("");
    const target = plan.intro || "";
    const rule = (plan.weeklyGuidance || []).join(" ");
    return `<section class="page page--cover">
      <div class="page__bar"></div>
      <div class="page__in">
        <p class="kicker">${metaLine(plan, state)}</p>
        <i class="rule-line"></i>
        <h1 class="cover-title">${esc(plan.title)}</h1>
        <p class="cover-lead">${esc(plan.subtitle || "")}</p>
        <div class="chips">${chips}</div>
        <div class="pair">
          <article class="card">
            <h2>Your 12-week target</h2>
            <p>${esc(target)}</p>
          </article>
          <article class="card">
            <h2>The rule that matters</h2>
            <p>${esc(rule || "Keep easy sessions genuinely easy. Intensity only works when the easy work stays easy.")}</p>
          </article>
        </div>
        <article class="card card--structure">
          <h2>Your weekly structure</h2>
          <ol class="structure">${structureRows(plan)}</ol>
        </article>
      </div>
      <footer class="page__foot">
        <span>${metaLine(plan, state)}</span>
        <span class="pg"></span>
      </footer>
    </section>`;
  }

  function zoneTiles() {
    const zones = [
      ["Z1 Recovery", "Very easy"],
      ["Z2 Easy", "Full sentences"],
      ["Z3 Steady", "Short sentences"],
      ["Z4 Hard", "Controlled threshold"],
      ["Z5 Very hard", "Short work only"],
      ["Target 21.1 km pace", "Your 21.1 km goal pace"]
    ];
    return `<div class="zgrid">${zones.map(([n, d]) => `<div><strong>${n}</strong><span>${d}</span></div>`).join("")}</div>`;
  }

  function raceLoadCard() {
    const race = window.EGRaceLoads?.category("men_open");
    if (!race) return "";
    return `<article class="card">
      <h2>HYROX race load — Open Men</h2>
      <div class="load-grid">
        <div><span>Sled Push</span><strong>${race.sledPushKg} kg total incl. sled</strong></div>
        <div><span>Sled Pull</span><strong>${race.sledPullKg} kg total incl. sled</strong></div>
        <div><span>Farmers Carry</span><strong>2 × ${race.farmersKgEach} kg</strong></div>
        <div><span>Sandbag Lunges</span><strong>${race.sandbagKg} kg</strong></div>
        <div><span>Wall Balls</span><strong>${race.wallBallKg} kg</strong></div>
        <div><span>Ski / Row</span><strong>Damper 5–6 for most race-specific work</strong></div>
      </div>
      ${callout("Sled plates", "Plates to add = target total load − empty sled weight. Example: 137 kg target incl. sled − 30 kg sled = 107 kg plates.")}
    </article>`;
  }

  function guidePage(plan, state) {
    const zonesLine = window.EGZones?.summarize(state?.runningZones)?.line
      || "Use the Running Zones Calculator on the website before your first run. Train from your own Zone 1–5 values; do not copy another athlete’s pace.";
    const hasHyrox = plan.priority === "hyrox" || plan.sessions.some((s) => s.type === "hyrox");
    const race = window.EGRaceLoads?.category("men_open");
    const push = race?.sledPushKg || 152;
    const pull = race?.sledPullKg || 103;
    const refs = hasHyrox ? `<article class="card">
      <h2>Race-load references</h2>
      <div class="load-grid load-grid--pct">
        <div><span>80%</span><strong>Push ~${Math.round(push * 0.8)} kg incl. sled<br>Pull ~${Math.round(pull * 0.8)} kg incl. sled<br>Farmers ~2 × 20 kg<br>Lunges 16 kg</strong></div>
        <div><span>90%</span><strong>Push ~${Math.round(push * 0.9)} kg incl. sled<br>Pull ~${Math.round(pull * 0.9)} kg incl. sled<br>Farmers ~2 × 22 kg<br>Lunges 18 kg</strong></div>
        <div><span>100%</span><strong>Push ${push} kg incl. sled<br>Pull ${pull} kg incl. sled<br>Farmers 2 × 24 kg<br>Lunges 20 kg</strong></div>
        <div><span>105–110%</span><strong>Push ~${Math.round(push * 1.05)}–${Math.round(push * 1.1)} kg incl. sled<br>Pull ~${Math.round(pull * 1.05)}–${Math.round(pull * 1.1)} kg incl. sled</strong></div>
      </div>
      ${callout("Sled surface", "Sled surface matters: use total load as the reference, but adjust if your turf is unusually heavy or light so technique stays strong.")}
    </article>` : "";
    return `<section class="page page--guide">
      <div class="page__bar"></div>
      <div class="page__in">
        <header class="guide-head">
          <div>
            <p class="kicker">Before week 1</p>
            <h1>Set the plan up once.<br>Then train.</h1>
          </div>
          <p class="mark">Quick guide</p>
        </header>
        <div class="grid cols-2">
          <article class="card">
            <h2>Running zones</h2>
            <p>${esc(zonesLine)}</p>
            ${zoneTiles()}
            ${callout("Run warm-up", "8–10 min easy Zone 1–2 before every run. Example only: an athlete might have Zone 2 around 5:30–6:15/km, Zone 3 around 5:00–5:30/km, Zone 4 around 4:35–5:00/km and a target 21.1 km pace around 4:45/km. Your calculator values always take priority.")}
          </article>
          <article class="card">
            <h2>Gym notation</h2>
            <p><strong>3 × 8</strong> = 3 sets of 8 reps.</p>
            <p><strong>RIR</strong> — Repetitions In Reserve: how many clean reps you could still perform at the end of the set. 2 RIR = stop with about 2 good reps left.</p>
            <p><strong>1RM</strong> — One-Repetition Maximum: the heaviest load you can lift for one technically clean rep.</p>
            ${callout("%1RM", "%1RM is a starting estimate. RIR decides the real load. Example: Squat 1 × 6 | 2 RIR | ~80% 1RM. If your 1RM is 100 kg, start near 80 kg. If you finish 6 reps and could still do about 2 clean reps, the load is correct. If you have no reps left, reduce the weight.")}
            <p><strong>Top set:</strong> your heaviest work set for the day. <strong>Back-off sets:</strong> reduce the load slightly and complete the remaining sets at the prescribed RIR.</p>
            <p>For machines and isolation work, do not test a true 1RM. Use the percentage only as a reference and match the prescribed RIR.</p>
          </article>
          ${hasHyrox ? raceLoadCard() : ""}
          ${refs}
          <article class="card">
            <h2>Estimated training time</h2>
            <p>Every session shows a realistic time range. It includes a normal warm-up, planned rests and the main work.</p>
            <p>Example: 75–90 min means most athletes should complete the session inside that window. Extra equipment queues or long setup time are not included.</p>
          </article>
          <article class="card">
            <h2>Core work in the gym</h2>
            <p>Every gym day ends with a short core finisher using 1–2 movements. The four exercises rotate: V-Ups, Front Plank, Side Plank and Dumbbell Side Bend.</p>
            <p>Keep core reps controlled. The goal is trunk strength and stability, not turning the finisher into another conditioning workout.</p>
          </article>
        </div>
      </div>
      <footer class="page__foot">
        <span>How to use the plan</span>
        <span class="pg"></span>
      </footer>
    </section>`;
  }

  function sharedCss() {
    return `
    @page { size: 132mm 235mm; margin: 0; }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    html, body { margin: 0; padding: 0; background: ${C.page}; }
    body {
      color: ${C.charcoal};
      font-family: "Inter Tight", system-ui, sans-serif;
    }
    .pdf { width: 132mm; margin: 0 auto; counter-reset: pg; }
    .page {
      width: 132mm;
      height: 235mm;
      min-height: 235mm;
      max-height: 235mm;
      overflow: hidden;
      background: ${C.page};
      display: flex;
      flex-direction: column;
      page-break-after: always;
      break-after: page;
      position: relative;
    }
    .page:last-child { page-break-after: auto; break-after: auto; }
    .page__bar { height: 2.8mm; background: ${C.accent}; }
    .page__in { padding: 3.2mm 5.5mm 1.6mm; flex: 1; min-height: 0; }
    .page--week .page__in { padding: 2.4mm 5mm 1mm; zoom: 0.90; }
    .page__foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: .8mm 5.2mm 1.5mm;
      font-size: 5.2pt;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: ${C.muted};
    }
    .page { counter-increment: pg; }
    .pg::after { content: counter(pg, decimal-leading-zero); }
    .kicker {
      font-size: 6.4pt;
      font-weight: 600;
      letter-spacing: .2em;
      text-transform: uppercase;
      color: ${C.accent};
    }
    .rule-line {
      display: block;
      width: 18mm;
      height: 1.1mm;
      background: ${C.accent};
      margin: 2.4mm 0 3.2mm;
    }
    .cover-title {
      font-size: 22pt;
      font-weight: 700;
      line-height: .92;
      letter-spacing: -.02em;
      color: ${C.ink};
      text-transform: uppercase;
      margin: 0 0 3mm;
    }
    .cover-lead {
      font-size: 8.4pt;
      line-height: 1.35;
      max-width: 92mm;
      margin: 0 0 3.4mm;
    }
    .chips { display: flex; flex-wrap: wrap; gap: 1.6mm; margin: 0 0 4.2mm; }
    .chip {
      font-size: 6pt;
      font-weight: 700;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: ${C.ink};
      background: ${C.sand};
      border: none;
      border-radius: 999px;
      padding: 1.1mm 2.6mm;
    }
    .card {
      background: ${C.paper};
      border: .2mm solid ${C.line};
      border-radius: 3.2mm;
      padding: 2.6mm 2.8mm 2.4mm;
    }
    .card h2 {
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: ${C.ink};
      margin: 0 0 1.6mm;
    }
    .card p { font-size: 6.8pt; line-height: 1.28; margin: 0 0 1.1mm; }
    .page--cover .card p { font-size: 7.4pt; line-height: 1.35; margin: 0 0 1.4mm; }
    .card p:last-child { margin-bottom: 0; }
    .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 2.4mm; margin: 0 0 2.8mm; }
    .card--structure { padding: 2.8mm 3mm; background: ${C.mist}; }
    .structure { list-style: none; margin: 0; padding: 0; }
    .structure li {
      display: grid;
      grid-template-columns: 22mm 1fr;
      gap: 2mm;
      padding: 1.7mm 0;
      border-top: .2mm solid ${C.line};
      align-items: baseline;
    }
    .structure li:first-child { border-top: 0; padding-top: .4mm; }
    .structure span {
      font-size: 6pt;
      font-weight: 600;
      letter-spacing: .12em;
      color: ${C.muted};
    }
    .structure strong { font-size: 7.6pt; font-weight: 600; color: ${C.ink}; }
    .guide-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 4mm;
      margin: 0 0 3.4mm;
    }
    .guide-head h1 {
      font-size: 16pt;
      font-weight: 700;
      line-height: 1;
      color: ${C.ink};
      margin: 1.2mm 0 0;
    }
    .mark {
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: .2em;
      text-transform: uppercase;
      color: ${C.accent};
      padding-top: 1mm;
    }
    .grid { display: grid; gap: 1mm; margin: 0 0 1.1mm; align-items: start; }
    .card--gym, .card--cond { break-inside: auto; page-break-inside: auto; }
    .cols-2 { grid-template-columns: 1fr 1fr; }
    .cols-3 { grid-template-columns: 1fr 1fr 1fr; gap: 1.5mm; }
    .cols-1 { grid-template-columns: 1fr; }
    .page--guide .grid { gap: 2.2mm; margin: 0; }
    .page--guide .card { padding: 2.8mm 3mm 2.6mm; }
    .page--guide .card h2 { margin: 0 0 1.8mm; }
    .page--guide .card p { font-size: 6.6pt; line-height: 1.32; margin: 0 0 1.3mm; }
    .page--guide .callout { font-size: 5.7pt; margin-top: 1.5mm; }
    .page--guide .callout div { padding: 1.4mm 2mm 1.45mm 2mm; }
    .page--guide .zgrid { gap: 1.3mm; margin: 1.5mm 0 1.6mm; }
    .page--guide .zgrid div { padding: 1.3mm 1.6mm; }
    .page--guide .load-grid { gap: 1.5mm 2.2mm; margin: 0 0 1.5mm; }
    .page--week .cols-2 .session-copy { font-size: 5.6pt !important; line-height: 1.22; }
    .page--week .cols-2 .callout { font-size: 5pt; }
    .page--week .cols-2 .callout div { padding: 1.05mm 1.6mm 1.1mm 1.6mm; }
    .page--week .cols-2 .card { padding: 0; --gutter: 2.2mm; }
    .page--week .cols-3 .card { padding: 0; --gutter: 1.5mm; }
    .page--week .cols-3 .card h3 { font-size: 6.6pt; }
    .page--week .cols-3 .ex strong { font-size: 6.3pt; }
    .page--week .cols-3 .ex p { font-size: 5.4pt; line-height: 1.26; }
    .page--week .cols-3 .core { padding: .8mm 1.2mm; font-size: 5.2pt; }
    .page--week .cols-3 .est { font-size: 5.2pt; }
    .page--week .cols-3 .mini-tag { font-size: 4.5pt; padding: .4mm 1.3mm; }
    .page--week .cols-3 .callout { font-size: 5.3pt; }
    .zgrid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1mm;
      margin: 1.1mm 0 1.3mm;
    }
    .zgrid div {
      background: ${C.mist};
      border-radius: 1.4mm;
      padding: 1mm 1.3mm;
    }
    .zgrid strong { display: block; font-size: 6.2pt; color: ${C.ink}; }
    .zgrid span { display: block; font-size: 5.8pt; color: ${C.muted}; margin-top: .2mm; }
    .load-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2mm 1.8mm; margin: 0 0 1.2mm; }
    .load-grid span { display: block; font-size: 5.8pt; color: ${C.muted}; }
    .load-grid strong { display: block; font-size: 6.4pt; color: ${C.ink}; margin-top: .15mm; line-height: 1.25; }
    .callout {
      display: grid;
      grid-template-columns: 1.3mm minmax(0, 1fr);
      background: ${C.sand};
      border-radius: 1.3mm;
      overflow: hidden;
      font-size: 5.5pt;
      line-height: 1.32;
      color: ${C.charcoal};
      margin-top: .85mm;
    }
    .callout i {
      display: block;
      background: ${C.deep};
    }
    .callout div {
      padding: 1.15mm 1.8mm 1.2mm 1.8mm;
      min-width: 0;
    }
    .callout b {
      display: block;
      font-size: 5.3pt;
      letter-spacing: .12em;
      text-transform: uppercase;
      margin: 0 0 .35mm;
      color: ${C.ink};
      background: none;
      border-radius: 0;
      padding: 0;
      font-weight: 700;
    }
    .week-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 3mm;
      margin: 0;
    }
    .week-rule {
      display: block;
      height: .25mm;
      background: ${C.line};
      margin: .9mm 0 1mm;
    }
    .week-head h1 {
      font-size: 12pt;
      font-weight: 700;
      color: ${C.ink};
      letter-spacing: -.02em;
      margin: 0;
      text-transform: uppercase;
    }
    .week-head em { font-style: normal; font-weight: 500; color: ${C.muted}; font-size: 8.5pt; }
    .week-head p { font-size: 6pt; color: ${C.muted}; margin: .4mm 0 0; max-width: 78mm; }
    .week-head__side { text-align: right; }
    .pill {
      display: inline-block;
      font-size: 5.8pt;
      font-weight: 700;
      letter-spacing: .14em;
      text-transform: uppercase;
      background: ${C.sand};
      color: ${C.ink};
      border-radius: 999px;
      padding: 1mm 2.2mm;
    }
    .dots { list-style: none; display: flex; gap: .9mm; justify-content: flex-end; margin: 1mm 0 0; padding: 0; }
    .dots li { width: 1.5mm; height: 1.5mm; border-radius: 50%; background: ${C.sand}; }
    .dots li.is-on { background: ${C.deep}; }
    .sec-k {
      display: flex;
      align-items: center;
      gap: 2mm;
      font-size: 5.8pt;
      font-weight: 700;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: ${C.muted};
      margin: 0 0 .9mm;
    }
    .sec-k::after {
      content: "";
      flex: 1;
      height: .3mm;
      background: ${C.accent};
    }
    .card--gym, .card--cond {
      --gutter: 1.8mm;
      padding: 0;
      background: ${C.paper};
      overflow: hidden;
      border: .2mm solid ${C.line};
    }
    .card__bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.6mm;
      background: ${C.mist};
      padding: 1.5mm var(--gutter) .25mm;
      margin: 0;
    }
    .card__meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2mm;
      background: ${C.mist};
      padding: 0 var(--gutter) 1.3mm;
    }
    .card__meta h3 {
      padding: 0;
      margin: 0;
      flex: 1;
      min-width: 0;
      line-height: 1.15;
    }
    .card__meta .est {
      padding: 0;
      margin: 0 !important;
      white-space: nowrap;
      line-height: 1.15;
      flex: 0 0 auto;
    }
    .card__body {
      padding: 1.3mm var(--gutter) 1.7mm;
    }
    .card--gym h3, .card--cond h3 { padding: 0; margin: 0; }
    .card--gym.is-split .ex-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 2.2mm;
    }
    .card--cond h3 { text-transform: uppercase; }
    .day {
      font-size: 6.1pt;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: ${C.ink};
      margin: 0;
    }
    .card h3 {
      font-size: 7.4pt;
      font-weight: 700;
      color: ${C.ink};
      line-height: 1.15;
      margin: 0;
    }
    .tag {
      font-size: 5.2pt;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
      border-radius: 999px;
      padding: .7mm 1.5mm;
      white-space: nowrap;
    }
    .tag--gym, .tag--strength, .tag--run, .tag--hyrox, .tag--mobility {
      background: ${C.sand};
      color: ${C.ink};
    }
    .est {
      font-size: 5.6pt;
      font-weight: 600;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: ${C.muted};
      margin: 0 !important;
    }
    .intensity {
      font-size: 5.3pt;
      font-weight: 700;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: ${C.muted};
      margin: 0 0 .55mm !important;
      line-height: 1.25;
    }
    .ex-list {
      display: block;
      background: ${C.paper};
      overflow: visible;
      margin: 0;
    }
    .ex {
      position: relative;
      background: transparent;
      border-radius: 0;
      padding: 1mm 0 1.05mm 2mm;
      border-bottom: .15mm solid ${C.line};
    }
    .ex:last-child { border-bottom: 0; }
    .ex::before {
      content: "";
      position: absolute;
      left: 0;
      top: 1.15mm;
      bottom: 1.15mm;
      width: .7mm;
      background: ${C.accent};
      border-radius: .4mm;
    }
    .ex__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 2.8mm;
      min-height: 3.6mm;
    }
    .ex__top strong {
      flex: 1 1 auto;
      min-width: 0;
      padding-right: 3.2mm;
      font-size: 6.6pt;
      color: ${C.ink};
      line-height: 1.2;
    }
    .ex p { font-size: 5.6pt; color: ${C.charcoal}; margin: .35mm 0 0 !important; line-height: 1.3; hyphens: none; }
    .ex small { display: block; font-size: 5.5pt; color: ${C.muted}; margin-top: .2mm; }
    .mini-tag {
      flex: 0 0 auto;
      align-self: center;
      white-space: nowrap;
      font-size: 4.5pt;
      font-weight: 700;
      letter-spacing: .1em;
      text-transform: uppercase;
      background: ${C.deep};
      color: ${C.paper};
      border-radius: 999px;
      padding: .4mm 1.35mm;
      margin-left: auto;
    }
    .core {
      background: ${C.sand};
      border-radius: 1.3mm;
      padding: .9mm 1.3mm;
      font-size: 5.4pt;
      line-height: 1.28;
      margin: .9mm 0 0;
      color: ${C.charcoal};
    }
    .core b {
      display: block;
      font-size: 5.2pt;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: ${C.ink};
      margin-bottom: .3mm;
    }
    .steps {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: .12mm;
    }
    .steps li {
      display: grid;
      grid-template-columns: 4.6mm minmax(0, 1fr);
      column-gap: 1.5mm;
      align-items: start;
      background: transparent;
      padding: .32mm 0;
      border-top: .15mm solid ${C.line};
    }
    .steps li:first-child { border-top: 0; }
    .steps .n {
      font-size: 5.5pt;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      line-height: 1.2;
      text-align: right;
      color: ${C.accent};
    }
    .steps li > div { min-width: 0; }
    .steps strong { display: block; font-size: 5.7pt; color: ${C.ink}; line-height: 1.2; }
    .steps li > div span { display: block; font-size: 5.4pt; color: ${C.charcoal}; margin-top: .1mm; }
    .steps small { display: block; font-size: 5.2pt; color: ${C.muted}; margin-top: .1mm; }
    .session-copy { font-size: 6pt !important; line-height: 1.25; margin: 0 0 .55mm !important; }
    .caution {
      font-size: 5.3pt;
      background: ${C.sand};
      border-radius: 1.2mm;
      padding: .9mm 1.3mm;
      margin: 0 0 1mm;
      line-height: 1.2;
    }
    .zrow {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 3mm;
      padding: 2.4mm 0;
      border-bottom: .2mm solid ${C.line};
    }
    .zrow:last-child { border-bottom: 0; }
    .zrow.is-focus { box-shadow: inset 1.2mm 0 0 ${C.accent}; padding-left: 2.4mm; }
    .zrow strong { display: block; font-size: 9pt; color: ${C.ink}; }
    .zrow small { display: block; font-size: 6.6pt; color: ${C.muted}; margin-top: .4mm; }
    .zrow em { font-style: normal; font-size: 9pt; font-weight: 600; text-align: right; color: ${C.ink}; }
    @media print {
      html, body { width: 100%; background: ${C.page}; }
      .pdf { width: 100%; box-shadow: none !important; }
    }
    @media screen {
      html, body { background: ${C.deep}; }
      .pdf { box-shadow: 0 18px 50px rgba(31, 26, 20, .28); margin: 16px auto; }
    }`;
  }

  function shell(title, body) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${esc(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>${sharedCss()}</style>
</head>
<body>
  <div class="pdf">${body}</div>
</body>
</html>`;
  }

  function build(plan, state = {}) {
    const weeks = plan.weeks && plan.weeks.length ? plan.weeks : [plan];
    const coverSource = { ...weeks[0], ...plan };
    const caution = state.hasConstraints
      ? `<p class="caution">You flagged a limitation. Conservative swaps only. This is not rehab or medical advice.</p>`
      : "";
    const filename = `EverydayGass-${coverSource.id || "plan"}`;
    const cover = coverPage(coverSource, { ...coverSource, ...state }).replace(
      '<div class="chips">',
      caution ? `${caution}<div class="chips">` : '<div class="chips">'
    );
    return shell(filename, `${cover}${guidePage(coverSource, { ...coverSource, ...state })}${weeks.map(weekPage).join("")}`);
  }

  function fillWindow(win, html, title) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.document.title = title;
    const go = () => {
      win.focus();
      win.print();
    };
    const fonts = win.document.fonts;
    if (fonts?.ready) fonts.ready.then(() => setTimeout(go, 60));
    else setTimeout(go, 450);
  }

  function printDoc(html, title) {
    const popup = window.open("", "_blank");
    if (popup) {
      fillWindow(popup, html, title);
      return;
    }
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText = "position:fixed;width:0;height:0;border:0;right:0;bottom:0";
    document.body.appendChild(iframe);
    fillWindow(iframe.contentWindow, html, title);
    setTimeout(() => iframe.remove(), 60000);
  }

  function download(plan, state = {}) {
    let doc = plan;
    if (!plan.weeks && window.EGEngine?.buildPlanDocument) {
      doc = EGEngine.buildPlanDocument({ ...state, ...plan, priority: plan.priority || state.priority, daysPerWeek: plan.daysPerWeek || state.daysPerWeek, level: plan.level || state.level });
    }
    printDoc(build(doc, { ...doc, ...state }), `EverydayGass-${doc.id || plan.id}`);
  }

  function buildZones(saved) {
    const result = window.EGZones?.compute(saved);
    if (!result) return "";
    const filename = "EverydayGass-running-zones";
    const chipsHtml = result.method === "hr"
      ? `${chip("Max heart rate")}${chip(`${result.maxHr} bpm`)}${chip("Polar %HRmax")}`
      : `${chip("5K")}${chip(window.EGZones.formatClock(result.fiveKSec))}${chip("Jack Daniels VDOT")}`;
    const rows = result.bands.map((z) => {
      const extra = z.displayMi ? `<small>${esc(z.displayMi)}</small>` : "";
      return `<div class="zrow${z.focus ? " is-focus" : ""}">
        <div>
          <strong>${esc(z.name)}</strong>
          <small>${esc(z.rpe)}</small>
        </div>
        <em>${esc(z.display)}${extra}</em>
      </div>`;
    }).join("");
    const body = `<section class="page">
      <div class="page__bar"></div>
      <div class="page__in">
        <p class="kicker">EverydayGass  /  Running zones</p>
        <i class="rule-line"></i>
        <h1 class="cover-title">Your running zones</h1>
        <div class="chips">${chipsHtml}</div>
        <p class="cover-lead">${esc(result.label)}</p>
        <article class="card">
          <p>${result.method === "hr"
            ? "Polar five-zone model: 50–60 / 60–70 / 70–80 / 80–90 / 90–100% of max heart rate."
            : "Jack Daniels VDOT paces from your 5K. Easy is 59–74% VDOT. 5K race pace sits near Z4–Z5."}</p>
          ${rows}
        </article>
        ${callout("Guidance", "Easy running should live in Z2. Use the talk test if you have no watch. Recalibrate after a hard race.")}
      </div>
      <footer class="page__foot">
        <span>Estimates from Polar %HRmax and Jack Daniels VDOT. Not a lab test or medical advice.</span>
        <span>everydaygass.com</span>
      </footer>
    </section>`;
    return shell(filename, body);
  }

  function downloadZones(saved) {
    const html = buildZones(saved);
    if (!html) return;
    printDoc(html, "EverydayGass-running-zones");
  }

  return { build, download, buildZones, downloadZones };
})();
