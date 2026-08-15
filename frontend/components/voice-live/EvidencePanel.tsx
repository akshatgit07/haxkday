import type { InvestmentMemo } from "@/lib/types";

const NEUTRAL_700 = "var(--color-neutral-700, #6b6560)";
const ACCENT_700 = "var(--color-accent-700, #8a4b25)";

interface Segment {
  label: string;
  count: number;
  color: string;
}

export default function EvidencePanel({ memo }: { memo: InvestmentMemo }) {
  const filingsCount = memo.sources.filter((s) => s.startsWith("SEC ")).length;
  const webCount = memo.sources.filter((s) => s.startsWith("Web: ")).length;
  const gapsCount = memo.data_gaps.length;

  const segments: Segment[] = [
    { label: "Filings", count: filingsCount, color: "var(--color-accent)" },
    { label: "Web search", count: webCount, color: "var(--color-accent-2)" },
    { label: "Gaps", count: gapsCount, color: "var(--color-neutral-300, #dcd3c4)" },
  ].filter((s) => s.count > 0);

  const total = segments.reduce((sum, s) => sum + s.count, 0);

  let cursor = 0;
  const stops = segments
    .map((s) => {
      const start = (cursor / total) * 100;
      cursor += s.count;
      const end = (cursor / total) * 100;
      return `${s.color} ${start.toFixed(1)}% ${end.toFixed(1)}%`;
    })
    .join(", ");

  return (
    <div
      className="organic-theme"
      style={{
        width: "100%",
        background: "#fffdf9",
        border: "1px solid rgba(32,30,29,0.1)",
        borderRadius: "var(--radius-lg, 16px)",
        boxShadow: "var(--shadow-md)",
        padding: "20px 22px",
      }}
    >
      <h3 style={{ margin: "0 0 16px", fontSize: 12, fontWeight: 700, color: NEUTRAL_700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
        Evidence &amp; confidence
      </h3>

      {total > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: `conic-gradient(${stops})`,
              boxShadow: "inset 0 0 0 22px #fffdf9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 24, color: "var(--color-text)" }}>
                {memo.confidence_pct.toFixed(0)}%
              </div>
              <div style={{ fontSize: 10.5, color: NEUTRAL_700 }}>confidence</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", marginTop: 20 }}>
            {segments.map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 11, height: 11, borderRadius: 4, background: s.color, flex: "none" }} />
                <div style={{ flex: 1, fontSize: 13, color: "var(--color-text)" }}>{s.label}</div>
                <div style={{ fontSize: 13, fontFamily: "var(--font-heading)", color: "var(--color-text)" }}>{s.count}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 24, color: "var(--color-text)" }}>
            {memo.confidence_pct.toFixed(0)}%
          </div>
          <div style={{ fontSize: 12, color: ACCENT_700, marginTop: 4 }}>No sources or gaps recorded</div>
        </div>
      )}
    </div>
  );
}
