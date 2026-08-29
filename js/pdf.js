/* EverydayGass — branded compact week PDF (print sheet). */
window.EGPdf = (() => {
  const TYPE_LABEL = {
    run: "Run",
    strength: "Lift",
    hyrox: "HYROX",
    mobility: "Mobility",
    recovery: "Rest"
  };
  const TYPE_COLOR = {
    run: "#000000",
    strength: "#38383B",
    hyrox: "#A8A3A1",
    mobility: "#6A6A6A",
    recovery: "#DFE0E1"
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
  const ACCESS_LABEL = {
    full_gym: "Full gym",
    basic_gym: "Basic gym",
    home_run: "Home + run",
    mixed: "Mixed"
  };

  const esc = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const dayNo = (n) => String(n).padStart(2, "0");

  function chip(text) {
    return text ? `<span class="pdf-chip">${esc(text)}</span>` : "";
  }

  function inlineList(list) {
    return (list || []).map((ex) => {
      const rest = ex.rest ? ` · rest ${ex.rest}` : "";
      return `${ex.name} ${ex.prescription}${rest}`;
    }).join("  ·  ");
  }

  function mainRows(list) {
    return (list || []).map((ex) => {
      const rest = ex.rest ? ` · rest ${esc(ex.rest)}` : "";
      const notes = ex.notes ? `<small>${esc(ex.notes)}</small>` : "";
      return `<div class="pdf-ex">
        <div><strong>${esc(ex.name)}</strong>${notes}</div>
        <em>${esc(ex.prescription)}${rest}</em>
      </div>`;
    }).join("");
  }

  function tagStyle(type) {
    const bg = TYPE_COLOR[type] || "#000000";
    const fg = type === "recovery" || type === "hyrox" ? "#000" : "#fff";
    return `background:${bg};color:${fg}`;
  }

  function sessionCard(s) {
    const wu = s.warmup?.length
      ? `<p class="pdf-line"><span>Warm-up</span>${esc(inlineList(s.warmup))}</p>`
      : "";
    const cd = s.cooldown?.length
      ? `<p class="pdf-line"><span>Cool-down</span>${esc(inlineList(s.cooldown))}</p>`
      : "";
    return `<article class="pdf-card">
      <header class="pdf-card__head">
        <div>
          <p class="pdf-card__day">Day ${dayNo(s.day)}</p>
          <h2>${esc(s.title)}</h2>
        </div>
        <span class="pdf-tag" style="${tagStyle(s.type)}">${esc(TYPE_LABEL[s.type] || s.type)}</span>
      </header>
      <p class="pdf-card__meta">${s.durationMin ? `${s.durationMin} min` : ""}${s.intensity ? ` · ${esc(s.intensity)}` : ""}</p>
      ${s.coachNote ? `<p class="pdf-card__note">${esc(s.coachNote)}</p>` : ""}
      ${wu}
      <p class="pdf-k">Main</p>
      ${mainRows(s.main)}
      ${cd}
    </article>`;
  }

  function restTile(s) {
    const detail = inlineList(s.main) || s.coachNote || "";
    return `<article class="pdf-rest">
      <b>${dayNo(s.day)}</b>
      <div>
        <strong>${esc(s.title)}</strong>
        <span>${esc(detail)}</span>
      </div>
    </article>`;
  }

  function weekStrip(plan) {
    return `<ol class="pdf-strip">${plan.sessions.map((s) => `
      <li>
        <i style="background:${TYPE_COLOR[s.type] || "#000"}"></i>
        <b>${dayNo(s.day)}</b>
        <span>${esc(TYPE_LABEL[s.type] || s.type)}</span>
      </li>`).join("")}</ol>`;
  }

  function zonesRow(state) {
    const z = state?.runningZones;
    if (!z?.maxHr) return "";
    const z2lo = Math.round(z.maxHr * 0.6);
    const z2hi = Math.round(z.maxHr * 0.7);
    const src = z.source === "tested" ? `Max HR ${z.maxHr}` : `Age estimate · max HR ≈ ${z.maxHr}`;
    return `<p class="pdf-zones"><span>Zones</span> ${esc(src)} · Z2 easy ${z2lo}–${z2hi} bpm</p>`;
  }

  function chips(plan, state) {
    const priority = PRIORITY_LABEL[state.priority] || PRIORITY_LABEL[plan.priority] || plan.priority;
    return [
      chip(`${plan.daysPerWeek} days`),
      chip(priority),
      chip(LEVEL_LABEL[state.level]),
      chip(ACCESS_LABEL[state.trainingAccess])
    ].join("");
  }

  function splitColumns(sessions) {
    const left = [];
    const right = [];
    sessions.forEach((s, i) => (i % 2 === 0 ? left : right).push(s));
    return [left, right];
  }

  function build(plan, state = {}) {
    const work = plan.sessions.filter((s) => s.type !== "recovery");
    const rest = plan.sessions.filter((s) => s.type === "recovery");
    const [left, right] = splitColumns(work);
    const caution = state.hasConstraints
      ? `<p class="pdf-caution">You flagged a constraint. This generic week is not individualized medical advice. Get professional clearance where appropriate.</p>`
      : "";
    const restRow = rest.length
      ? `<div class="pdf-rests">${rest.map(restTile).join("")}</div>`
      : "";
    const guidance = (plan.weeklyGuidance || []).map((g) => esc(g)).join(" · ");
    const filename = `EverydayGass-${plan.id}`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${esc(filename)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4; margin: 0; }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    html, body { margin: 0; padding: 0; background: #DFE0E1; }
    body {
      background-image: linear-gradient(#DFE0E1, #DFE0E1);
      color: #000;
      font-family: "Inter Tight", system-ui, sans-serif;
    }
    .pdf {
      width: 210mm;
      min-height: 280mm;
      margin: 0 auto;
      background: #DFE0E1;
      background-image: linear-gradient(#DFE0E1, #DFE0E1);
      display: flex;
      flex-direction: column;
    }
    .pdf-top {
      background: #000;
      background-image: linear-gradient(#000, #000);
      box-shadow: inset 0 0 0 1000px #000;
      color: #fff;
      padding: 5mm 8mm 4.5mm;
    }
    .pdf-brand {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }
    .pdf-logo {
      font-family: Anton, Impact, sans-serif;
      font-size: 13pt;
      font-weight: 400;
      letter-spacing: .06em;
      text-transform: uppercase;
      line-height: 1;
    }
    .pdf-logo span { color: #A8A3A1; }
    .pdf-mark {
      font-size: 6.2pt;
      font-weight: 600;
      letter-spacing: .22em;
      text-transform: uppercase;
      color: #A8A3A1;
    }
    .pdf-title {
      font-family: Anton, Impact, sans-serif;
      font-size: 16pt;
      font-weight: 400;
      letter-spacing: .02em;
      text-transform: uppercase;
      line-height: .92;
      margin: 2.8mm 0 2mm;
      color: #fff;
    }
    .pdf-chips { display: flex; flex-wrap: wrap; gap: 1.4mm; }
    .pdf-chip {
      font-size: 6.1pt;
      font-weight: 600;
      letter-spacing: .14em;
      text-transform: uppercase;
      color: #DFE0E1;
      border: .3mm solid rgba(255,255,255,.28);
      padding: .7mm 2.1mm;
    }
    .pdf-intro {
      margin: 2.4mm 0 0;
      font-size: 7.6pt;
      line-height: 1.32;
      color: #C9C4BB;
    }
    .pdf-body { padding: 3mm 8mm 2.5mm; flex: 1; }
    .pdf-strip {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      background: rgba(0,0,0,.12);
      border: 1px solid rgba(0,0,0,.12);
      margin: 0 0 2.2mm;
    }
    .pdf-strip li {
      background: #fff;
      text-align: center;
      padding: 0 0 1.7mm;
    }
    .pdf-strip i { display: block; height: 2.5px; }
    .pdf-strip b {
      display: block;
      font-family: Anton, Impact, sans-serif;
      font-size: 9pt;
      letter-spacing: .06em;
      margin-top: 1.3mm;
    }
    .pdf-strip span {
      display: block;
      font-size: 5.6pt;
      font-weight: 600;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: #6A6A6A;
      margin-top: .2mm;
    }
    .pdf-zones, .pdf-caution {
      font-size: 7pt;
      margin: 0 0 2.6mm;
      padding: 1.6mm 2.2mm;
      background: #fff;
      border: 1px solid rgba(0,0,0,.12);
    }
    .pdf-zones span {
      font-weight: 700;
      letter-spacing: .14em;
      text-transform: uppercase;
      font-size: 6pt;
      margin-right: 2mm;
      color: #6A6A6A;
    }
    .pdf-rests {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(42mm, 1fr));
      gap: 1px;
      background: rgba(0,0,0,.12);
      border: 1px solid rgba(0,0,0,.12);
      margin: 0 0 2.4mm;
    }
    .pdf-rest {
      background: #fff;
      display: flex;
      gap: 2.2mm;
      align-items: baseline;
      padding: 2mm 2.4mm;
    }
    .pdf-rest b {
      font-family: Anton, Impact, sans-serif;
      font-size: 11pt;
      letter-spacing: .04em;
    }
    .pdf-rest strong {
      display: block;
      font-size: 7.4pt;
      font-weight: 600;
    }
    .pdf-rest span {
      display: block;
      font-size: 6.4pt;
      color: #6A6A6A;
      margin-top: .3mm;
    }
    .pdf-cols {
      display: flex;
      align-items: flex-start;
      gap: 3mm;
    }
    .pdf-cols > div { flex: 1; min-width: 0; }
    .pdf-card {
      break-inside: avoid;
      page-break-inside: avoid;
      background: #fff;
      border: 1px solid rgba(0,0,0,.12);
      padding: 2.4mm 2.8mm 2.2mm;
      margin: 0 0 2.2mm;
    }
    .pdf-card:last-child { margin-bottom: 0; }
    .pdf-card__head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2mm;
    }
    .pdf-card__day {
      font-size: 5.8pt;
      font-weight: 600;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: #6A6A6A;
    }
    .pdf-card h2 {
      font-family: Anton, Impact, sans-serif;
      font-size: 11pt;
      font-weight: 400;
      letter-spacing: .03em;
      text-transform: uppercase;
      line-height: .95;
      margin: .6mm 0 0;
    }
    .pdf-tag {
      font-size: 5.5pt;
      font-weight: 600;
      letter-spacing: .12em;
      text-transform: uppercase;
      padding: .9mm 1.8mm;
      white-space: nowrap;
    }
    .pdf-card__meta {
      font-size: 7pt;
      color: #6A6A6A;
      margin: 1mm 0 0;
    }
    .pdf-card__note {
      font-size: 7pt;
      color: #38383B;
      margin: 1.1mm 0 0;
      line-height: 1.28;
    }
    .pdf-k {
      font-size: 5.7pt;
      font-weight: 700;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: #6A6A6A;
      margin: 1.8mm 0 .4mm;
      padding-top: 1.3mm;
      border-top: 1px solid rgba(0,0,0,.12);
    }
    .pdf-line {
      font-size: 7pt;
      color: #38383B;
      margin: 1.3mm 0 0;
      line-height: 1.28;
    }
    .pdf-line span {
      display: block;
      font-size: 5.7pt;
      font-weight: 700;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: #6A6A6A;
      margin-bottom: .3mm;
    }
    .pdf-ex {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 3mm;
      padding: .7mm 0;
      border-bottom: 1px solid rgba(0,0,0,.08);
    }
    .pdf-ex:last-child { border-bottom: 0; }
    .pdf-ex strong {
      font-size: 7.6pt;
      font-weight: 600;
      line-height: 1.2;
    }
    .pdf-ex small {
      display: block;
      font-size: 6.1pt;
      font-weight: 400;
      color: #6A6A6A;
      margin-top: .2mm;
    }
    .pdf-ex em {
      font-style: normal;
      font-size: 7pt;
      font-weight: 600;
      letter-spacing: .02em;
      white-space: nowrap;
      color: #38383B;
    }
    .pdf-end {
      background: #000;
      background-image: linear-gradient(#000, #000);
      box-shadow: inset 0 0 0 1000px #000;
      color: #fff;
      padding: 3.2mm 8mm 3.6mm;
      margin-top: auto;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .pdf-guide {
      font-size: 7.4pt;
      line-height: 1.35;
      color: #DFE0E1;
    }
    .pdf-guide span {
      font-size: 5.7pt;
      font-weight: 700;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: #A8A3A1;
      margin-right: 2.5mm;
    }
    .pdf-foot {
      display: flex;
      justify-content: space-between;
      gap: 6mm;
      margin-top: 2mm;
      padding-top: 2mm;
      border-top: 1px solid rgba(255,255,255,.16);
      font-size: 5.9pt;
      line-height: 1.35;
      color: #A8A3A1;
    }
    .pdf-foot b { color: #fff; font-weight: 600; }
    @media print {
      html, body { width: 100%; height: auto; margin: 0; background: #DFE0E1; }
      .pdf { width: 100%; margin: 0 !important; box-shadow: none !important; }
    }
    @media screen {
      html, body { background: #38383B; }
      .pdf { box-shadow: 0 18px 50px rgba(0,0,0,.35); margin: 16px auto; }
    }
  </style>
</head>
<body>
  <div class="pdf">
    <header class="pdf-top">
      <div class="pdf-brand">
        <p class="pdf-logo">Everyday<span>Gass</span></p>
        <p class="pdf-mark">Hybrid training week</p>
      </div>
      <h1 class="pdf-title">${esc(plan.title)}</h1>
      <div class="pdf-chips">${chips(plan, state)}</div>
      <p class="pdf-intro">${esc(plan.intro)}</p>
    </header>
    <div class="pdf-body">
      ${weekStrip(plan)}
      ${zonesRow(state)}
      ${caution}
      ${restRow}
      <div class="pdf-cols">
        <div>${left.map(sessionCard).join("")}</div>
        <div>${right.map(sessionCard).join("")}</div>
      </div>
    </div>
    <footer class="pdf-end">
      <p class="pdf-guide"><span>Guidance</span>${guidance}</p>
      <div class="pdf-foot">
        <span>${esc(plan.disclaimer)}</span>
        <span><b>everydaygass.com</b><br>1% better every day.</span>
      </div>
    </footer>
  </div>
</body>
</html>`;
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

  function download(plan, state = {}) {
    const html = build(plan, state);
    const title = `EverydayGass-${plan.id}`;
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

  return { build, download };
})();
