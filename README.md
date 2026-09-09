# EverydayGass — Hybrid Training

Mobile-first funnel: 8-question quiz → personalized Week 1 → 12-week roadmap preview → paid progression.

Training is no longer “20 static plans from two answers.” The engine uses 20 weekly layouts + context-aware builders (level, running goal, equipment, constraints, 12-week blocks).

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

- Web: `http://localhost:8080/`
- Phone-frame preview: `http://localhost:8080/mobile-preview.html`
- Phone on the same Wi-Fi: `http://<your-lan-ip>:8080/`

## Routes

| Path | Role |
| --- | --- |
| `/` | Landing |
| `/free-week.html` | Questionnaire + email capture |
| `/free-week-result.html` | Week 1 + PDF + roadmap preview |
| `/build-my-plan.html` | Premium micro-quiz + mapped offer |
| `/hybrid-plan.html` | Paid 12-week offer |
| `/premium.html` | 12-week Premium (chat + recipes) |
| `/coaching.html` | Redirects to Premium |

Plan IDs stay `{priority}-{days}d`. Canonical layouts: `js/data/weeklyLayouts.js`. Engine: `js/engine/engine.js`.

```bash
node tests/plan.test.js
node tests/engine.test.js
node tests/profile.test.js
node tests/migrate.test.js
```
