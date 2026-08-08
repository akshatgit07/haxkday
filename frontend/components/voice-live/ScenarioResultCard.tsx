import type { ScenarioInputs, ScenarioResult } from "@/lib/types";

const NEUTRAL_700 = "var(--color-neutral-700, #6b6560)";
const ACCENT_700 = "var(--color-accent-700, #8a4b25)";
const ACCENT2_700 = "var(--color-accent-2-700, #4d5a3a)";

function formatUsd(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function MarginBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  const width = Math.max(3, Math.min(100, Math.abs(pct) * 1.6));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
        <span style={{ color: NEUTRAL_700 }}>{label}</span>
        <span style={{ fontFamily: "var(--font-heading)", fontSize: 15, color: "var(--color-text)" }}>
          {pct.toFixed(1)}%
        </span>
      </div>
      <div style={{ height: 10, borderRadius: 999, background: "rgba(32,30,29,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${width}%`, height: "100%", borderRadius: 999, background: color, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

export default function ScenarioResultCard({
  result,
  inputs,
  summary,
}: {
  result: ScenarioResult;
  inputs: ScenarioInputs | null;
  summary: string;
}) {
  const declined = result.margin_delta_pct < 0;
  const deltaColor = declined ? ACCENT_700 : ACCENT2_700;

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
      <h3 style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: NEUTRAL_700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
        Scenario model
      </h3>
      <p style={{ margin: "0 0 18px", fontSize: 14.5, lineHeight: 1.55, color: "var(--color-text)" }}>{summary}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
        <MarginBar label="Base margin" pct={result.base_margin_pct} color="var(--color-neutral-400, #c0b6a5)" />
        <MarginBar label="New margin" pct={result.new_margin_pct} color={declined ? "var(--color-accent)" : "var(--color-accent-2)"} />
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "var(--font-heading)",
          fontSize: 14,
          fontWeight: 600,
          color: deltaColor,
          background: declined ? "var(--color-accent-100, #fff2eb)" : "var(--color-accent-2-100, #eef3e2)",
          padding: "6px 12px",
          borderRadius: 999,
          marginBottom: inputs ? 18 : 0,
        }}
      >
        {declined ? "▼" : "▲"} {Math.abs(result.margin_delta_pct).toFixed(1)} pts
      </div>

      {inputs && (
        <div style={{ borderTop: "1px solid rgba(32,30,29,0.08)", paddingTop: 14 }}>
          <h4 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: NEUTRAL_700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Show the math
          </h4>
          <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 7, fontSize: 13, lineHeight: 1.5, color: "var(--color-text)" }}>
            <li>
              Cost delta = {formatUsd(inputs.cost_category_amount)} × {(inputs.cost_category_pct_change * 100).toFixed(0)}% ={" "}
              <strong>{formatUsd(result.cost_delta)}</strong>
            </li>
            <li>
              New total costs = {formatUsd(inputs.total_costs)} + {formatUsd(result.cost_delta)} ={" "}
              <strong>{formatUsd(inputs.new_total_costs)}</strong>
            </li>
            <li>
              New margin = (revenue − new total costs) ÷ revenue = ({formatUsd(inputs.revenue)} −{" "}
              {formatUsd(inputs.new_total_costs)}) ÷ {formatUsd(inputs.revenue)} = <strong>{result.new_margin_pct.toFixed(1)}%</strong>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
