"use client";

// Global error boundary. The most common cause of a client-side crash here
// is stale saved data from an older version of the lever model, so offer a
// one-click way out.
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const clearAndReload = () => {
    try {
      for (const k of Object.keys(localStorage)) {
        if (k.startsWith("b4t-")) localStorage.removeItem(k);
      }
    } catch {}
    window.location.href = "/";
  };

  return (
    <main className="shell">
      <header className="masthead">
        <div className="eyebrow">Business for Transformation</div>
        <h1>Something broke</h1>
        <p className="sub">
          This is usually saved data from an older version of the levers.
          Clearing it fixes it — your quiz will restart.
        </p>
        <hr className="rule" />
      </header>
      <div className="card" style={{ textAlign: "center" }}>
        <div className="nav" style={{ justifyContent: "center" }}>
          <button className="btn ghost" onClick={() => reset()}>
            Try again
          </button>
          <button className="btn" onClick={clearAndReload}>
            Clear saved data &amp; restart
          </button>
        </div>
      </div>
    </main>
  );
}
