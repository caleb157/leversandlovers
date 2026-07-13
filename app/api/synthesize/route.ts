import { NextRequest, NextResponse } from "next/server";

// Requires ANTHROPIC_API_KEY set in Vercel project env vars.
export async function POST(req: NextRequest) {
  const { pitch, valueProp, answersSummary, result } = await req.json();

  const prompt = `You are a strategy analyst for B4T (Business for Transformation) ventures — real businesses in hard places that also aim at spiritual and social transformation.

ELEVATOR PITCH: ${pitch || "(not provided)"}
VALUE PROPOSITION HYPOTHESIS: ${valueProp || "(not provided)"}

LEVER QUIZ RESULTS:
- Final intensity: ${result.finalIntensity}/100 (base ${result.baseIntensity} × multiplier ${result.multiplier})
- Verdict: ${result.verdict}/5 — ${result.verdictLabel}
- Category intensities: ${result.categoryScores.map((c: any) => `${c.category} ${c.pct}%`).join(", ")}
- Philosophy spectrum: ${result.spectrum}/100 (0 = traveling on business, 100 = traveling on mission)
- Hot levers: ${result.flags.join(", ") || "none"}

FULL ANSWERS:
${answersSummary}

Produce a synthesis in markdown with these sections:
1. **Porter's Five Forces** — each force in 1–2 sentences, grounded in the answers.
2. **SWOT** — four short bullet lists, drawing directly on the lever answers (e.g., a long cash cycle is a Weakness; a known large customer is a Strength).
3. **Value Chain** — which 2–3 activities are this venture's likely margin and transformation leverage points, and which are its fragile links.
4. **Validity verdict** — 3–5 sentences: given intensity, philosophy position, and the strategic picture, should they keep going? What single lever redesign would most improve the picture?

Be concrete and honest. Do not flatter.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }
  const data = await res.json();
  const text = (data.content ?? [])
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("\n");
  return NextResponse.json({ synthesis: text });
}
