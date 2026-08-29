# EverydayGass — Hybrid Training

Mobile-first free-week funnel: 7 questions → 1 of 20 plans → web view + PDF. No account.

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Phone on the same Wi-Fi: `http://<your-lan-ip>:8080/`

## Routes

| Path | Role |
| --- | --- |
| `/` | Landing |
| `/free-week.html` | Questionnaire |
| `/free-week-result.html` | Assigned week + PDF |
| `/hybrid-plan.html` | Paid 12-week offer |
| `/premium.html` | 12-week Premium (chat + recipes) |
| `/coaching.html` | Redirects to Premium |

Plan assignment uses only **priority** + **days** (`{priority}-{days}d`). Canonical data: `js/data/plans.js`. Tests: `node tests/plan.test.js`.
