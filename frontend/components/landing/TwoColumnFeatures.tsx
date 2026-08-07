function FilingVisual() {
  return (
    <div className="rounded-xl p-4" style={{ background: "var(--ink-900)" }}>
      <div className="mb-2 flex items-center gap-2">
        <span
          className="rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide"
          style={{ background: "rgba(224, 138, 79, 0.18)", color: "var(--accent-bright)" }}
        >
          10-K
        </span>
        <span className="text-[11px]" style={{ color: "var(--ink-text-muted)" }}>
          Item 7 — MD&amp;A
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="h-2 w-full rounded-full" style={{ background: "var(--ink-800)" }} />
        <div className="h-2 w-11/12 rounded-full" style={{ background: "var(--ink-800)" }} />
        <div
          className="h-2 w-4/5 rounded-full"
          style={{ background: "rgba(224, 138, 79, 0.35)" }}
        />
        <div className="h-2 w-full rounded-full" style={{ background: "var(--ink-800)" }} />
        <div className="h-2 w-3/5 rounded-full" style={{ background: "var(--ink-800)" }} />
      </div>
    </div>
  );
}

function ConsensusVisual() {
  const rows = [
    { label: "Price", value: "$180.50" },
    { label: "Market cap", value: "$4.4T" },
    { label: "DCF fair value", value: "$210.30" },
  ];
  return (
    <div className="rounded-xl p-4" style={{ background: "var(--ink-900)" }}>
      <p className="eyebrow mb-2" style={{ color: "var(--ink-text-muted)" }}>
        Unified view
      </p>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-[13px]">
            <span style={{ color: "var(--ink-text-muted)" }}>{row.label}</span>
            <span className="display" style={{ color: "var(--ink-text)" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TwoColumnFeatures() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border p-6" style={{ borderColor: "var(--cream-line)", background: "var(--cream-raised)" }}>
        <h3 className="display text-[19px]" style={{ color: "var(--cream-text)" }}>
          LLMs engineered for finance
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--cream-text-muted)" }}>
          Purpose-built prompts that read SEC filings the way an analyst does, reconcile
          disagreeing sources, and cite exactly where every number came from.
        </p>
        <div className="mt-5">
          <FilingVisual />
        </div>
      </div>

      <div className="rounded-2xl border p-6" style={{ borderColor: "var(--cream-line)", background: "var(--cream-raised)" }}>
        <h3 className="display text-[19px]" style={{ color: "var(--cream-text)" }}>
          Reason over all of your data
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--cream-text-muted)" }}>
          Morgan unifies SEC filings, live market data, and sandboxed valuation into one
          answer — instead of you tab-switching between three tools.
        </p>
        <div className="mt-5">
          <ConsensusVisual />
        </div>
      </div>
    </div>
  );
}
