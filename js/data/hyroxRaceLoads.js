/* Versioned HYROX Race Load config. Builders must read from here, never hardcode. */
(function (root) {
  const RACE_LOADS = {
    version: "2025-26",
    updatedAt: "2026-03-01",
    note: "Totals for sleds include the sled. Official category loads change; update this file only.",
    categories: {
      men_open: {
        label: "Men Open",
        sledPushKg: 152,
        sledPullKg: 103,
        farmersKgEach: 24,
        sandbagKg: 20,
        wallBallKg: 6,
        wallBallReps: 100
      },
      women_open: {
        label: "Women Open",
        sledPushKg: 102,
        sledPullKg: 78,
        farmersKgEach: 16,
        sandbagKg: 10,
        wallBallKg: 4,
        wallBallReps: 75
      },
      men_pro: {
        label: "Men Pro",
        sledPushKg: 202,
        sledPullKg: 153,
        farmersKgEach: 32,
        sandbagKg: 30,
        wallBallKg: 9,
        wallBallReps: 100
      },
      women_pro: {
        label: "Women Pro",
        sledPushKg: 152,
        sledPullKg: 103,
        farmersKgEach: 24,
        sandbagKg: 20,
        wallBallKg: 6,
        wallBallReps: 100
      }
    }
  };

  function category(id) {
    return RACE_LOADS.categories[id] || RACE_LOADS.categories.men_open;
  }

  function exampleTotal(station, categoryId, pct = 100) {
    const cat = category(categoryId);
    const map = {
      sled_push: cat.sledPushKg,
      sled_pull: cat.sledPullKg,
      farmers: cat.farmersKgEach,
      sandbag: cat.sandbagKg,
      wall_ball: cat.wallBallKg
    };
    const base = map[station];
    if (base == null) return null;
    return Math.round(base * (pct / 100));
  }

  const api = { RACE_LOADS, category, exampleTotal };
  root.EGRaceLoads = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
