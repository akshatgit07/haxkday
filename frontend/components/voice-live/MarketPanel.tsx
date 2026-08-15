import type { MarketSnapshot, ValuationResult } from "@/lib/types";

const NEUTRAL_700 = "var(--color-neutral-700, #6b6560)";
const ACCENT_700 = "var(--color-accent-700, #8a4b25)";
const ACCENT2_700 = "var(--color-accent-2-700, #4d5a3a)";

function formatUsd(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
}

function buildSparkline(values: number[], width = 320, height = 120): { linePath: string; areaPath: string } {
  if (values.length < 2) return { linePath: "", areaPath: "" };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  return { linePath, areaPath };
}

export default function MarketPanel({
  market,
  valuation,
}: {
  market: MarketSnapshot;
  valuation: ValuationResult | null;
}) {
  const changePositive = (market.day_change_pct ?? 0) >= 0;
  const { linePath, areaPath } = buildSparkline(market.price_history);
  const hasChart = market.price_history.length > 1;

  const upsidePct =
    valuation?.dcf_fair_value != null && market.price > 0
      ? ((valuation.dcf_fair_value - market.price) / market.price) * 100
      : null;

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
        padding: "20px 22px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: hasChart ? 16 : 12 }}>
        <div>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 15, color: NEUTRAL_700 }}>{market.ticker}</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 2 }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 30, color: "var(--color-text)" }}>
              {formatUsd(market.price)}
            </span>
            {market.day_change_pct != null && (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 999,
                  color: changePositive ? ACCENT2_700 : ACCENT_700,
                  background: changePositive ? "var(--color-accent-2-100, #eef3e2)" : "var(--color-accent-100, #fff2eb)",
                }}
              >
                {changePositive ? "▲" : "▼"} {Math.abs(market.day_change_pct).toFixed(2)}%
              </span>
            )}
          </div>
        </div>
        {market.market_cap != null && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11.5, color: NEUTRAL_700 }}>Market cap</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--color-text)" }}>
              ${formatCompact(market.market_cap)}
            </div>
          </div>
        )}
      </div>

      {hasChart && (
        <div style={{ marginBottom: 16 }}>
          <svg width="100%" height="120" viewBox="0 0 320 120" preserveAspectRatio="none">
            <path d={areaPath} fill="var(--color-accent-100, #f3ddc9)" stroke="none" />
            <path d={linePath} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: NEUTRAL_700 }}>
            <span>{market.price_history.length} days ago</span>
            <span>Today</span>
          </div>
        </div>
      )}

      {valuation?.dcf_fair_value != null && (
        <div style={{ borderTop: "1px solid rgba(32,30,29,0.08)", paddingTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: NEUTRAL_700 }}>Current price</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--color-text)" }}>{formatUsd(market.price)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: NEUTRAL_700 }}>DCF fair value</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--color-text)" }}>
              {formatUsd(valuation.dcf_fair_value)}
            </div>
          </div>
          {upsidePct != null && (
            <div>
              <div style={{ fontSize: 11, color: NEUTRAL_700 }}>Implied {upsidePct >= 0 ? "upside" : "downside"}</div>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 16,
                  color: upsidePct >= 0 ? ACCENT2_700 : ACCENT_700,
                }}
              >
                {upsidePct >= 0 ? "+" : ""}
                {upsidePct.toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
