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

  const QUESTIONS = [
    {
      id: "priority",
      title: "What do you want to improve most right now?",
      field: "priority",
      options: [
        ["running", "Running", "More engine. Still lift."],
        ["strength", "Strength", "Get stronger. Keep the engine."],
        ["balanced", "Balanced Hybrid", "Run. Lift. Condition. Recover."],
        ["hyrox", "HYROX", "Race flavour without elite volume."]
      ]
    },
    {
      id: "daysPerWeek",
      title: "How many days can you realistically train each week?",
      field: "daysPerWeek",
      options: [
        ["3", "3 days", "Enough to start"],
        ["4", "4 days", "The usual busy-week fit"],
        ["5", "5 days", "Only if this is honest"],
        ["6", "6 days", "High frequency, still recoverable"],
        ["7", "7 days", "Six sessions + one easy recovery"]
      ]
    },
    {
      id: "level",
      title: "How would you describe your current training level?",
      field: "level",
      options: [
        ["beginner", "Beginner", "Building the habit"],
        ["intermediate", "Intermediate", "I train, I want structure"],
        ["advanced", "Advanced", "I can handle load — still not medical advice"]
      ]
    },
    {
      id: "runningBase",
      title: "Which best describes your current running?",
      field: "runningBase",
      options: [
        ["new", "New to running", "Walk-run is honest"],
        ["5k", "Can run 5K", "I can jog it"],
        ["10k", "10K+ regularly", "I have a base"],
        ["performance", "Performance-focused", "I already chase times"]
      ]
    },
    {
      id: "strengthBase",
      title: "How experienced are you with strength training?",
      field: "strengthBase",
      options: [
        ["new", "New", "Teach me the patterns"],
        ["some", "Some experience", "I know the basics"],
        ["consistent", "Consistent", "I lift most weeks"],
        ["advanced", "Advanced", "I can load the lifts"]
      ]
    },
    {
      id: "trainingAccess",
      title: "Where will you train most?",
      field: "trainingAccess",
      options: [
        ["full_gym", "Full gym", "Bar, machines, dumbbells"],
        ["basic_gym", "Basic gym", "Dumbbells, cables, a bench"],
        ["home_run", "Home + running", "Minimal kit + outside"],
        ["mixed", "Mixed", "It depends on the day"]
      ]
    },
    {
      id: "hasConstraints",
      title: "Any injury, pain, medical restriction or pregnancy that may affect training?",
      field: "hasConstraints",
      confirm: true,
      options: [
        ["no", "No", "I’ll use the generic week"],
        ["yes", "Yes", "I’ll still see the generic week — with a caution"]
      ]
    }
  ];

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
    const items = QUESTIONS[0].options;
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
    track("free_week_started", { source: params.get("src") || "site" });

    const root = qs("#quiz");
    const bar = qs("#progressBar");
    const stepLabel = qs("#stepLabel");
    const back = qs("#backBtn");
    const next = qs("#nextBtn");
    let step = state.priority && params.get("priority") ? 1 : 0;

    function paint() {
      const q = QUESTIONS[step];
      const total = QUESTIONS.length;
      bar.style.width = `${((step + 1) / total) * 100}%`;
      stepLabel.textContent = `${step + 1} / ${total}`;
      back.disabled = step === 0;
      next.hidden = !q.confirm;
      next.textContent = step === total - 1 ? "See my week" : "Continue";
      let selected = state[q.field];
      if (q.field === "hasConstraints") selected = selected === true ? "yes" : selected === false ? "no" : "";
      else selected = selected == null ? "" : String(selected);
      root.innerHTML = `<h1>${q.title}</h1>${optionList(q, selected)}`;
      qsa("[data-field]", root).forEach((btn) => {
        btn.addEventListener("click", () => {
          const field = btn.dataset.field;
          let value = btn.dataset.value;
          if (field === "daysPerWeek") value = Number(value);
          if (field === "hasConstraints") value = value === "yes";
          state[field] = value;
          EGStorage.patch(state);
          track("question_answered", { questionId: q.id, answerKey: String(btn.dataset.value), step: step + 1 });
          qsa(".option", root).forEach((b) => b.classList.toggle("is-selected", b === btn));
          if (!q.confirm) setTimeout(() => go(1), 160);
        });
      });
    }

    function go(delta) {
      const nextStep = step + delta;
      if (nextStep < 0) return;
      if (nextStep >= QUESTIONS.length) return finish();
      step = nextStep;
      paint();
    }

    function finish() {
      const planId = EGPlanId.getPlanId(state.priority, state.daysPerWeek);
      if (!planId) {
        step = state.priority ? 1 : 0;
        paint();
        return;
      }
      EGStorage.patch({ ...state, planId, completedAt: Date.now() });
      track("free_week_completed", { priority: state.priority, daysPerWeek: state.daysPerWeek, level: state.level });
      location.href = `free-week-result.html?priority=${state.priority}&days=${state.daysPerWeek}`;
    }

    back.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => {
      const q = QUESTIONS[step];
      if (state[q.field] === undefined) return;
      if (step === QUESTIONS.length - 1) finish();
      else go(1);
    });

    paint();
  }

  function resolvePlan() {
    const params = new URLSearchParams(location.search);
    const state = EGStorage.read();
    const priority = params.get("priority") || state.priority;
    const days = Number(params.get("days") || state.daysPerWeek);
    const planId = EGPlanId.getPlanId(priority, days) || state.planId;
    const plan = planId ? EGPlans.getPlan(planId) : null;
    return { state, plan, planId };
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
    mount.innerHTML = plan.sessions.map((s, i) => `
      <article class="workout ${openFirst && i === 0 ? "" : "is-collapsed"}" data-i="${i}">
        <button type="button" class="workout__head" data-toggle>
          <div>
            <p class="workout__day">Day ${s.day}</p>
            <h3>${s.title}</h3>
          </div>
          <span class="tag tag--${s.type}">${TYPE_LABEL[s.type] || s.type}</span>
        </button>
        <p class="workout__meta">${s.durationMin ? `${s.durationMin} min` : ""} · ${s.intensity || ""}</p>
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
    return `<ol class="week-overview">${plan.sessions.map((s) => `
      <li>
        <span>Day ${s.day}</span>
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
    EGStorage.patch({ ...state, planId: plan.id });
    track("plan_viewed", { planId: plan.id, priority: plan.priority, daysPerWeek: plan.daysPerWeek });

    qs("[data-title]").textContent = `Your ${plan.title}`;
    qs("[data-meta]").innerHTML = `
      <span class="chip">${plan.daysPerWeek} days</span>
      <span class="chip">${plan.priority}</span>`;
    qs("[data-intro]").textContent = plan.intro;
    qs("[data-overview]").innerHTML = weekOverview(plan);
    renderPlan(plan, qs("[data-week]"));
    qs("[data-guidance]").innerHTML = plan.weeklyGuidance.map((g) => `<li>${g}</li>`).join("");
    qs("[data-disclaimer]").textContent = plan.disclaimer;

    const caution = qs("[data-caution]");
    if (state.hasConstraints) {
      caution.hidden = false;
      caution.textContent = "You flagged a constraint. This generic week is not individualized medical advice. Get professional clearance where appropriate — you can still use the structure as a starting point.";
    } else caution.hidden = true;

    qs("[data-pdf]").addEventListener("click", () => downloadPdf(plan, state));
    qsa("[data-upgrade]").forEach((el) => {
      el.addEventListener("click", () => track("upgrade_clicked", { planId: plan.id, placement: el.dataset.upgrade }));
    });
    initBasics();
  }

  function initPage() { mountChrome(); }
  function initHybridPlan() {
    mountChrome();
    const mount = qs("[data-sample-week]");
    const plan = EGPlans?.getPlan("balanced-4d");
    if (mount && plan) renderPlan(plan, mount, { openFirst: true });
  }

  return { initHome, initFreeWeek, initResult, initPage, initHybridPlan, track };
})();
