import { LEVERS, CATEGORIES, Category, Lever } from "./levers";

export type Answers = Record<string, number>; // leverId -> option index

export interface CategoryScore {
  category: Category;
  pct: number; // 0–100 intensity for this category
}

export interface Result {
  baseIntensity: number; // 0–100 additive
  multiplier: number; // 1.0+
  finalIntensity: number; // 0–100+, capped at 120 for display
  categoryScores: CategoryScore[];
  spectrum: number; // 0 business – 100 mission
  verdict: 1 | 2 | 3 | 4 | 5;
  verdictLabel: string;
  flags: string[]; // named heavy levers currently running hot
}

const MULTIPLIER_STEP = 0.125; // each intensity point on a multiplier lever adds 12.5%

const VERDICT_LABELS: Record<number, string> = {
  5: "Green — the lever combination is well within sustainable capacity. Build.",
  4: "Favorable — intensity is real but bounded. Build, and watch your flagged levers.",
  3: "Contested — you are near the edge of sustainable capacity. Redesign one or two heavy levers before committing.",
  2: "Overloaded — this combination runs above 90% capacity. Change the context, the model, or the philosophy before proceeding.",
  1: "Red — the current lever combination is not sustainably endurable. Do not build this as designed.",
};

export function score(answers: Answers): Result {
  let addWeighted = 0;
  let addMax = 0;
  let multiplier = 1;
  const flags: string[] = [];

  const catWeighted: Record<string, number> = {};
  const catMax: Record<string, number> = {};

  for (const lever of LEVERS) {
    const idx = answers[lever.id];
    if (idx === undefined) continue;
    const opt = lever.options[idx];
    const maxI = Math.max(...lever.options.map((o) => o.intensity));

    catWeighted[lever.category] =
      (catWeighted[lever.category] ?? 0) + opt.intensity * lever.weight;
    catMax[lever.category] = (catMax[lever.category] ?? 0) + maxI * lever.weight;

    if (lever.tier === "multiplier") {
      multiplier += opt.intensity * MULTIPLIER_STEP;
      if (opt.intensity >= 3) flags.push(shortName(lever));
    } else {
      addWeighted += opt.intensity * lever.weight;
      addMax += maxI * lever.weight;
      if (lever.weight === 3 && opt.intensity >= 3) flags.push(shortName(lever));
    }
  }

  const baseIntensity = addMax ? (addWeighted / addMax) * 100 : 0;
  const finalIntensity = Math.min(baseIntensity * multiplier, 120);

  // Philosophical spectrum
  let specSum = 0;
  let specN = 0;
  for (const lever of LEVERS) {
    const idx = answers[lever.id];
    if (idx === undefined) continue;
    const s = lever.options[idx].spectrum;
    if (s !== undefined) {
      specSum += s;
      specN++;
    }
  }
  const spectrum = specN ? specSum / specN : 50;

  // Verdict: sustainable human capacity tops out ~90%.
  let verdict: Result["verdict"];
  if (finalIntensity < 40) verdict = 5;
  else if (finalIntensity < 55) verdict = 4;
  else if (finalIntensity < 70) verdict = 3;
  else if (finalIntensity < 90) verdict = 2;
  else verdict = 1;

  return {
    baseIntensity: Math.round(baseIntensity),
    multiplier: Math.round(multiplier * 100) / 100,
    finalIntensity: Math.round(finalIntensity),
    categoryScores: CATEGORIES.map((c) => ({
      category: c,
      pct: catMax[c] ? Math.round(((catWeighted[c] ?? 0) / catMax[c]) * 100) : 0,
    })),
    spectrum: Math.round(spectrum),
    verdict,
    verdictLabel: VERDICT_LABELS[verdict],
    flags,
  };
}

// Manual board values: leverId -> 1–10 detent position.
// Convert back to the 0–4 intensity scale and run the same weighted logic.
export function scoreFromManual(values: Record<string, number>): Result {
  let addWeighted = 0;
  let addMax = 0;
  let multiplier = 1;
  const flags: string[] = [];

  const catWeighted: Record<string, number> = {};
  const catMax: Record<string, number> = {};

  let specSum = 0;
  let specN = 0;

  for (const lever of LEVERS) {
    const v = values[lever.id] ?? 5;
    const raw = ((v - 1) / 9) * 4; // 1–10 -> 0–4
    const maxI = Math.max(...lever.options.map((o) => o.intensity));
    const intensity = Math.min(raw, maxI); // stay within this lever's real range

    catWeighted[lever.category] =
      (catWeighted[lever.category] ?? 0) + intensity * lever.weight;
    catMax[lever.category] = (catMax[lever.category] ?? 0) + maxI * lever.weight;

    if (lever.tier === "multiplier") {
      multiplier += intensity * MULTIPLIER_STEP;
      if (intensity >= 3) flags.push(shortName(lever));
    } else {
      addWeighted += intensity * lever.weight;
      addMax += maxI * lever.weight;
      if (lever.weight === 3 && intensity >= 3) flags.push(shortName(lever));
    }

    // Philosophical spectrum: use the spectrum of the option nearest in intensity.
    const specOpts = lever.options.filter((o) => o.spectrum !== undefined);
    if (specOpts.length) {
      const nearest = specOpts.reduce((a, b) =>
        Math.abs(b.intensity - intensity) < Math.abs(a.intensity - intensity) ? b : a
      );
      specSum += nearest.spectrum!;
      specN++;
    }
  }

  const baseIntensity = addMax ? (addWeighted / addMax) * 100 : 0;
  const finalIntensity = Math.min(baseIntensity * multiplier, 120);
  const spectrum = specN ? specSum / specN : 50;

  let verdict: Result["verdict"];
  if (finalIntensity < 40) verdict = 5;
  else if (finalIntensity < 55) verdict = 4;
  else if (finalIntensity < 70) verdict = 3;
  else if (finalIntensity < 90) verdict = 2;
  else verdict = 1;

  return {
    baseIntensity: Math.round(baseIntensity),
    multiplier: Math.round(multiplier * 100) / 100,
    finalIntensity: Math.round(finalIntensity),
    categoryScores: CATEGORIES.map((c) => ({
      category: c,
      pct: catMax[c] ? Math.round(((catWeighted[c] ?? 0) / catMax[c]) * 100) : 0,
    })),
    spectrum: Math.round(spectrum),
    verdict,
    verdictLabel: VERDICT_LABELS[verdict],
    flags,
  };
}

function shortName(l: Lever): string {
  const names: Record<string, string> = {
    surveillance: "Surveillance intensity",
    "family-fit": "Family fit",
    visa: "Visa stability",
    "skill-model-match": "Skill-to-model match",
    "locals-likeminded": "Like-minded locals",
  };
  return names[l.id] ?? l.id;
}
