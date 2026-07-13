"use client";

import { useEffect, useMemo, useState } from "react";
import { LEVERS, CATEGORIES, CATEGORY_BLURBS, Category } from "../lib/levers";
import { score, Answers, Result } from "../lib/scoring";
import { applyOverrides } from "../lib/overrides";

const STEPS = ["Pitch", ...CATEGORIES, "Results"] as const;

export default function Page() {
  const [step, setStep] = useState(0);
  const [pitch, setPitch] = useState("");
  const [valueProp, setValueProp] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [synth, setSynth] = useState("");
  const [loading, setLoading] = useState(false);
  const [synthErr, setSynthErr] = useState("");
  const [levers, setLevers] = useState(LEVERS);

  useEffect(() => {
    setLevers(applyOverrides());
  }, []);

  const currentCat =
    step >= 1 && step <= CATEGORIES.length ? CATEGORIES[step - 1] : null;
  const catLevers = useMemo(
    () => (currentCat ? levers.filter((l) => l.category === currentCat) : []),
    [currentCat, levers]
  );
  const catComplete = catLevers.every((l) => answers[l.id] !== undefined);
  const result: Result | null =
    step === STEPS.length - 1 ? score(answers, levers) : null;

  async function runSynthesis(r: Result) {
    setLoading(true);
    setSynthErr("");
    try {
      const answersSummary = levers.filter((l) => answers[l.id] !== undefined)
        .map((l) => `- [${l.category}] ${l.question} → ${l.options[answers[l.id]].label}`)
        .join("\n");
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitch, valueProp, answersSummary, result: r }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSynth(data.synthesis);
    } catch (e: any) {
      setSynthErr(
        "Synthesis failed. Check that ANTHROPIC_API_KEY is set in your Vercel environment variables."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <header className="masthead">
        <div className="eyebrow">Business for Transformation</div>
        <h1>The Levers of B4T</h1>
        <p className="sub">
          Every lever you pull adds intensity. Find the combination your
          context demands — and your capacity can carry.
        </p>
        <hr className="rule" />
      </header>

      <div className="ticks" aria-hidden>
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`tick ${i < step ? "done" : ""} ${i === step ? "now" : ""}`}
          />
        ))}
      </div>

      {step === 0 && (
        <section className="card">
          <div className="cat-header">
            <h2>Your Idea</h2>
            <span className="count">Step 1 of {STEPS.length}</span>
          </div>
          <p className="cat-blurb">
            Write it down before you measure it. The synthesis at the end will
            test this pitch against your lever answers.
          </p>
          <label className="lbl" htmlFor="pitch">Elevator pitch</label>
          <textarea
            id="pitch"
            className="text"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="We make ____ for ____ who struggle with ____…"
          />
          <label className="lbl" htmlFor="vp">Value proposition hypothesis</label>
          <textarea
            id="vp"
            className="text"
            value={valueProp}
            onChange={(e) => setValueProp(e.target.value)}
            placeholder="Customers will pay because…"
          />
          <div className="nav">
            <a className="btn ghost" href="/board">
              Skip the quiz — browse all the levers
            </a>
            <button className="btn" onClick={() => setStep(1)}>
              Begin the levers →
            </button>
          </div>
        </section>
      )}

      {currentCat && (
        <section className="card">
          <div className="cat-header">
            <h2>{currentCat} Levers</h2>
            <span className="count">
              {catLevers.filter((l) => answers[l.id] !== undefined).length}/
              {catLevers.length} answered
            </span>
          </div>
          <p className="cat-blurb">{CATEGORY_BLURBS[currentCat]}</p>

          {catLevers.map((l) => (
            <div className="q" key={l.id}>
              <p className="qtext">{l.question}</p>
              <p className="wt">Weight {l.weight}</p>
              <div className="opts" role="radiogroup" aria-label={l.question}>
                {l.options.map((o, i) => (
                  <button
                    key={i}
                    className={`opt ${answers[l.id] === i ? "sel" : ""}`}
                    onClick={() => setAnswers({ ...answers, [l.id]: i })}
                    role="radio"
                    aria-checked={answers[l.id] === i}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="nav">
            <button className="btn ghost" onClick={() => setStep(step - 1)}>
              ← Back
            </button>
            <button
              className="btn"
              disabled={!catComplete}
              onClick={() => setStep(step + 1)}
            >
              {step === CATEGORIES.length ? "See the panel →" : "Next →"}
            </button>
          </div>
        </section>
      )}

      {result && (
        <>
          <section className="card">
            <div className="cat-header">
              <h2>The Panel</h2>
              <span className="count">{result.finalIntensity} intensity</span>
            </div>
            <p className="verdict-num">
              {result.verdict}
              <span className="verdict-of"> / 5</span>
            </p>
            <p className="verdict-label">{result.verdictLabel}</p>

            <div className="gauges">
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

            {result.flags.length > 0 && (
              <div className="flags">
                <p className="small">Levers currently running hot:</p>
                {result.flags.map((f) => (
                  <span className="flag" key={f}>{f}</span>
                ))}
              </div>
            )}
            <div className="nav">
              <button className="btn ghost" onClick={() => setStep(step - 1)}>
                ← Adjust answers
              </button>
              <button
                className="btn"
                onClick={() => runSynthesis(result)}
                disabled={loading}
              >
                {loading ? "Analyzing…" : "Run strategy synthesis"}
              </button>
              <button
                className="btn"
                onClick={() => {
                  localStorage.setItem("b4t-answers", JSON.stringify(answers));
                  window.location.href = "/board";
                }}
              >
                Explore your levers →
              </button>
            </div>
          </section>

          {(synth || synthErr) && (
            <section className="card">
              <div className="cat-header">
                <h2>Synthesis</h2>
                <span className="count">SWOT · Five Forces · Value Chain</span>
              </div>
              {synthErr ? (
                <p className="note">{synthErr}</p>
              ) : (
                <div className="synth">{synth}</div>
              )}
            </section>
          )}
        </>
      )}
      <a className="admin-dot" href="/admin" aria-label="Editor view">
        ⚙
      </a>
    </main>
  );
}
