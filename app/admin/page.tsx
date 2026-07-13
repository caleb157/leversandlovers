"use client";

import { useEffect, useMemo, useState } from "react";
import { LEVERS, CATEGORIES } from "../../lib/levers";
import {
  Overrides,
  LeverOverride,
  loadOverrides,
  saveOverrides,
  clearOverrides,
  applyOverrides,
} from "../../lib/overrides";

export default function AdminPage() {
  const [overrides, setOverrides] = useState<Overrides | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOverrides(loadOverrides());
  }, []);

  const levers = useMemo(
    () => (overrides ? applyOverrides(overrides) : LEVERS),
    [overrides]
  );

  if (!overrides) {
    return (
      <main className="shell">
        <p className="small" style={{ textAlign: "center", marginTop: 60 }}>
          Loading the editor…
        </p>
      </main>
    );
  }

  const editedCount = Object.keys(overrides).length;

  const update = (id: string, patch: Partial<LeverOverride>) => {
    setOverrides((prev) => {
      const next = { ...(prev ?? {}), [id]: { ...(prev?.[id] ?? {}), ...patch } };
      saveOverrides(next);
      return next;
    });
  };

  const updateOption = (
    id: string,
    optIdx: number,
    patch: { label?: string; intensity?: number }
  ) => {
    const base = LEVERS.find((l) => l.id === id)!;
    const current =
      overrides[id]?.options ?? base.options.map(() => ({}));
    const nextOpts = current.map((o, i) =>
      i === optIdx ? { ...o, ...patch } : o
    );
    update(id, { options: nextOpts });
  };

  const resetLever = (id: string) => {
    setOverrides((prev) => {
      const next = { ...(prev ?? {}) };
      delete next[id];
      saveOverrides(next);
      return next;
    });
  };

  const resetAll = () => {
    if (!confirm("Discard all edits and return to the built-in lever data?"))
      return;
    clearOverrides();
    setOverrides({});
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(overrides, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="shell">
      <header className="masthead">
        <div className="eyebrow">Editor View</div>
        <h1>Lever Editor</h1>
        <p className="sub">
          Edits save to this browser instantly and apply to the quiz and the
          board. To make them permanent for everyone, copy the JSON and bake it
          into the code.
        </p>
        <hr className="rule" />
      </header>

      <div className="board-strip card admin-bar">
        <span className="ui admin-status">
          {editedCount === 0
            ? "No edits — showing built-in data"
            : `${editedCount} lever${editedCount === 1 ? "" : "s"} edited (this browser only)`}
        </span>
        <div className="admin-bar-btns">
          <a className="btn ghost" href="/board">
            View board
          </a>
          <button
            className="btn ghost"
            onClick={resetAll}
            disabled={editedCount === 0}
          >
            Reset all
          </button>
          <button
            className="btn"
            onClick={copyJson}
            disabled={editedCount === 0}
          >
            {copied ? "Copied ✓" : "Copy edits as JSON"}
          </button>
        </div>
      </div>

      {CATEGORIES.map((cat) => (
        <section className="card" key={cat}>
          <div className="cat-header">
            <h2>{cat}</h2>
            <span className="count">
              {levers.filter((l) => l.category === cat).length} levers
            </span>
          </div>
          {levers
            .filter((l) => l.category === cat)
            .map((l) => {
              const edited = !!overrides[l.id];
              return (
                <div className={`adm ${edited ? "edited" : ""}`} key={l.id}>
                  <div className="adm-head">
                    <input
                      className="adm-name ui"
                      value={l.name}
                      onChange={(e) => update(l.id, { name: e.target.value })}
                      aria-label="Lever name"
                    />
                    <label className="adm-weight ui">
                      Weight{" "}
                      <select
                        value={l.weight}
                        onChange={(e) =>
                          update(l.id, {
                            weight: Number(e.target.value) as 1 | 2 | 3,
                          })
                        }
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                    </label>
                    {l.tier === "multiplier" && (
                      <span className="lrow-wt">multiplier</span>
                    )}
                    {edited && (
                      <button
                        className="adm-reset ui"
                        onClick={() => resetLever(l.id)}
                      >
                        reset
                      </button>
                    )}
                  </div>

                  <label className="lbl">Question</label>
                  <textarea
                    className="text adm-q"
                    value={l.question}
                    onChange={(e) => update(l.id, { question: e.target.value })}
                  />

                  <label className="lbl">Description</label>
                  <textarea
                    className="text"
                    value={l.description}
                    onChange={(e) =>
                      update(l.id, { description: e.target.value })
                    }
                  />

                  <label className="lbl">Options (label · intensity 0–4)</label>
                  {l.options.map((o, i) => (
                    <div className="adm-opt" key={i}>
                      <input
                        className="text"
                        value={o.label}
                        onChange={(e) =>
                          updateOption(l.id, i, { label: e.target.value })
                        }
                        aria-label={`Option ${i + 1} label`}
                      />
                      <input
                        className="text adm-int"
                        type="number"
                        min={0}
                        max={4}
                        value={o.intensity}
                        onChange={(e) =>
                          updateOption(l.id, i, {
                            intensity: Math.max(
                              0,
                              Math.min(4, Number(e.target.value))
                            ),
                          })
                        }
                        aria-label={`Option ${i + 1} intensity`}
                      />
                    </div>
                  ))}

                  <div className="adm-cols">
                    <div>
                      <label className="lbl">
                        {cat === "Environmental"
                          ? "High intensity looks like"
                          : "Why pull it up"}{" "}
                        (one per line)
                      </label>
                      <textarea
                        className="text"
                        value={l.prosCons.up.join("\n")}
                        onChange={(e) =>
                          update(l.id, {
                            up: e.target.value
                              .split("\n")
                              .filter((s) => s.trim()),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="lbl">
                        {cat === "Environmental"
                          ? "Low intensity looks like"
                          : "Why ease it down"}{" "}
                        (one per line)
                      </label>
                      <textarea
                        className="text"
                        value={l.prosCons.down.join("\n")}
                        onChange={(e) =>
                          update(l.id, {
                            down: e.target.value
                              .split("\n")
                              .filter((s) => s.trim()),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </section>
      ))}
    </main>
  );
}
