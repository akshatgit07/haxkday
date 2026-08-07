export default function ResearchMockup() {
  return (
    <div
      className="overflow-hidden rounded-2xl border shadow-2xl"
      style={{ background: "var(--ink-900)", borderColor: "var(--ink-line)" }}
    >
      <div
        className="flex items-center justify-between border-b px-5 py-3 text-[11px]"
        style={{ borderColor: "var(--ink-line)", color: "var(--ink-text-muted)" }}
      >
        <span>Morgan · Investment memo</span>
        <span>NVDA</span>
      </div>

      <div className="grid gap-0 sm:grid-cols-[1fr_220px]">
        <div className="border-b p-5 sm:border-b-0 sm:border-r" style={{ borderColor: "var(--ink-line)" }}>
          <p className="text-[11px]" style={{ color: "var(--ink-text-muted)" }}>
            &ldquo;Should I invest in Nvidia?&rdquo;
          </p>
          <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "var(--ink-text)" }}>
            NVIDIA continues to benefit from surging AI infrastructure demand, posting strong
            revenue growth and industry-leading margins
            <sup
              className="mx-1 rounded px-1 py-0.5 text-[10px] font-semibold"
              style={{ background: "rgba(224, 138, 79, 0.18)", color: "var(--accent-bright)" }}
            >
              1
            </sup>
            . Gross margin held at seventy-five percent.
          </p>

          <div className="mt-5 space-y-2 border-t pt-4" style={{ borderColor: "var(--ink-line)" }}>
            {[
              ["Recommendation", "BUY"],
              ["Confidence", "92%"],
              ["DCF fair value", "$210.30"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-[12.5px]">
                <span style={{ color: "var(--ink-text-muted)" }}>{label}</span>
                <span style={{ color: "var(--ink-text)" }}>{value}</span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[11px]" style={{ color: "var(--ink-text-muted)" }}>
            <sup>1</sup> SEC 10-K, fiscal period 2025-01-26
          </p>
        </div>

        <div className="p-5">
          <p className="eyebrow" style={{ color: "var(--ink-text-muted)" }}>
            Sourced from
          </p>
          <div className="mt-3 space-y-2">
            {["SEC EDGAR", "Polygon", "Alpha Vantage"].map((s) => (
              <div
                key={s}
                className="rounded-lg px-3 py-2 text-[12px]"
                style={{ background: "var(--ink-800)", color: "var(--ink-text-muted)" }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
