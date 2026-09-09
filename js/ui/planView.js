/* Mobile session cards — SUPER_FINAL layout, white / beige scale. */
(function (root) {
  const TYPE_LABEL = {
    run: "Run",
    strength: "Gym",
    hyrox: "HYROX",
    mobility: "Mobility",
    recovery: "Recovery"
  };
  const CORE_RE = /plank|v-up|dead bug|side bend|pallof|crunch|knee raise/i;

  function durationText(s) {
    const d = s.durationMin;
    if (!d) return "";
    if (typeof d === "number") return `${d} min`;
    if (d.min != null && d.max != null) return `${d.min}–${d.max} min`;
    return "";
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
    rx = rx.replace(/1RM\s+Rest\b/gi, "1RM | Rest");
    if (ex.rest && !/rest/i.test(rx)) rx += ` | Rest ${ex.rest}`;
    return rx.trim();
  }

  function itemLine(ex) {
    const notes = ex.notes ? `<span class="muted">${ex.notes}</span>` : "";
    const tag = ex.emphasis === "main_lift" ? `<span class="mini-tag">Strength</span>` : "";
    return `<div class="ex">
      <div>
        <div class="ex__top"><strong>${ex.name}</strong>${tag}</div>
        ${ex.prescription ? `<span class="muted">${doseLine(ex)}</span>` : ""}
        ${notes ? `<br>${notes}` : ""}
      </div>
      ${ex.videoUrl ? `<button type="button" class="btn-link" data-video="${ex.videoUrl}" data-name="${ex.name}">Watch</button>` : ""}
    </div>`;
  }

  function numbered(list = []) {
    return `<ol class="session-steps">${list.map((ex, i) => `
      <li>
        <span class="session-steps__n">${i + 1}</span>
        <div>
          <strong>${ex.name}</strong>
          ${ex.prescription ? `<p class="muted">${doseLine(ex)}</p>` : ""}
          ${ex.notes ? `<p class="muted">${ex.notes}</p>` : ""}
        </div>
      </li>`).join("")}</ol>`;
  }

  function callout(label, text) {
    if (!text) return "";
    return `<div class="callout"><i></i><div><b>${label}</b>${text}</div></div>`;
  }

  function coreBlock(core) {
    if (!core.length) return "";
    return `<div class="core"><b>Core finisher</b>${core.map((ex, i) => `${i + 1}) ${ex.name} ${ex.prescription || ""}`).join("  ")}</div>`;
  }

  function renderSession(s, i, { openFirst = true, locked = false } = {}) {
    const open = openFirst && i === 0 && !locked;
    const day = s.dayName || `Day ${s.day}`;
    const est = durationText(s);
    const meta = ["Est. " + est, s.intensityLabel || s.intensity].filter((part) => part && part !== "Est. ").join(" · ");
    const tag = TYPE_LABEL[s.type] || s.type;
    if (locked) {
      return `<article class="workout workout--locked">
        <div class="workout__head">
          <div>
            <p class="workout__day">${day}</p>
            <h3>${s.title}</h3>
          </div>
          <span class="tag tag--${s.type}">${tag}</span>
        </div>
        <p class="workout__meta">${s.duration || meta}</p>
        <div class="workout__lock">Exercise details, loads, zones and progression are unlocked in your 12-week plan.</div>
      </article>`;
    }
    const { work, core } = splitItems(s);
    const items = work.length ? work : (s.main || []);
    const isGym = s.type === "strength";
    const numberedList = !isGym && items.length > 1 && (s.type === "hyrox" || items.some((ex) => ex.kind === "hyrox_station" || ex.kind === "step"));
    const body = isGym
      ? `<div class="ex-list">${items.map(itemLine).join("")}</div>`
      : numberedList
        ? numbered(items)
        : items.length
          ? `<div class="ex-list">${items.map(itemLine).join("")}</div>`
          : "";
    return `<article class="workout workout--${s.type} ${open ? "" : "is-collapsed"}" data-i="${i}">
      <button type="button" class="workout__head" data-toggle>
        <div>
          <p class="workout__day">${day}</p>
          <h3>${s.title}</h3>
        </div>
        <span class="tag tag--${s.type}">${s.type === "strength" ? `Gym` : tag}</span>
      </button>
      <p class="workout__meta">${meta}</p>
      <div class="workout__body">
        ${s.objective ? `<p class="session-copy">${s.objective}</p>` : ""}
        ${(s.callouts || []).map((c) => `<div class="callout"><b>${c.label}</b>${c.text}</div>`).join("")}
        ${s.warmup?.length ? `<p class="ex-label">Warm-up</p><div class="ex-list">${s.warmup.map(itemLine).join("")}</div>` : ""}
        ${body}
        ${s.cooldown?.length ? `<p class="ex-label">Cool-down</p><div class="ex-list">${s.cooldown.map(itemLine).join("")}</div>` : ""}
        ${coreBlock(core)}
        ${callout("Focus", s.coachNote)}
      </div>
    </article>`;
  }

  function renderWeek(plan, mount, opts = {}) {
    if (!mount || !plan) return;
    mount.innerHTML = (plan.sessions || []).map((s, i) => renderSession(s, i, opts)).join("");
    mount.querySelectorAll("[data-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => btn.closest(".workout").classList.toggle("is-collapsed"));
    });
  }

  function weekOverview(plan) {
    return `<ol class="week-overview">${plan.sessions.map((s) => `
      <li>
        <span>${(s.dayName || `Day ${s.day}`).toUpperCase()}</span>
        <strong>${s.title}${s.type === "recovery" ? "" : ` — ${TYPE_LABEL[s.type] || s.type}`}</strong>
      </li>`).join("")}</ol>`;
  }

  function lockedCard(summary) {
    const lines = (summary.sessions || []).slice(0, 4).map((s) =>
      `<li>${(s.dayName || `Day ${s.day}`).slice(0, 3)}: ${s.title} • ${s.duration}</li>`
    ).join("");
    return `<article class="locked-week">
      <p class="locked-week__k">Week ${summary.week} — ${summary.blockLabel} block</p>
      <ul>${lines}</ul>
      <div class="locked-week__fade"><p>Exercise details, loads, zones and progression are unlocked in your 12-week plan.</p></div>
    </article>`;
  }

  const api = { TYPE_LABEL, durationText, renderSession, renderWeek, weekOverview, lockedCard };
  root.EGPlanView = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
