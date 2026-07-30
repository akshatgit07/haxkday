// Thin client for the FastAPI backend (src/haxkday/api).

import type { AnalysisRequest, InvestmentMemo } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export class AnalyzeError extends Error {}

export async function analyze(request: AnalysisRequest): Promise<InvestmentMemo> {
  const response = await fetch(`${BACKEND_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new AnalyzeError(`Analysis failed (${response.status}): ${detail}`);
  }

  return response.json();
}
