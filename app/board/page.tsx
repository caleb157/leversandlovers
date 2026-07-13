"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LEVERS,
  CATEGORIES,
  CATEGORY_BLURBS,
  Lever,
} from "../../lib/levers";
import { Answers, scoreFromManual } from "../../lib/scoring";
import { applyOverrides } from "../../lib/overrides";

const ANSWERS_KEY = "b4t-answers";
const MANUAL_KEY = "b4t-manual";
const DETENTS = 10;

// Map a quiz answer's 0–4 intensity onto the 1–10 detent scale.
function seedFromAnswers(
  answers: Answers,
  levers: Lever[]
): Record<string, number> {
  const values: Record<string, number> = {};
  for (const lever of levers) {
    const idx = answers[lever.id];
    if (idx === undefined || !lever.options[idx]) {
      values[lever.id] = 5;
    } else {
      values[lever.id] = Math.round((lever.options[idx].intensity / 4) * 9 + 1);
    }
  }
  return values;
}

function loadInitial(levers: Lever[]): Record<string, number> {
  let answers: Answers = {};
  try {
    answers = JSON.parse(localStorage.getItem(ANSWERS_KEY) ?? "{}");
  } catch {}
  const seeded = seedFromAnswers(answers, levers);
  try {
    const manual = JSON.parse(localStorage.getItem(MANUAL_KEY) ?? "null");
    if (manual && typeof manual === "object") {
      for (const lever of levers) {
        const v = manual[lever.id];
        if (typeof v === "number" && v >= 1 && v <= DETENTS) {
          seeded[lever.id] = Math.round(v);
        }
      }
    }
  } catch {}
  return seeded;
}

// ─── The skeuomorphic lever control ───
function LeverControl({
  value,
  hot,
  label,
  onChange,
}: {
  value: number;
  hot: boolean;
  label: string;
  onChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const valueFromClientY = useCallback((clientY: number) => {
    const el = trackRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const frac = 1 - (clientY - rect.top) / rect.height; // bottom = 1, top = 10
    return Math.min(DETENTS, Math.max(1, Math.round(frac * (DETENTS - 1) + 1)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const v = valueFromClientY(e.clientY);
    if (v !== null) onChange(v);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const v = valueFromClientY(e.clientY);
    if (v !== null) onChange(v);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      onChange(Math.min(DETENTS, value + 1));
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      onChange(Math.max(1, value - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      onChange(1);
    } else if (e.key === "End") {
      e.preventDefault();
      onChange(DETENTS);
    }
  };

  // knob center position as % from bottom
  const pct = ((value - 1) / (DETENTS - 1)) * 100;

  return (
    <div className="lever-ctl">
      <div
        ref={trackRef}
        className="lever-track"
        role="slider"
        tabIndex={0}
        aria-label={`${label} intensity`}
        aria-valuemin={1}
        aria-valuemax={DETENTS}
        aria-valuenow={value}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <div className="lever-slot" aria-hidden />
        {Array.from({ length: DETENTS }, (_, i) => (
          <div
            key={i}
            className="lever-detent"
            aria-hidden
            style={{ bottom: `${(i / (DETENTS - 1)) * 100}%` }}
          />
        ))}
        <div
          className={`lever-knob ${hot ? "hot" : ""}`}
          aria-hidden
          style={{ bottom: `${pct}%` }}
        >
          <div className="lever-knob-grip" />
        </div>
      </div>
      <div className={`lever-val ${hot ? "hot" : ""}`}>{value}</div>
    </div>
  );
}

// ─── One expandable lever row ───
function LeverRow({
  lever,
  value,
  open,
  onToggle,
  onChange,
}: {
  lever: Lever;
  value: number;
  open: boolean;
  onToggle: () => void;
  onChange: (v: number) => void;
}) {
  const hot = value >= 8;
  return (
    <div className={`lrow ${open ? "open" : ""}`}>
      <button
        className="lrow-head"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`lever-panel-${lever.id}`}
      >
        <span className={`chip chip-${lever.category.toLowerCase()}`} aria-hidden />
        <span className="lrow-name">{lever.name}</span>
        <span className="lrow-wt">
          Weight {lever.weight}
          {lever.tier === "multiplier" ? " · multiplier" : ""}
        </span>
        <span className={`lrow-val ${hot ? "hot" : ""}`}>{value}</span>
        <span className="lrow-caret" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="lrow-body" id={`lever-panel-${lever.id}`}>
          <p className="lrow-desc">{lever.description}</p>
          <div className="lrow-grid">
            <div className="lrow-pros">
              <div>
                <h4>
                  {lever.category === "Environmental"
                    ? "High intensity looks like"
                    : "Why pull it up"}
                </h4>
                <ul>
                  {lever.prosCons.up.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>
                  {lever.category === "Environmental"
                    ? "Low intensity looks like"
                    : "Why ease it down"}
                </h4>
                <ul>
                  {lever.prosCons.down.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
            <LeverControl
              value={value}
              hot={hot}
              label={lever.name}
              onChange={onChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function BoardPage() {
  const [values, setValues] = useState<Record<string, number> | null>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [levers, setLevers] = useState(LEVERS);

  useEffect(() => {
    const merged = applyOverrides();
    setLevers(merged);
    setValues(loadInitial(merged));
  }, []);

  useEffect(() => {
    if (values) localStorage.setItem(MANUAL_KEY, JSON.stringify(values));
  }, [values]);

  const result = useMemo(
    () => (values ? scoreFromManual(values, levers) : null),
    [values, levers]
  );

  if (!values || !result) {
    return (
      <main className="shell">
        <p className="small" style={{ textAlign: "center", marginTop: 60 }}>
          Loading the board…
        </p>
      </main>
    );
  }

  const setLever = (id: string, v: number) =>
    setValues((prev) => ({ ...(prev ?? {}), [id]: v }));

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const resetToQuiz = () => {
    localStorage.removeItem(MANUAL_KEY);
    let answers: Answers = {};
    try {
      answers = JSON.parse(localStorage.getItem(ANSWERS_KEY) ?? "{}");
    } catch {}
    setValues(seedFromAnswers(answers, levers));
  };

  return (
    <main className="shell">
      <header className="masthead">
        <div className="eyebrow">Business for Transformation</div>
        <h1>The Lever Board</h1>
        <p className="sub">
          Every lever, on one panel. Pull them yourself and watch the intensity
          respond.
        </p>
        <hr className="rule" />
      </header>

      <div className="board-strip card">
        <div className="strip-main">
          <div className="strip-verdict">
            <span className="strip-num">{result.verdict}</span>
            <span className="strip-of">/5</span>
          </div>
          <div className="strip-detail">
            <div className="strip-intensity ui">
              {result.finalIntensity} intensity
              <span className="strip-breakdown">
                {" "}
                — base {result.baseIntensity} × {result.multiplier}
              </span>
            </div>
            <p className="strip-label">{result.verdictLabel}</p>
          </div>
        </div>
        <div className="gauges strip-gauges">
          {result.categoryScores.map((c) => (
            <div className="gauge" key={c.category}>
              <div className="track">
                <div
                  className={`fill ${c.pct >= 70 ? "hot" : ""}`}
                  style={{ height: `${c.pct}%` }}
                />
              </div>
              <div className="pct">{c.pct}%</div>
              <div className="name">{c.category}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="board-actions">
        <a className="btn ghost" href="/">
          ← Back to the quiz
        </a>
        <button className="btn ghost" onClick={resetToQuiz}>
          Reset to quiz answers
        </button>
      </div>

      {CATEGORIES.map((cat) => {
        const catLevers = levers.filter((l) => l.category === cat);
        const catScore = result.categoryScores.find(
          (c) => c.category === cat
        );
        return (
          <section className="card" key={cat}>
            <div className="cat-header">
              <h2>{cat}</h2>
              <span className="count">{catScore?.pct ?? 0}% intensity</span>
            </div>
            <p className="cat-blurb">{CATEGORY_BLURBS[cat]}</p>
            {catLevers.map((l) => (
              <LeverRow
                key={l.id}
                lever={l}
                value={values[l.id] ?? 5}
                open={openIds.has(l.id)}
                onToggle={() => toggle(l.id)}
                onChange={(v) => setLever(l.id, v)}
              />
            ))}
          </section>
        );
      })}
      <a className="admin-dot" href="/admin" aria-label="Editor view">
        ⚙
      </a>
    </main>
  );
}
