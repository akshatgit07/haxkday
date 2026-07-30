import type { ScenarioResult } from "@/lib/types";

export default function ScenarioResultCard({ result, summary }: { result: ScenarioResult; summary: string }) {
  const declined = result.margin_delta_pct < 0;
  return (
    <div className="w-full max-w-2xl rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">Scenario Model</h3>
      <p className="mb-4 text-sm text-neutral-800 dark:text-neutral-200">{summary}</p>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
          <div className="text-xs text-neutral-500">Base margin</div>
          <div className="font-mono text-lg font-semibold">{result.base_margin_pct.toFixed(1)}%</div>
        </div>
        <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
          <div className="text-xs text-neutral-500">New margin</div>
          <div className="font-mono text-lg font-semibold">{result.new_margin_pct.toFixed(1)}%</div>
        </div>
        <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
          <div className="text-xs text-neutral-500">Change</div>
          <div
            className={`font-mono text-lg font-semibold ${declined ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}
          >
            {declined ? "" : "+"}
            {result.margin_delta_pct.toFixed(1)} pts
          </div>
        </div>
      </div>
    </div>
  );
}
