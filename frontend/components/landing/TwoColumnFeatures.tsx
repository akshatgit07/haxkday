function FilingVisual() {
  return (
    <div className="rounded-xl bg-[#fffdf9] p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide"
          style={{ background: "var(--color-accent-100)", color: "var(--color-accent-700)" }}
        >
          10-K
        </span>
        <span className="text-[11px] text-[var(--color-neutral-500)]">Item 7 — MD&amp;A</span>
      </div>
      <div className="space-y-1.5">
        <div className="h-2 w-full rounded-full" style={{ background: "var(--color-neutral-200)" }} />
        <div className="h-2 w-11/12 rounded-full" style={{ background: "var(--color-neutral-200)" }} />
        <div
          className="h-2 w-4/5 rounded-full"
          style={{ background: "var(--color-accent-200)" }}
        />
        <div className="h-2 w-full rounded-full" style={{ background: "var(--color-neutral-200)" }} />
        <div className="h-2 w-3/5 rounded-full" style={{ background: "var(--color-neutral-200)" }} />
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
    <div className="rounded-xl bg-[#fffdf9] p-4 shadow-sm">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-neutral-500)]">
        Unified view
      </p>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-[13px]">
            <span className="text-[var(--color-neutral-700)]">{row.label}</span>
            <span className="font-heading">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TwoColumnFeatures() {
  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-6 py-4 sm:grid-cols-2">
      <div
        className="rounded-2xl border p-6"
        style={{ background: "var(--color-neutral-100)", borderColor: "var(--color-divider)" }}
      >
        <h3 className="font-heading text-2xl">LLMs engineered for finance</h3>
        <p className="text-muted mt-2 text-[14px] leading-relaxed">
          Purpose-built prompts that read SEC filings the way an analyst does, reconcile
          disagreeing sources, and cite exactly where every number came from.
        </p>
        <div className="mt-5">
          <FilingVisual />
        </div>
      </div>

      <div
        className="rounded-2xl border p-6"
        style={{ background: "var(--color-neutral-100)", borderColor: "var(--color-divider)" }}
      >
        <h3 className="font-heading text-2xl">Reason over all of your data</h3>
        <p className="text-muted mt-2 text-[14px] leading-relaxed">
          Morgan unifies SEC filings, live market data, and sandboxed valuation into one
          answer — instead of you tab-switching between three tools.
        </p>
        <div className="mt-5">
          <ConsensusVisual />
        </div>
      </div>
    </section>
  );
}
