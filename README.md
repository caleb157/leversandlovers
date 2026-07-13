# The Levers of B4T

Quiz → intensity panel → 1–5 keep-going verdict → Claude-powered SWOT / Five Forces / Value Chain synthesis.

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. Import into Vercel (framework auto-detected: Next.js).
3. Add environment variable `ANTHROPIC_API_KEY` (Project → Settings → Environment Variables).
4. Deploy.

## Local dev
```
npm install
ANTHROPIC_API_KEY=sk-... npm run dev
```

## Model
- Additive levers: weighted (1–3) intensity sum, normalized to 0–100 base intensity.
- Multiplier levers (surveillance, family fit, visa): each intensity point multiplies base by +12.5%.
- Verdict bands: <40 → 5, <55 → 4, <70 → 3, <90 → 2, ≥90 → 1 (sustainable human capacity ≈ 90%).
- Philosophical levers also plot a 0–100 business ↔ mission spectrum.

Edit levers/weights in `lib/levers.ts`; scoring in `lib/scoring.ts`.
