"use client";

import Link from "next/link";
import { useState } from "react";

import { analyze, AnalyzeError } from "@/lib/api";
import type { InvestmentMemo } from "@/lib/types";
import InvestmentMemoCard from "@/components/InvestmentMemoCard";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memo, setMemo] = useState<InvestmentMemo | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setMemo(null);

    try {
      const result = await analyze({
        query: query.trim(),
        ticker: ticker.trim() || undefined,
      });
      setMemo(result);
    } catch (err) {
      setError(err instanceof AnalyzeError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center gap-8 p-8">
      <div className="w-full max-w-lg">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">
          ← Morgan
        </Link>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-semibold">Morgan AI</h1>
        <p className="mt-1 text-sm text-neutral-500">Ask a financial question, get an investment memo.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-3">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Should I invest in Nvidia?"
          rows={2}
          className="w-full resize-none rounded-lg border border-neutral-300 p-3 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
        />
        <div className="flex gap-2">
          <input
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Ticker (optional, e.g. NVDA)"
            className="flex-1 rounded-lg border border-neutral-300 p-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-neutral-900"
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </form>

      {error && (
        <p className="w-full max-w-lg rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400">
          {error}
        </p>
      )}

      {memo && <InvestmentMemoCard memo={memo} />}
    </main>
  );
}
