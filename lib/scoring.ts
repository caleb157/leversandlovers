import { LEVERS, CATEGORIES, Lever, Category } from "./levers";

export type Answers = Record<string, number>; // leverId -> option index

export interface CategoryScore {
  category: Category;
  pct: number; // 0–100 intensity for this category
}

export interface Result {
  finalIntensity: number; // 0–100 weighted intensity
  categoryScores: CategoryScore[];
  verdict: 1 | 2 | 3 | 4 | 5;
  verdictLabel: string;
  flags: string[]; // heavy (weight 4+) levers currently running hot
}

// Verdict = intensity rating, 1 (calm) – 5 (most intense).
const VERDICT_LABELS: Record<number, string> = {
  1: "Green — the lever combination is well within sustainable capacity. Build.",
  2: "Favorable — intensity is real but bounded. Build, and watch your flagged levers.",
  3: "Contested — you are near the edge of sustainable capacity. Redesign one or two heavy levers before committing.",
  4: "Overloaded — this combination runs above 90% capacity. Change the context, the model, or the philosophy before proceeding.",
  5: "Red — the current lever combination is not sustainably endurable. Do not build this as designed.",
};

function verdictFor(finalIntensity: number): Result["verdict"] {
  if (finalIntensity < 40) return 1;
  if (finalIntensity < 55) return 2;
  if (finalIntensity < 70) return 3;
  if (finalIntensity < 90) return 4;
  return 5;
}

function buildResult(
  addWeighted: number,
  addMax: number,
  catWeighted: Record<string, number>,
  catMax: Record<string, number>,
  flags: string[]
): Result {
  const finalIntensity = Math.round(addMax ? (addWeighted / addMax) * 100 : 0);
  const verdict = verdictFor(finalIntensity);
  return {
    finalIntensity,
    categoryScores: CATEGORIES.map((c) => ({
      category: c,
      pct: catMax[c] ? Math.round(((catWeighted[c] ?? 0) / catMax[c]) * 100) : 0,
    })),
    verdict,
    verdictLabel: VERDICT_LABELS[verdict],
    flags,
  };
}

export function score(answers: Answers, levers: Lever[] = LEVERS): Result {
  let addWeighted = 0;
  let addMax = 0;
  const flags: string[] = [];
  const catWeighted: Record<string, number> = {};
  const catMax: Record<string, number> = {};

  for (const lever of levers) {
    const idx = answers[lever.id];
    if (idx === undefined) continue;
    const opt = lever.options[idx];
    const maxI = Math.max(...lever.options.map((o) => o.intensity));

    addWeighted += opt.intensity * lever.weight;
    addMax += maxI * lever.weight;
    catWeighted[lever.category] =
      (catWeighted[lever.category] ?? 0) + opt.intensity * lever.weight;
    catMax[lever.category] = (catMax[lever.category] ?? 0) + maxI * lever.weight;

    if (lever.weight >= 4 && opt.intensity >= 3) flags.push(lever.name);
  }

  return buildResult(addWeighted, addMax, catWeighted, catMax, flags);
}

// Manual board values: leverId -> 1–5 detent position, mapped proportionally
// onto each lever's own intensity range (detent 1 = min, detent 5 = its max).
export function scoreFromManual(
  values: Record<string, number>,
  levers: Lever[] = LEVERS
): Result {
  let addWeighted = 0;
  let addMax = 0;
  const flags: string[] = [];
  const catWeighted: Record<string, number> = {};
  const catMax: Record<string, number> = {};

  for (const lever of levers) {
    const v = values[lever.id] ?? 3;
    const maxI = Math.max(...lever.options.map((o) => o.intensity));
    const intensity = ((v - 1) / 4) * maxI;

    addWeighted += intensity * lever.weight;
    addMax += maxI * lever.weight;
    catWeighted[lever.category] =
      (catWeighted[lever.category] ?? 0) + intensity * lever.weight;
    catMax[lever.category] = (catMax[lever.category] ?? 0) + maxI * lever.weight;

    if (lever.weight >= 4 && intensity >= 3) flags.push(lever.name);
  }

  return buildResult(addWeighted, addMax, catWeighted, catMax, flags);
}
