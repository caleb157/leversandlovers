"use client";

import { useState } from "react";

export default function GatePage() {
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Middleware validates the value; a wrong code just bounces back here.
    document.cookie = `b4t-site=${encodeURIComponent(code)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    fetch("/", { method: "HEAD", redirect: "manual" }).then((r) => {
      if (r.type === "opaqueredirect" || r.status === 0 || r.status >= 300) {
        setWrong(true);
      } else {
        window.location.href = "/";
      }
    });
  };

  return (
    <main className="shell">
      <header className="masthead">
        <div className="eyebrow">Business for Transformation</div>
        <h1>The Levers of B4T</h1>
        <p className="sub">This tool is passcode-protected.</p>
        <hr className="rule" />
      </header>
      <form className="card gate" onSubmit={submit}>
        <label className="lbl" htmlFor="site-pc">
          Passcode
        </label>
        <input
          id="site-pc"
          className="text"
          type="password"
          autoFocus
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setWrong(false);
          }}
        />
        {wrong && <p className="small gate-err">That's not it.</p>}
        <div className="nav">
          <span />
          <button className="btn" type="submit">
            Enter
          </button>
        </div>
      </form>
    </main>
  );
}
