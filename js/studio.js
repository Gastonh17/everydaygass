/* Internal one-screen plan studio. */
(function () {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  const DEFAULTS = {
    clientName: "",
    priority: "balanced",
    daysPerWeek: 4,
    level: "intermediate",
    runningBase: "5k",
    runningGoal: "improve5k",
    strengthBase: "some",
    equipmentProfile: "gym_no_hyrox",
    sessionMinutes: 60,
    hasConstraints: false,
    constraintTags: [],
    constraintText: "",
    week: 1
  };

  const state = { ...DEFAULTS };
  let currentWeek = null;

  function runningGoalOptions(priority) {
    return window.EGQuiz ? EGQuiz.runningGoals(priority) : [];
  }

  function paintPills(name, options, selected) {
    return options.map(([value, title]) => `
      <button type="button" class="pill ${String(selected) === String(value) ? "is-on" : ""}" data-field="${name}" data-value="${value}">${title}</button>
    `).join("");
  }

  function profile() {
    return {
      firstName: state.clientName.trim(),
      priority: state.priority,
      daysPerWeek: Number(state.daysPerWeek),
      level: state.level,
      runningBase: state.runningBase,
      runningGoal: state.runningGoal,
      strengthBase: state.strengthBase,
      equipmentProfile: state.equipmentProfile,
      sessionMinutes: Number(state.sessionMinutes) || null,
      hasConstraints: Boolean(state.hasConstraints),
      constraintTags: state.hasConstraints ? state.constraintTags : [],
      constraintText: state.hasConstraints ? state.constraintText : "",
      week: Number(state.week) || 1
    };
  }

  function renderForm() {
    const goals = runningGoalOptions(state.priority);
    if (!goals.some((o) => o[0] === state.runningGoal)) {
      state.runningGoal = goals[0] ? goals[0][0] : "improve5k";
    }
    qs("[data-running-goal]").innerHTML = paintPills("runningGoal", goals, state.runningGoal);
    qs("[data-constraints]").hidden = !state.hasConstraints;
    qsa("[data-field]").forEach((btn) => {
      const field = btn.dataset.field;
      const value = btn.dataset.value;
      if (field === "hasConstraints") {
        btn.classList.toggle("is-on", String(state.hasConstraints) === value);
      } else if (field === "constraintTags") {
        btn.classList.toggle("is-on", state.constraintTags.includes(value));
      } else {
        btn.classList.toggle("is-on", String(state[field]) === value);
      }
    });
  }

  function renderPlan() {
    const ctx = profile();
    currentWeek = EGEngine.buildWeek(ctx);
    const title = qs("[data-plan-title]");
    const meta = qs("[data-plan-meta]");
    const overview = qs("[data-overview]");
    const weekMount = qs("[data-week]");
    const who = ctx.firstName ? `${ctx.firstName} · ` : "";
    title.textContent = `${who}${currentWeek.title} · week ${currentWeek.week}`;
    meta.innerHTML = [
      currentWeek.blockLabel,
      `${ctx.daysPerWeek}d`,
      ctx.level,
      ctx.priority,
      ctx.equipmentProfile.replace(/_/g, " ")
    ].map((t) => `<span class="chip">${t}</span>`).join("");
    overview.innerHTML = EGPlanView.weekOverview(currentWeek);
    EGPlanView.renderWeek(currentWeek, weekMount, { openFirst: true });
  }

  function bind() {
    qs("[name=clientName]").addEventListener("input", (e) => {
      state.clientName = e.target.value;
      renderPlan();
    });
    qs("[name=constraintText]").addEventListener("input", (e) => {
      state.constraintText = e.target.value.slice(0, 160);
    });
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-field]");
      if (!btn) return;
      const field = btn.dataset.field;
      let value = btn.dataset.value;
      if (field === "daysPerWeek" || field === "sessionMinutes" || field === "week") value = Number(value);
      if (field === "hasConstraints") {
        state.hasConstraints = value === "true";
        if (!state.hasConstraints) {
          state.constraintTags = [];
          state.constraintText = "";
          qs("[name=constraintText]").value = "";
        }
      } else if (field === "constraintTags") {
        const tags = new Set(state.constraintTags);
        if (tags.has(value)) tags.delete(value);
        else tags.add(value);
        state.constraintTags = [...tags];
      } else {
        state[field] = value;
      }
      renderForm();
      renderPlan();
    });
    qs("[data-pdf-week]").addEventListener("click", () => {
      if (!currentWeek || !window.EGPdf) return;
      EGPdf.download({ ...currentWeek, weeks: [currentWeek] }, profile());
    });
    qs("[data-pdf-block]").addEventListener("click", () => {
      if (!window.EGPdf) return;
      const doc = EGEngine.buildPlanDocument(profile());
      EGPdf.download(doc, profile());
    });
  }

  function init() {
    bind();
    renderForm();
    renderPlan();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
