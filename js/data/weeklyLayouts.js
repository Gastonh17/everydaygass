/* 20 explicit 7-day calendar skeletons. Recovery days are first-class. */
(function (root) {
  const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const LAYOUTS = {
    "running-3d": ["fullStrength", "recovery", "easyRun", "recovery", "qualityRun", "recovery", "recovery"],
    "running-4d": ["fullStrength", "easyRun", "recovery", "qualityRun", "recovery", "recovery", "longRun"],
    "running-5d": ["fullStrength", "easyRun", "fullStrengthSecondary", "recovery", "qualityRun", "recovery", "longRun"],
    "running-6d": ["fullStrength", "easyRun", "fullStrengthSecondary", "qualityRun", "easyRunSecondary", "recovery", "longRun"],
    "running-7d": ["fullStrength", "easyRun", "fullStrengthSecondary", "qualityRun", "easyRunSecondary", "mobility", "longRun"],

    "strength-3d": ["lowerStrength", "recovery", "easyRun", "recovery", "upperStrength", "recovery", "recovery"],
    "strength-4d": ["lowerStrength", "easyRun", "recovery", "upperStrength", "recovery", "fullStrengthSecondary", "recovery"],
    "strength-5d": ["lowerStrength", "easyRun", "upperStrength", "recovery", "fullStrengthSecondary", "hybridConditioning", "recovery"],
    "strength-6d": ["lowerStrength", "easyRun", "upperStrength", "fullStrengthSecondary", "recovery", "hybridConditioning", "easyRunSecondary"],
    "strength-7d": ["lowerStrength", "easyRun", "upperStrength", "fullStrengthSecondary", "mobility", "hybridConditioning", "easyRunSecondary"],

    "balanced-3d": ["fullStrength", "recovery", "easyRun", "recovery", "hybridConditioning", "recovery", "recovery"],
    "balanced-4d": ["fullStrength", "easyRun", "recovery", "hybridConditioning", "recovery", "qualityRun", "recovery"],
    "balanced-5d": ["fullStrength", "easyRun", "fullStrengthSecondary", "recovery", "hybridConditioning", "qualityRun", "recovery"],
    "balanced-6d": ["fullStrength", "easyRun", "fullStrengthSecondary", "qualityRun", "recovery", "hybridConditioning", "easyRunSecondary"],
    "balanced-7d": ["fullStrength", "easyRun", "fullStrengthSecondary", "qualityRun", "mobility", "hybridConditioning", "easyRunSecondary"],

    "hyrox-3d": ["strengthHyrox", "recovery", "easyRun", "recovery", "hyroxRun", "recovery", "recovery"],
    "hyrox-4d": ["strengthHyrox", "easyRun", "recovery", "hyroxRun", "recovery", "hyroxStations", "recovery"],
    "hyrox-5d": ["fullStrength", "easyRun", "recovery", "hyroxRun", "strengthHyrox", "recovery", "hyroxStations"],
    "hyrox-6d": ["lowerStrength", "easyRun", "upperStrength", "hyroxRun", "recovery", "enduranceRun", "hyroxStations"],
    "hyrox-7d": ["lowerStrength", "easyOrQualityRun", "upperStrength", "hyroxRun", "fullStrengthSecondary", "longOrEnduranceRun", "hyroxStations"]
  };

  function getLayout(priority, daysPerWeek) {
    const id = `${priority}-${Number(daysPerWeek)}d`;
    const keys = LAYOUTS[id];
    return keys ? keys.slice() : null;
  }

  function allLayoutIds() {
    return Object.keys(LAYOUTS);
  }

  const api = { DAY_NAMES, LAYOUTS, getLayout, allLayoutIds };
  root.EGLayouts = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
