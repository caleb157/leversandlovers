// Editor/admin overrides — stored in localStorage, layered over the
// hard-coded LEVERS at runtime. Export the JSON from /admin to make
// edits permanent in lib/levers.ts.
import { Lever, LEVERS } from "./levers";

export interface OptionOverride {
  label?: string;
  intensity?: number;
}

export interface LeverOverride {
  name?: string;
  question?: string;
  description?: string;
  weight?: 1 | 2 | 3 | 4 | 5;
  options?: OptionOverride[];
  up?: string[];
  down?: string[];
}

export type Overrides = Record<string, LeverOverride>;

const KEY = "b4t-overrides";

// Drop any stored fields whose shape no longer matches the current data
// model (e.g. edits saved before an options rescale) instead of crashing.
function sanitize(raw: unknown): Overrides {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const clean: Overrides = {};
  for (const [id, v] of Object.entries(raw as Record<string, unknown>)) {
    const base = LEVERS.find((l) => l.id === id);
    if (!base || !v || typeof v !== "object" || Array.isArray(v)) continue;
    const o = v as Record<string, unknown>;
    const entry: LeverOverride = {};
    if (typeof o.name === "string") entry.name = o.name;
    if (typeof o.question === "string") entry.question = o.question;
    if (typeof o.description === "string") entry.description = o.description;
    if (
      typeof o.weight === "number" &&
      Number.isInteger(o.weight) &&
      o.weight >= 1 &&
      o.weight <= 5
    )
      entry.weight = o.weight as LeverOverride["weight"];
    if (
      Array.isArray(o.options) &&
      o.options.length === base.options.length &&
      o.options.every(
        (x) => x && typeof x === "object" && !Array.isArray(x)
      )
    )
      entry.options = o.options as OptionOverride[];
    if (Array.isArray(o.up) && o.up.every((s) => typeof s === "string"))
      entry.up = o.up as string[];
    if (Array.isArray(o.down) && o.down.every((s) => typeof s === "string"))
      entry.down = o.down as string[];
    if (Object.keys(entry).length) clean[id] = entry;
  }
  return clean;
}

export function loadOverrides(): Overrides {
  if (typeof window === "undefined") return {};
  try {
    return sanitize(JSON.parse(localStorage.getItem(KEY) ?? "{}"));
  } catch {
    return {};
  }
}

export function saveOverrides(o: Overrides) {
  localStorage.setItem(KEY, JSON.stringify(o));
}

export function clearOverrides() {
  localStorage.removeItem(KEY);
}

export function applyOverrides(overrides?: Overrides): Lever[] {
  const o = overrides ?? loadOverrides();
  if (!Object.keys(o).length) return LEVERS;
  return LEVERS.map((lever) => {
    const ov = o[lever.id];
    if (!ov) return lever;
    return {
      ...lever,
      name: ov.name ?? lever.name,
      question: ov.question ?? lever.question,
      description: ov.description ?? lever.description,
      weight: ov.weight ?? lever.weight,
      options: lever.options.map((opt, i) => ({
        ...opt,
        label: ov.options?.[i]?.label ?? opt.label,
        intensity: ov.options?.[i]?.intensity ?? opt.intensity,
      })),
      prosCons: {
        up: ov.up ?? lever.prosCons.up,
        down: ov.down ?? lever.prosCons.down,
      },
    };
  });
}
