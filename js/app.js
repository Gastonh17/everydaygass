/* EverydayGass — free-week funnel. Plans: js/data/plans.js */
window.EG = (() => {
  const track = (name, props = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...props });
  };

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  const TYPE_LABEL = {
    run: "Run",
    strength: "Strength",
    hyrox: "HYROX",
    mobility: "Mobility",
    recovery: "Recovery"
  };

  function header(opts = {}) {
    const links = `
      <a href="free-week.html">Free Week</a>
      <a href="hybrid-plan.html">Full Plan</a>
      <a href="premium.html">Premium</a>`;
    return `
      <header class="topbar" id="topbar">
        <a class="logo" href="index.html">EverydayGass</a>
        ${opts.funnel ? "" : `
          <nav class="nav">${links}</nav>
          <button class="nav-toggle" type="button" aria-label="Open menu" data-nav-toggle>
            <span></span><span></span>
          </button>
        `}
      </header>
      ${opts.funnel ? "" : `<nav class="menu" id="menu" hidden>${links}</nav>`}`;
  }

  function footer() {
    return `
      <footer class="footer">
        <a class="logo" href="index.html">EverydayGass</a>
        <p>Hybrid training for people who want to become stronger, faster and more athletic.</p>
        <nav>
          <a href="index.html">Home</a>
          <a href="free-week.html">Free week</a>
          <a href="hybrid-plan.html">Full plan</a>
          <a href="coaching.html">Coaching</a>
          <a href="premium.html">Premium</a>
        </nav>
        <nav>
          <a href="privacy.html">Privacy</a>
          <a href="cookie.html">Cookies</a>
          <a href="terms.html">Terms</a>
        </nav>
        <p>© 2026 EverydayGass. Sports and lifestyle coaching — not medical, nutrition or physiotherapy care.</p>
      </footer>`;
  }

  function mountChrome(opts = {}) {
    const h = qs("[data-header]");
    const f = qs("[data-footer]");
    if (h) h.outerHTML = header(opts);
    if (f) f.outerHTML = footer();
    const bar = qs("#topbar");
    if (bar) window.addEventListener("scroll", () => bar.classList.toggle("is-scrolled", scrollY > 8), { passive: true });
    qsa("[data-faq] .item button").forEach((btn) => {
      btn.addEventListener("click", () => btn.parentElement.classList.toggle("is-open"));
    });
    const toggle = qs("[data-nav-toggle]");
    const menu = qs("#menu");
    if (toggle && menu) {
      menu.hidden = false;
      const setOpen = (open) => {
        menu.classList.toggle("is-open", open);
        document.body.classList.toggle("nav-open", open);
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        toggle.setAttribute("aria-expanded", String(open));
      };
      toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
      menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setOpen(false);
      });
    }
  }

  const QUESTIONS = () => (window.EGQuiz ? EGQuiz.questionsFor(EGStorage.read()) : []);

  function optionList(q, selected) {
    return `<div class="option-list">${q.options.map(([value, title, sub]) => `
      <button type="button" class="option ${selected === value ? "is-selected" : ""}" data-field="${q.field}" data-value="${value}">
        <strong>${title}</strong><span>${sub}</span>
      </button>`).join("")}</div>`;
  }

  function initHome() {
    mountChrome();
    const grid = qs("[data-priorities]");
    if (!grid) return;
    const items = (window.EGQuiz?.PRIORITY) || QUESTIONS()[0]?.options || [];
    grid.innerHTML = items.map(([id, title, sub]) => `
      <a class="goal-card" href="free-week.html?priority=${id}">
        <span class="goal-card__mark">${title.slice(0, 2).toUpperCase()}</span>
        <span><strong>${title}</strong><span>${sub}</span></span>
      </a>`).join("");
  }

  function initFreeWeek() {
    mountChrome({ funnel: true });
    const params = new URLSearchParams(location.search);
    const state = EGStorage.read();
    if (params.get("priority") && EGPlanId.PRIORITIES.includes(params.get("priority"))) {
      state.priority = params.get("priority");
      EGStorage.write(state);
    }
    track("quiz_start", { source: params.get("src") || "site" });
    track("free_week_started", { source: params.get("src") || "site" });

    const root = qs("#quiz");
    const bar = qs("#progressBar");
    const stepLabel = qs("#stepLabel");
    const back = qs("#backBtn");
    const next = qs("#nextBtn");
    let step = state.priority && params.get("priority") ? 1 : 0;
    let lead = false;

    function list() {
      return QUESTIONS();
    }

    function paintLead() {
      bar.style.width = "100%";
      stepLabel.textContent = "Email";
      back.disabled = false;
      next.hidden = false;
      next.textContent = "Open my week";
      root.innerHTML = `
        <p class="eyebrow">Your week is ready</p>
        <h1>Your personalized starter week is ready.</h1>
        <p class="lead">Enter your email to open it and keep a copy.</p>
        <div class="field"><label for="leadName">First name</label>
          <input id="leadName" name="firstName" autocomplete="given-name" value="${state.firstName || ""}" /></div>
        <div class="field"><label for="leadEmail">Email</label>
          <input id="leadEmail" name="email" type="email" autocomplete="email" inputmode="email" value="${state.email || ""}" /></div>
        <p class="muted" data-lead-err hidden>Add a first name and a valid email.</p>`;
      track("lead_capture_view");
    }

    function paint() {
      if (lead) return paintLead();
      const questions = list();
      const q = questions[step];
      const total = questions.length;
      bar.style.width = `${((step + 1) / total) * 100}%`;
      stepLabel.textContent = `${step + 1} / ${total}`;
      back.disabled = step === 0;
      next.hidden = !q.confirm;
      next.textContent = "Continue";
      let selected = state[q.field];
      if (q.field === "hasConstraints") selected = selected === true ? "yes" : selected === false ? "no" : "";
      else selected = selected == null ? "" : String(selected);
      const chips = q.chips && state.hasConstraints === true
        ? `<p class="quiz-hint">Optional — tap what you need to avoid. This is not a rehab plan.</p>
           <div class="chip-select">${q.chips.map(([value, label]) => `
             <button type="button" class="chip-opt ${(state.constraintTags || []).includes(value) ? "is-on" : ""}" data-chip="${value}">${label}</button>`).join("")}</div>
           <div class="field"><label for="constraintText">Anything else (optional, 160 characters)</label>
             <textarea id="constraintText" maxlength="160">${state.constraintText || ""}</textarea></div>`
        : "";
      root.innerHTML = `${q.hint ? `<p class="quiz-hint">${q.hint}</p>` : ""}<h1>${q.title}</h1>${optionList(q, selected)}${chips}`;
      qsa("[data-field]", root).forEach((btn) => {
        btn.addEventListener("click", () => {
          const field = btn.dataset.field;
          let value = btn.dataset.value;
          if (field === "daysPerWeek") value = Number(value);
          if (field === "hasConstraints") value = value === "yes";
          state[field] = value;
          if (field === "hasConstraints" && value !== true) {
            state.constraintTags = [];
            state.constraintText = "";
          }
          EGStorage.patch(state);
          track("quiz_answer", { questionId: q.id, answerKey: String(btn.dataset.value), step: step + 1, priority: state.priority });
          qsa(".option", root).forEach((b) => b.classList.toggle("is-selected", b === btn));
          if (q.confirm && value === true) {
            paint();
            return;
          }
          if (!q.confirm) setTimeout(() => go(1), 160);
        });
      });
      qsa("[data-chip]", root).forEach((btn) => {
        btn.addEventListener("click", () => {
          const tags = new Set(state.constraintTags || []);
          if (tags.has(btn.dataset.chip)) tags.delete(btn.dataset.chip);
          else tags.add(btn.dataset.chip);
          state.constraintTags = [...tags];
          EGStorage.patch(state);
          paint();
        });
      });
      qs("#constraintText")?.addEventListener("input", (e) => {
        state.constraintText = String(e.target.value).slice(0, 160);
        EGStorage.patch(state);
      });
    }

    function go(delta) {
      const questions = list();
      if (lead && delta < 0) {
        lead = false;
        step = questions.length - 1;
        paint();
        return;
      }
      const nextStep = step + delta;
      if (nextStep < 0) return;
      if (nextStep >= questions.length) {
        lead = true;
        paint();
        return;
      }
      step = nextStep;
      paint();
    }

    function validEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
    }

    function finish() {
      const planId = EGPlanId.getPlanId(state.priority, state.daysPerWeek);
      if (!planId) {
        lead = false;
        step = state.priority ? 1 : 0;
        paint();
        return;
      }
      if (lead) {
        const name = qs("#leadName")?.value.trim() || "";
        const email = qs("#leadEmail")?.value.trim() || "";
        const err = qs("[data-lead-err]");
        if (!name || !validEmail(email)) {
          if (err) err.hidden = false;
          return;
        }
        state.firstName = name;
        state.email = email;
        state.leadCapturedAt = Date.now();
        track("lead_submitted", { priority: state.priority });
      }
      EGStorage.patch({ ...state, planId, completedAt: Date.now() });
      track("quiz_complete", { priority: state.priority, daysPerWeek: state.daysPerWeek, level: state.level, runningGoal: state.runningGoal });
      track("free_week_completed", { priority: state.priority, daysPerWeek: state.daysPerWeek, level: state.level });
      location.href = `free-week-result.html?priority=${state.priority}&days=${state.daysPerWeek}&level=${state.level || ""}`;
    }

    back.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => {
      if (lead) return finish();
      const q = list()[step];
      if (state[q.field] === undefined) return;
      if (step === list().length - 1) {
        lead = true;
        paint();
        return;
      }
      go(1);
    });

    paint();
  }

  function resolvePlan() {
    const params = new URLSearchParams(location.search);
    const state = EGStorage.read();
    const priority = params.get("priority") || state.priority;
    const days = Number(params.get("days") || state.daysPerWeek);
    const level = params.get("level") || state.level;
    const planId = EGPlanId.getPlanId(priority, days) || state.planId;
    const profile = { ...state, priority, daysPerWeek: days, level };
    const plan = window.EGEngine
      ? EGEngine.buildFreeWeek(profile)
      : (planId ? EGPlans.getPlan(planId) : null);
    return { state, plan, planId: plan?.id || planId, profile };
  }

  function exerciseRows(list = []) {
    return list.map((ex) => `
      <div class="ex">
        <div>
          <strong>${ex.name}</strong><br>
          <span class="muted">${ex.prescription}${ex.rest ? ` · rest ${ex.rest}` : ""}</span>
          ${ex.notes ? `<br><span class="muted">${ex.notes}</span>` : ""}
        </div>
        ${ex.videoUrl ? `<button type="button" class="btn-link" data-video="${ex.videoUrl}" data-name="${ex.name}">Watch</button>` : ""}
      </div>`).join("");
  }

  function renderPlan(plan, mount, { openFirst = true } = {}) {
    if (window.EGPlanView) EGPlanView.renderWeek(plan, mount, { openFirst });
    else {
      mount.innerHTML = plan.sessions.map((s, i) => `
        <article class="workout ${openFirst && i === 0 ? "" : "is-collapsed"}" data-i="${i}">
          <button type="button" class="workout__head" data-toggle>
            <div>
              <p class="workout__day">${s.dayName || `Day ${s.day}`}</p>
              <h3>${s.title}</h3>
            </div>
            <span class="tag tag--${s.type}">${TYPE_LABEL[s.type] || s.type}</span>
          </button>
          <p class="workout__meta">${window.EGPlanView ? EGPlanView.durationText(s) : (s.durationMin || "")} · ${s.intensityLabel || s.intensity || ""}</p>
          <div class="workout__body">
            ${s.coachNote ? `<p class="muted" style="margin:10px 0 6px">${s.coachNote}</p>` : ""}
            ${s.warmup?.length ? `<p class="ex-label">Warm-up</p>${exerciseRows(s.warmup)}` : ""}
            <p class="ex-label">Main</p>
            ${exerciseRows(s.main)}
            ${s.cooldown?.length ? `<p class="ex-label">Cool-down</p>${exerciseRows(s.cooldown)}` : ""}
          </div>
        </article>`).join("");
      qsa("[data-toggle]", mount).forEach((btn) => {
        btn.addEventListener("click", () => btn.closest(".workout").classList.toggle("is-collapsed"));
      });
    }
    qsa("[data-video]", mount).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        track("video_opened", { planId: plan.id, exerciseName: btn.dataset.name });
        openVideo(btn.dataset.video, btn.dataset.name);
      });
    });
  }

  function openVideo(url, name) {
    let sheet = qs("#videoSheet");
    if (!sheet) {
      sheet = document.createElement("div");
      sheet.id = "videoSheet";
      sheet.className = "sheet";
      sheet.innerHTML = `
        <div class="sheet__panel">
          <button type="button" class="sheet__close" id="videoClose">Close</button>
          <h3 id="videoTitle"></h3>
          <div class="sheet__frame"><iframe id="videoFrame" title="Exercise demo" allowfullscreen loading="lazy"></iframe></div>
        </div>`;
      document.body.appendChild(sheet);
      qs("#videoClose").addEventListener("click", () => {
        qs("#videoFrame").src = "";
        sheet.classList.remove("is-open");
      });
      sheet.addEventListener("click", (e) => { if (e.target === sheet) qs("#videoClose").click(); });
    }
    qs("#videoTitle").textContent = name;
    qs("#videoFrame").src = url;
    sheet.classList.add("is-open");
  }

  function weekOverview(plan) {
    if (window.EGPlanView) return EGPlanView.weekOverview(plan);
    return `<ol class="week-overview">${plan.sessions.map((s) => `
      <li>
        <span>${s.dayName || `Day ${s.day}`}</span>
        <strong>${TYPE_LABEL[s.type]}</strong>
        <em>${s.title}</em>
      </li>`).join("")}</ol>`;
  }

  function downloadPdf(plan, state) {
    track("pdf_download_clicked", { planId: plan.id });
    if (window.EGPdf) EGPdf.download(plan, state);
  }

  function renderZoneResults(out, saved) {
    const result = window.EGZones?.compute(saved);
    if (!out || !result) {
      if (out) {
        out.hidden = true;
        out.innerHTML = "";
      }
      return;
    }
    out.hidden = false;
    out.innerHTML = `<p>${result.label}</p>${result.bands.map((z) => `
      <div class="zone-row${z.focus ? " is-focus" : ""}">
        <div>
          <strong>${z.name}</strong>
          <p class="muted" style="font-size:.78rem;margin:0">${z.rpe}</p>
        </div>
        <span>${z.display}</span>
      </div>`).join("")}
      <button class="btn btn--ghost btn--full" type="button" data-zones-pdf>Download zones PDF</button>`;
  }

  function initBasics() {
    const sheet = qs("#basicsSheet");
    const openBtn = qs("[data-basics-open]");
    if (!sheet || !openBtn) return;

    const hint = qs("[data-basics-hint]");
    const form = qs("[data-zones-form]");
    const out = qs("[data-zones-out]");
    const err = qs("[data-zones-error]");
    const maxInput = qs("#zoneMaxHr");
    const fivekMin = qs("#zoneFivekMin");
    const fivekSec = qs("#zoneFivekSec");
    const fivekLabel = qs("[data-fivek-label]");
    const methodTabs = qsa("[data-zone-method]");
    const fivekTabs = qsa("[data-fivek-mode]");
    const fieldGroups = qsa("[data-zone-fields]");
    const tabs = qsa("[data-basics-tab]");
    const panels = qsa("[data-basics-panel]");

    function currentMethod() {
      return methodTabs.find((tab) => tab.classList.contains("is-on"))?.dataset.zoneMethod || "hr";
    }

    function currentFivekMode() {
      return fivekTabs.find((tab) => tab.classList.contains("is-on"))?.dataset.fivekMode || "time";
    }

    function showMethod(id) {
      methodTabs.forEach((tab) => {
        const on = tab.dataset.zoneMethod === id;
        tab.classList.toggle("is-on", on);
        tab.setAttribute("aria-selected", String(on));
      });
      fieldGroups.forEach((group) => {
        group.hidden = group.dataset.zoneFields !== id;
      });
    }

    function showFivekMode(mode) {
      fivekTabs.forEach((tab) => {
        const on = tab.dataset.fivekMode === mode;
        tab.classList.toggle("is-on", on);
        tab.setAttribute("aria-selected", String(on));
      });
      if (fivekLabel) fivekLabel.textContent = mode === "pace" ? "Pace /km" : "5K time";
      if (fivekMin) fivekMin.placeholder = mode === "pace" ? "5" : "25";
    }

    function paintSaved() {
      const saved = window.EGZones?.normalize(EGStorage.read().runningZones);
      if (hint) hint.textContent = window.EGZones?.hint(saved) || "What RPE means, and how to set your running zones.";
      if (saved?.method === "hr" && maxInput) maxInput.value = saved.maxHr;
      if (saved?.method === "fivek") {
        showMethod("fivek");
        const mode = saved.fiveKMode || "time";
        showFivekMode(mode);
        const clock = mode === "pace" ? saved.fiveKSec / 5 : saved.fiveKSec;
        if (fivekMin) fivekMin.value = saved.clockMin != null ? saved.clockMin : Math.floor(clock / 60);
        if (fivekSec) fivekSec.value = saved.clockSec != null ? saved.clockSec : Math.round(clock % 60);
      } else {
        showMethod(saved?.method || "hr");
      }
      renderZoneResults(out, saved);
    }

    function setOpen(open) {
      sheet.classList.toggle("is-open", open);
      sheet.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        track("basics_opened");
        qs("#basicsTitle", sheet)?.focus();
      } else {
        openBtn.focus();
      }
    }

    function showTab(id) {
      tabs.forEach((tab) => {
        const on = tab.dataset.basicsTab === id;
        tab.classList.toggle("is-on", on);
        tab.setAttribute("aria-selected", String(on));
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.basicsPanel !== id;
      });
    }

    openBtn.addEventListener("click", () => setOpen(true));
    qsa("[data-basics-close]").forEach((btn) => btn.addEventListener("click", () => setOpen(false)));
    sheet.addEventListener("click", (e) => { if (e.target === sheet) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sheet.classList.contains("is-open")) setOpen(false);
    });
    tabs.forEach((tab) => tab.addEventListener("click", () => showTab(tab.dataset.basicsTab)));
    methodTabs.forEach((tab) => tab.addEventListener("click", () => {
      if (err) err.hidden = true;
      showMethod(tab.dataset.zoneMethod);
    }));
    fivekTabs.forEach((tab) => tab.addEventListener("click", () => {
      if (err) err.hidden = true;
      showFivekMode(tab.dataset.fivekMode);
    }));

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const saved = currentMethod() === "fivek"
        ? window.EGZones?.fromFiveK({ mode: currentFivekMode(), min: fivekMin?.value, sec: fivekSec?.value })
        : window.EGZones?.fromMaxHr(maxInput?.value);
      if (!saved) {
        if (err) err.hidden = false;
        return;
      }
      if (err) err.hidden = true;
      EGStorage.patch({ runningZones: saved });
      track("zones_set", { method: saved.method, maxHr: saved.maxHr || null, fiveKSec: saved.fiveKSec || null });
      paintSaved();
      showTab("zones");
    });

    out?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-zones-pdf]");
      if (!btn) return;
      const saved = window.EGZones?.normalize(EGStorage.read().runningZones);
      if (saved && window.EGPdf?.downloadZones) {
        track("zones_pdf_clicked", { method: saved.method });
        EGPdf.downloadZones(saved);
      }
    });

    paintSaved();
    if (location.hash === "#basics" || location.hash === "#zones") {
      if (location.hash === "#zones") showTab("zones");
      setOpen(true);
    }
  }

  function initResult() {
    mountChrome({ funnel: true });
    const { state, plan } = resolvePlan();
    const recovery = qs("#recovery");
    const result = qs("#result");

    if (!plan) {
      result.hidden = true;
      recovery.hidden = false;
      return;
    }

    recovery.hidden = true;
    result.hidden = false;
    EGStorage.patch({
      ...state,
      planId: plan.id,
      priority: plan.priority,
      daysPerWeek: plan.daysPerWeek,
      freeWeekCompleted: true
    });
    track("plan_viewed", { planId: plan.id, priority: plan.priority, daysPerWeek: plan.daysPerWeek });

    qs("[data-title]").textContent = `Your ${plan.title}`;
    const goalChip = (window.EGRoadmap?.GOAL_LABEL || {})[plan.runningGoal] || plan.runningGoal;
    qs("[data-meta]").innerHTML = `
      <span class="chip">${plan.daysPerWeek} days</span>
      <span class="chip">${plan.priority}</span>
      <span class="chip">${plan.level}</span>
      ${goalChip ? `<span class="chip">${goalChip}</span>` : ""}`;
    qs("[data-intro]").textContent = plan.intro;
    qs("[data-overview]").innerHTML = weekOverview(plan);
    renderPlan(plan, qs("[data-week]"));
    const notes = qs("[data-explanations]");
    if (notes) {
      notes.innerHTML = (plan.explanations || []).map((e) => `<p>${e.text}</p>`).join("");
    }
    qs("[data-guidance]").innerHTML = plan.weeklyGuidance.map((g) => `<li>${g}</li>`).join("");
    qs("[data-disclaimer]").textContent = plan.disclaimer;
    paintRoadmapPreview(state, plan);

    const caution = qs("[data-caution]");
    if (state.hasConstraints) {
      caution.hidden = false;
      caution.textContent = "You flagged a limitation. This is not a rehabilitation plan. Conservative swaps are applied only when the tag maps to a movement. Get professional clearance where appropriate.";
    } else caution.hidden = true;

    qs("[data-pdf]").addEventListener("click", () => {
      EGStorage.patch({ freeWeekDownloaded: true });
      track("free_plan_pdf_download", { planId: plan.id });
      track("free_week_downloaded", { planId: plan.id });
      downloadPdf(plan, state);
      window.setTimeout(() => showUpsellSheet("pdf"), 600);
    });
    qsa("[data-upgrade]").forEach((el) => {
      el.addEventListener("click", () => {
        if (el.dataset.upgrade === "later") {
          dismissUpsell("inline");
          qs("[data-week]")?.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        EGStorage.patch({ secondQuizStarted: true });
        track("upsell_cta_clicked", { planId: plan.id, placement: el.dataset.upgrade });
        track("upgrade_clicked", { planId: plan.id, placement: el.dataset.upgrade });
      });
    });
    track("free_plan_view", { planId: plan.id, priority: plan.priority, days: plan.daysPerWeek, level: plan.level, runningGoal: plan.runningGoal });
    initBasics();
    initUpsellSheet(plan);
  }

  function paintRoadmapPreview(state, plan) {
    const mount = qs("[data-sales]");
    if (!mount || !window.EGRoadmap) return;
    const examples = EGRoadmap.progressionExamples(state);
    const blocks = EGRoadmap.blocks(state);
    const locked = EGRoadmap.lockedWeeks(state).slice(0, 6);
    const preview = EGRoadmap.preview(state);
    track("roadmap_view", { priority: state.priority, runningGoal: state.runningGoal });
    mount.innerHTML = `
      <div class="sales-block">
        <p class="eyebrow">Your first week is ready</p>
        <h2>This is Week 1. Here is what changes next.</h2>
        <ol class="roadmap">${blocks.map((b) => `
          <li><span>${b.weeks}</span><strong>${b.title}</strong><p>${b.detail}</p></li>`).join("")}</ol>
      </div>
      <div class="sales-block">
        <p class="eyebrow">Your progression</p>
        <h2>Examples from your profile</h2>
        <ol class="progress-examples">${examples.map((ex) => `
          <li><span>Week ${ex.week}</span><p>${ex.text}</p></li>`).join("")}</ol>
      </div>
      ${preview?.session ? `
      <div class="sales-block">
        <p class="eyebrow">Later in the plan</p>
        <h2>A Week ${preview.week} session</h2>
        <p class="lead">Your plan progressively prepares you for sessions like this — without jumping ahead before you are ready.</p>
        ${EGPlanView.renderSession(preview.session, 0, { openFirst: true })}
      </div>` : ""}
      <div class="sales-block">
        <p class="eyebrow">Weeks 2–12</p>
        <h2>The structure is already mapped</h2>
        <div class="locked-grid">${locked.map((w) => EGPlanView.lockedCard(w)).join("")}</div>
      </div>
      <div class="upgrade" data-upsell>
        <p class="eyebrow">Next</p>
        <h2>See my 12-week progression</h2>
        <p>Week 1 is your starting point. Answer a few more questions and I’ll map the full BUILD / PROGRESS / PERFORM path to your goal.</p>
        <a class="btn btn--primary btn--full" href="build-my-plan.html" data-upgrade="primary" data-roadmap-cta>See my 12-week progression</a>
        <button class="btn btn--ghost btn--full" type="button" data-upgrade="later" data-upsell-later style="margin-top:8px">Maybe later</button>
      </div>`;
    qs("[data-roadmap-cta]", mount)?.addEventListener("click", () => {
      track("roadmap_cta_click", { planId: plan.id, priority: plan.priority });
    });
  }

  function upsellBlocked() {
    const state = EGStorage.read();
    if (state.upsellDismissed || state.secondQuizStarted || state.secondQuizCompleted) return true;
    try { if (sessionStorage.getItem("eg_upsell_dismissed") === "1") return true; }
    catch { /* ignore */ }
    return false;
  }

  function isMobileUpsell() {
    return window.matchMedia("(max-width: 799px)").matches;
  }

  function dismissUpsell(source) {
    EGStorage.patch({ upsellDismissed: true });
    try { sessionStorage.setItem("eg_upsell_dismissed", "1"); }
    catch { /* ignore */ }
    const sheet = qs("#upsellSheet");
    if (sheet?.classList.contains("is-open")) {
      track("upsell_dismissed", { source: source || "sheet" });
    }
    closeUpsellSheet();
  }

  function closeUpsellSheet() {
    const sheet = qs("#upsellSheet");
    const panel = qs("[data-upsell-panel]");
    if (!sheet) return;
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    if (panel) panel.style.transform = "";
    document.body.style.overflow = "";
  }

  function showUpsellSheet(source) {
    const sheet = qs("#upsellSheet");
    if (!sheet || !isMobileUpsell() || upsellBlocked()) return;
    if (sheet.classList.contains("is-open")) return;
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    EGStorage.patch({ upsellShown: true });
    track("upsell_viewed", { source, placement: "sheet" });
    qs("#upsellTitle", sheet)?.focus();
  }

  function initUpsellSheet(plan) {
    const sheet = qs("#upsellSheet");
    if (!sheet) return;
    EGStorage.patch({ freeWeekCompleted: true });
    track("free_week_generated", { planId: plan.id, priority: plan.priority, daysPerWeek: plan.daysPerWeek });
    track("upsell_viewed", { source: "inline", placement: "inline" });

    qsa("[data-upsell-close], [data-upsell-later]", sheet).forEach((btn) => {
      btn.addEventListener("click", () => dismissUpsell(btn.dataset.upsellLater != null ? "later" : "close"));
    });
    sheet.addEventListener("click", (e) => { if (e.target === sheet) dismissUpsell("backdrop"); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sheet.classList.contains("is-open")) dismissUpsell("esc");
    });

    const panel = qs("[data-upsell-panel]");
    let startY = 0;
    let dragging = false;
    const onStart = (y) => { startY = y; dragging = true; };
    const onMove = (y) => {
      if (!dragging || !panel) return;
      const dy = Math.max(0, y - startY);
      panel.style.transform = `translateY(${dy}px)`;
    };
    const onEnd = (y) => {
      if (!dragging) return;
      dragging = false;
      if (y - startY > 72) dismissUpsell("swipe");
      else if (panel) panel.style.transform = "";
    };
    panel?.addEventListener("touchstart", (e) => onStart(e.touches[0].clientY), { passive: true });
    panel?.addEventListener("touchmove", (e) => onMove(e.touches[0].clientY), { passive: true });
    panel?.addEventListener("touchend", (e) => onEnd(e.changedTouches[0].clientY));

    window.setTimeout(() => {
      if (window.scrollY > 280) showUpsellSheet("time");
    }, 22000);
    window.addEventListener("scroll", () => {
      const doc = document.documentElement;
      const scrolled = (window.scrollY + window.innerHeight) / Math.max(doc.scrollHeight, 1);
      if (scrolled > 0.62) showUpsellSheet("scroll");
    }, { passive: true });
  }

  function paintOffer(profile) {
    const offer = qs("#offer");
    const quiz = qs("#quiz");
    const progress = qs("#quizProgress");
    const nav = qs("#quizNav");
    const generating = qs("#generating");
    if (generating) generating.hidden = true;
    if (quiz) quiz.hidden = true;
    if (progress) progress.hidden = true;
    if (nav) nav.hidden = true;
    if (!offer) return;
    offer.hidden = false;
    qs("[data-profile-lines]", offer).innerHTML = EGProfile.summaryLines(profile).map((line) => `<li>${line}</li>`).join("");
    qs("[data-roadmap]", offer).innerHTML = EGProfile.roadmap(profile).map((block) => `
      <li>
        <span>${block.weeks}</span>
        <strong>${block.title}</strong>
        <p>${block.detail}</p>
      </li>`).join("");
    qs("[data-subs]", offer).textContent = EGProfile.substitutions(profile);
    qs("[data-mapped]", offer)?.removeAttribute("hidden");
    const lockedMount = qs("[data-locked-weeks]", offer);
    if (lockedMount && window.EGRoadmap && window.EGPlanView) {
      lockedMount.innerHTML = EGRoadmap.lockedWeeks(profile).map((w) => EGPlanView.lockedCard(w)).join("");
    }
    qs("[data-offer-list]", offer).innerHTML = EGProfile.OFFER_ITEMS.map((item) => `<li>${item}</li>`).join("");
    const premiumList = qs("[data-premium-list]", offer);
    if (premiumList) {
      premiumList.innerHTML = EGProfile.PREMIUM_ITEMS.map((item) => `<li>${item}</li>`).join("");
    }
    const payCopy = (product) =>
      EGCheckout.usesStripe(product) ? "Secure payment via Stripe." : "You’ll get a Stripe payment link by email.";
    const note = qs("[data-pay-note]", offer);
    const notePremium = qs("[data-pay-note-premium]", offer);
    if (note) note.textContent = payCopy("plan12");
    if (notePremium) notePremium.textContent = payCopy("premium");
    EGStorage.patch({ paidOfferViewed: true, mappedAt: Date.now() });
    track("offer_view", { priority: profile.priority, target: profile.target });
    track("price_view", { priority: profile.priority });
    track("paid_offer_viewed", { priority: profile.priority, target: profile.target });
  }

  function bindCheckout(profile) {
    qsa("[data-checkout]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = btn.dataset.checkout || "plan12";
        track("checkout_start", { product, priority: profile.priority });
        track("checkout_clicked", { product, priority: profile.priority });
        EGCheckout.start(profile, product);
      });
    });
  }

  function initBuildPlan() {
    mountChrome({ funnel: true });
    const stored = EGStorage.read();
    if (!stored.priority || !stored.daysPerWeek) {
      location.replace("free-week.html");
      return;
    }

    const generating = qs("#generating");
    const quiz2 = stored.quiz2 || {};
    if (EGProfile.isComplete(quiz2, stored) || stored.secondQuizCompleted) {
      const profile = EGProfile.build(stored, quiz2);
      paintOffer(profile);
      bindCheckout(profile);
      return;
    }

    track("premium_quiz_start", { priority: stored.priority, daysPerWeek: stored.daysPerWeek });
    track("second_quiz_started", { priority: stored.priority, daysPerWeek: stored.daysPerWeek });
    EGStorage.patch({ secondQuizStarted: true });

    const root = qs("#quiz");
    const bar = qs("#progressBar");
    const stepLabel = qs("#stepLabel");
    const back = qs("#backBtn");
    let answers = { ...quiz2 };
    let step = 0;

    function questions() {
      return EGProfile.questionsFor(answers, stored);
    }

    function paint() {
      const list = questions();
      if (step >= list.length) step = Math.max(0, list.length - 1);
      const q = list[step];
      const total = list.length;
      bar.style.width = `${((step + 1) / total) * 100}%`;
      stepLabel.textContent = `${step + 1} of ${total}`;
      back.disabled = false;
      const selected = answers[q.field] == null ? "" : String(answers[q.field]);
      root.innerHTML = `<p class="eyebrow">Let’s build your 12-week progression.</p><h1>${q.title}</h1>${optionList(q, selected)}`;
      qsa("[data-field]", root).forEach((btn) => {
        btn.addEventListener("click", () => {
          answers[q.field] = btn.dataset.value;
          if (q.field === "target" && !EGProfile.NEEDS_EVENT.includes(answers.target)) {
            delete answers.eventWindow;
          }
          EGStorage.patch({ quiz2: answers, secondQuizStarted: true });
          track("second_quiz_question_completed", { questionId: q.id, answerKey: btn.dataset.value, step: step + 1 });
          qsa(".option", root).forEach((b) => b.classList.toggle("is-selected", b === btn));
          window.setTimeout(() => go(1), 160);
        });
      });
    }

    function go(delta) {
      const nextStep = step + delta;
      if (nextStep < 0) {
        location.href = "free-week-result.html";
        return;
      }
      if (nextStep >= questions().length) return finish();
      step = nextStep;
      paint();
    }

    function finish() {
      if (!EGProfile.isComplete(answers, stored)) {
        paint();
        return;
      }
      EGStorage.patch({ quiz2: answers, secondQuizCompleted: true, secondQuizCompletedAt: Date.now() });
      track("premium_quiz_complete", { result: answers.result, limitingFactor: answers.limitingFactor });
      track("second_quiz_completed", { target: answers.result, limitation: answers.limitingFactor });
      const profile = EGProfile.build(EGStorage.read(), answers);
      if (window.EGEngine) EGEngine.build12WeekSummaries(profile, answers);
      if (generating) {
        generating.hidden = false;
        const line = qs("[data-map-line]", generating);
        const lines = [
          "Mapping your weekly structure...",
          "Adapting sessions to your level...",
          "Matching your running goal...",
          "Applying your equipment setup...",
          "Building your 12-week progression..."
        ];
        let i = 0;
        if (line) line.textContent = lines[0];
        const tick = window.setInterval(() => {
          i += 1;
          if (line && lines[i]) line.textContent = lines[i];
          if (i >= lines.length - 1) window.clearInterval(tick);
        }, 520);
      }
      window.setTimeout(() => {
        paintOffer(profile);
        bindCheckout(profile);
      }, 2800);
    }

    back.addEventListener("click", () => go(-1));
    paint();
  }

  function initPage() { mountChrome(); }
  function initHybridPlan() {
    mountChrome();
    const mount = qs("[data-sample-week]");
    const plan = EGPlans?.getPlan("balanced-4d");
    if (mount && plan) renderPlan(plan, mount, { openFirst: true });
  }

  return { initHome, initFreeWeek, initResult, initPage, initHybridPlan, initBuildPlan, track };
})();
