const STEPS = [
  { label: "Planner", detail: "breaks down the question" },
  { label: "Research", detail: "SEC EDGAR filing" },
  { label: "Valuation", detail: "DCF in Daytona" },
  { label: "Memo", detail: "cited recommendation" },
];

export default function TraceDiagram() {
  return (
    <div
      className="overflow-hidden rounded-2xl border p-6 shadow-2xl sm:p-8"
      style={{ background: "var(--ink-900)", borderColor: "var(--ink-line)" }}
    >
      <p className="eyebrow" style={{ color: "var(--ink-text-muted)" }}>
        Braintrust trace
      </p>
      <div className="relative mt-6 flex flex-col gap-0 sm:flex-row sm:items-start sm:justify-between">
        <div
          className="absolute left-[9px] top-3 hidden h-0.5 sm:block"
          style={{ background: "var(--ink-line)", right: "9px" }}
        />
        {STEPS.map((step, i) => (
          <div key={step.label} className="relative flex flex-1 gap-3 pb-6 sm:flex-col sm:gap-0 sm:pb-0">
            <div
              className="relative z-10 flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full"
              style={{
                background: i === STEPS.length - 1 ? "var(--accent-bright)" : "var(--ink-800)",
                border: `1.5px solid ${i === STEPS.length - 1 ? "var(--accent-bright)" : "var(--ink-line)"}`,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--ink-text)" }} />
            </div>
            <div className="sm:mt-3">
              <p className="display text-[14px]" style={{ color: "var(--ink-text)" }}>
                {step.label}
              </p>
              <p className="text-[11px]" style={{ color: "var(--ink-text-muted)" }}>
                {step.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
