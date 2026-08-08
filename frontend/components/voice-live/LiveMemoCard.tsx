import type { InvestmentMemo } from "@/lib/types";

const NEUTRAL_700 = "var(--color-neutral-700, #6b6560)";
const ACCENT_700 = "var(--color-accent-700, #8a4b25)";
const ACCENT2_700 = "var(--color-accent-2-700, #4d5a3a)";

const REC_STYLES: Record<InvestmentMemo["recommendation"], { fg: string; bg: string }> = {
  BUY: { fg: ACCENT2_700, bg: "var(--color-accent-2-100, #eef3e2)" },
  HOLD: { fg: NEUTRAL_700, bg: "var(--color-neutral-200, #eee7db)" },
  SELL: { fg: ACCENT_700, bg: "var(--color-accent-100, #fff2eb)" },
};

function Superscripts({ numbers }: { numbers: number[] }) {
  if (numbers.length === 0) return null;
  return (
    <sup style={{ marginLeft: 4, fontSize: 11, color: ACCENT_700, fontWeight: 700 }}>
      {numbers.join(",")}
    </sup>
  );
}

export default function LiveMemoCard({ memo }: { memo: InvestmentMemo }) {
  const rec = REC_STYLES[memo.recommendation];
  // The memo backs its whole verdict with every source it drew on — number them
  // as footnotes rather than fabricating a per-claim citation map the backend
  // doesn't produce.
  const sourceNumbers = memo.sources.map((_, i) => i + 1);

  return (
    <div
      className="organic-theme"
      style={{
        width: "100%",
        maxWidth: 640,
        background: "#fffdf9",
        border: "1px solid rgba(32,30,29,0.1)",
        borderRadius: "var(--radius-lg, 16px)",
        boxShadow: "var(--shadow-md)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "18px 20px",
          borderBottom: "1px solid rgba(32,30,29,0.08)",
        }}
      >
        <span style={{ fontFamily: "var(--font-heading)", fontSize: 22, color: "var(--color-text)" }}>
          {memo.ticker}
          <Superscripts numbers={sourceNumbers} />
        </span>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 13,
            fontWeight: 600,
            padding: "6px 14px",
            borderRadius: 999,
            color: rec.fg,
            background: rec.bg,
          }}
        >
          {memo.recommendation}
        </span>
      </div>

      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
            <span style={{ color: NEUTRAL_700 }}>Confidence</span>
            <span style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}>
              {memo.confidence_pct.toFixed(0)}%
            </span>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 999,
              background: "rgba(32,30,29,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.max(2, Math.min(100, memo.confidence_pct))}%`,
                height: "100%",
                borderRadius: 999,
                background: memo.confidence_pct < 60 ? ACCENT_700 : "var(--color-accent)",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--color-text)", margin: 0 }}>
          {memo.executive_summary}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div
            style={{
              background: "var(--color-neutral-100, #f9f4ed)",
              borderRadius: 12,
              borderTop: `2px solid ${ACCENT2_700}`,
              padding: 14,
            }}
          >
            <h4 style={{ margin: "0 0 8px", fontSize: 12.5, fontWeight: 700, color: ACCENT2_700 }}>Bull case</h4>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, lineHeight: 1.5, color: "var(--color-text)" }}>
              {memo.bull_case.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div
            style={{
              background: "var(--color-neutral-100, #f9f4ed)",
              borderRadius: 12,
              borderTop: `2px solid ${ACCENT_700}`,
              padding: 14,
            }}
          >
            <h4 style={{ margin: "0 0 8px", fontSize: 12.5, fontWeight: 700, color: ACCENT_700 }}>Bear case</h4>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, lineHeight: 1.5, color: "var(--color-text)" }}>
              {memo.bear_case.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        {memo.key_risks.length > 0 && (
          <div>
            <h4 style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: NEUTRAL_700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Key risks
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {memo.key_risks.map((risk) => (
                <span
                  key={risk}
                  style={{
                    fontSize: 12,
                    padding: "5px 10px",
                    borderRadius: 999,
                    background: "var(--color-neutral-200, #eee7db)",
                    color: "var(--color-text)",
                  }}
                >
                  {risk}
                </span>
              ))}
            </div>
          </div>
        )}

        {(memo.sources.length > 0 || memo.data_gaps.length > 0) && (
          <div style={{ borderTop: "1px solid rgba(32,30,29,0.08)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {memo.sources.map((source, i) => (
              <p key={source} style={{ margin: 0, fontSize: 11.5, color: NEUTRAL_700 }}>
                <sup style={{ color: ACCENT_700, fontWeight: 700 }}>{i + 1}</sup> {source}
              </p>
            ))}
            {memo.data_gaps.map((gap) => (
              <p key={gap} style={{ margin: 0, fontSize: 11.5, color: ACCENT_700 }}>
                ⚠ {gap}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
