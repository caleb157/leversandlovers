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

export function loadOverrides(): Overrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return raw && typeof raw === "object" ? raw : {};
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
