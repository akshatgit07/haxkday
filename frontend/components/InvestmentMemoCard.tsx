import type { InvestmentMemo } from "@/lib/types";

const RECOMMENDATION_STYLES: Record<InvestmentMemo["recommendation"], string> = {
  BUY: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  HOLD: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  SELL: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800",
};

export default function InvestmentMemoCard({ memo }: { memo: InvestmentMemo }) {
  return (
    <div className="w-full max-w-2xl rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200 p-5 dark:border-neutral-800">
        <span className="font-mono text-xl font-semibold tracking-wide">{memo.ticker}</span>
        <div className="flex items-center gap-4">
          <span
            className={`rounded-full border px-3 py-1 text-sm font-semibold ${RECOMMENDATION_STYLES[memo.recommendation]}`}
          >
            {memo.recommendation}
          </span>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-neutral-500">Confidence</div>
            <div className="font-mono text-lg font-semibold">{memo.confidence_pct.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5">
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Executive Summary
          </h3>
          <p className="text-sm text-neutral-800 dark:text-neutral-200">{memo.executive_summary}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border-t-2 border-emerald-500 bg-neutral-50 p-4 dark:bg-neutral-800/50">
            <h3 className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">Bull case</h3>
            <ul className="space-y-1.5 text-sm text-neutral-700 dark:text-neutral-300">
              {memo.bull_case.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-emerald-500">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border-t-2 border-rose-500 bg-neutral-50 p-4 dark:bg-neutral-800/50">
            <h3 className="mb-2 text-sm font-semibold text-rose-700 dark:text-rose-400">Bear case</h3>
            <ul className="space-y-1.5 text-sm text-neutral-700 dark:text-neutral-300">
              {memo.bear_case.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-rose-500">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Key Risks</h3>
          <div className="flex flex-wrap gap-2">
            {memo.key_risks.map((risk) => (
              <span
                key={risk}
                className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                {risk}
              </span>
            ))}
          </div>
        </div>

        {(memo.sources.length > 0 || memo.data_gaps.length > 0) && (
          <div className="space-y-1 border-t border-neutral-200 pt-4 text-xs dark:border-neutral-800">
            {memo.sources.map((source) => (
              <p key={source} className="text-neutral-500 dark:text-neutral-400">
                Source: {source}
              </p>
            ))}
            {memo.data_gaps.map((gap) => (
              <p key={gap} className="text-amber-600 dark:text-amber-500">
                Note: {gap}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
