"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

import { QUERY_DATA, type IconGlyph } from "./data";

type Tab = "ask" | "answer" | "viz";
type VizMode = "allocation" | "trend";

const ACCENT_700 = "var(--color-accent-700, #8a4b25)";
const NEUTRAL_700 = "var(--color-neutral-700, #6b6560)";

function QueryIcon({ glyph }: { glyph: IconGlyph }) {
  switch (glyph) {
    case "pie":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2v10l7 5A10 10 0 1 0 12 2z"
            stroke={ACCENT_700}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "chat":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 4h16v12H8l-4 4V4z" stroke={ACCENT_700} strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      );
    case "trend":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 17l6-6 4 4 8-8"
            stroke={ACCENT_700}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "user":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke={ACCENT_700} strokeWidth="2.2" />
          <path
            d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"
            stroke={ACCENT_700}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

function tabStyle(active: boolean): CSSProperties {
  return {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    padding: "6px 4px",
    borderRadius: 14,
    cursor: "pointer",
    background: active ? "var(--color-accent-100, #f3ddc9)" : "transparent",
    transition: "background .15s ease",
  };
}

function segStyle(active: boolean): CSSProperties {
  return {
    flex: 1,
    textAlign: "center",
    padding: "8px 10px",
    borderRadius: 999,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    background: active ? "#fffdf9" : "transparent",
    color: active ? "var(--color-text)" : NEUTRAL_700,
    boxShadow: active ? "var(--shadow-sm)" : "none",
  };
}

export default function AnalystScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("ask");
  const [listening, setListening] = useState(false);
  const [listeningId, setListeningId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [vizMode, setVizMode] = useState<VizMode>("allocation");

  function askQuery(id: string) {
    if (listening) return;
    setListening(true);
    setListeningId(id);
    setTimeout(() => {
      setListening(false);
      setListeningId(null);
      setSelectedId(id);
      setActiveTab("answer");
      setHistory((prev) => [id, ...prev.filter((h) => h !== id)].slice(0, 4));
    }, 1300);
  }

  const selectedQuery = QUERY_DATA.find((q) => q.id === selectedId) ?? null;
  const hasBothViz = !!selectedQuery && selectedQuery.isDonut && !!selectedQuery.trendLinePath;
  const showDonut =
    !!selectedQuery && selectedQuery.isDonut && (!selectedQuery.trendLinePath || vizMode === "allocation");
  const showLine =
    !!selectedQuery &&
    ((selectedQuery.isLine && !selectedQuery.isDonut) ||
      (selectedQuery.isDonut && !!selectedQuery.trendLinePath && vizMode === "trend"));
  const linePath = selectedQuery ? (selectedQuery.isDonut ? selectedQuery.trendLinePath : selectedQuery.linePath) : "";
  const areaPath = selectedQuery
    ? selectedQuery.isDonut
      ? selectedQuery.trendAreaPath
      : selectedQuery.areaPath
    : "";

  return (
    <div
      className="organic-theme"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "66px 20px 8px", display: "flex", alignItems: "baseline", gap: 10, flex: "none" }}>
        <span style={{ fontFamily: "var(--font-heading)", fontSize: 26, color: "var(--color-text)" }}>
          Analyst
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: NEUTRAL_700 }}>
          Voice financial assistant
        </span>
      </div>

      {activeTab === "ask" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "2px 20px 12px", flex: "none" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#fffdf9",
              border: "1px solid rgba(32,30,29,0.1)",
              borderRadius: 999,
              padding: "8px 14px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="2" stroke={ACCENT_700} strokeWidth="2.75" />
              <rect x="13" y="3" width="8" height="8" rx="2" stroke={ACCENT_700} strokeWidth="2.75" />
              <rect x="3" y="13" width="8" height="8" rx="2" stroke={ACCENT_700} strokeWidth="2.75" />
              <rect x="13" y="13" width="8" height="8" rx="2" stroke={ACCENT_700} strokeWidth="2.75" />
            </svg>
            <span style={{ fontSize: 13.5, color: "var(--color-text)", fontWeight: 600 }}>All accounts</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke={NEUTRAL_700}
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              background: "#fffdf9",
              border: "1px solid rgba(32,30,29,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 5h16M7 12h10M10 19h4" stroke={ACCENT_700} strokeWidth="2.75" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 110px", boxSizing: "border-box" }}>
        {activeTab === "ask" && (
          <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 0 22px" }}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: listening ? "orbPulseRing 1.4s ease-out infinite" : "none",
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: ACCENT_700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: listening ? "orbBreathe 1.4s ease-in-out infinite" : "none",
                  }}
                >
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="2" width="6" height="12" rx="3" stroke="#fff" strokeWidth="2.2" />
                    <path d="M5 11a7 7 0 0 0 14 0" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="12" y1="18" x2="12" y2="22" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div style={{ marginTop: 14, fontSize: 14, color: NEUTRAL_700, textAlign: "center", minHeight: 20 }}>
                {listening ? "Listening…" : "Tap a question below to ask your analyst"}
              </div>
            </div>

            <div style={{ fontFamily: "var(--font-heading)", fontSize: 15, color: "var(--color-text)", margin: "6px 0 10px" }}>
              Try asking
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {QUERY_DATA.map((q) => (
                <div
                  key={q.id}
                  onClick={() => askQuery(q.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "#fffdf9",
                    border: "1px solid rgba(32,30,29,0.08)",
                    borderRadius: "var(--radius-lg, 16px)",
                    padding: "12px 14px",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-sm)",
                    opacity: listening && listeningId !== q.id ? 0.45 : 1,
                    outline: listening && listeningId === q.id ? "2px solid var(--color-accent)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 999,
                      background: "var(--color-accent-2-100, #e7ebdd)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "none",
                    }}
                  >
                    <QueryIcon glyph={q.iconGlyph} />
                  </div>
                  <div style={{ flex: 1, fontSize: 14.5, color: "var(--color-text)", lineHeight: 1.35 }}>
                    {q.label}
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flex: "none", opacity: 0.45 }}>
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="var(--color-text)"
                      strokeWidth="2.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ))}
            </div>

            {history.length > 0 && (
              <>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 15,
                    color: "var(--color-text)",
                    margin: "22px 0 10px",
                  }}
                >
                  Recent
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {history.map((id) => {
                    const q = QUERY_DATA.find((x) => x.id === id);
                    if (!q) return null;
                    return (
                      <div
                        key={id}
                        onClick={() => {
                          setSelectedId(id);
                          setActiveTab("answer");
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 4px",
                          cursor: "pointer",
                          borderBottom: "1px solid rgba(32,30,29,0.07)",
                        }}
                      >
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 999,
                            background: "var(--color-accent)",
                            flex: "none",
                          }}
                        />
                        <div style={{ flex: 1, fontSize: 13.5, color: NEUTRAL_700 }}>{q.label}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "answer" &&
          (selectedQuery ? (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, margin: "8px 0 16px" }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    background: "var(--color-accent)",
                    flex: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-heading)",
                    color: "#fff",
                    fontSize: 13,
                  }}
                >
                  Q
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: "var(--color-text)",
                    fontFamily: "var(--font-heading)",
                    lineHeight: 1.3,
                    paddingTop: 4,
                  }}
                >
                  {selectedQuery.label}
                </div>
              </div>
              <div
                style={{
                  background: "var(--color-neutral-100, #f0e8d8)",
                  borderRadius: "var(--radius-lg, 16px)",
                  padding: 18,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ fontSize: 15, lineHeight: 1.55, color: "var(--color-text)", marginBottom: 14 }}>
                  {selectedQuery.summary}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {selectedQuery.kpis.map((k) => (
                    <div
                      key={k.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 0",
                        borderTop: "1px solid rgba(32,30,29,0.08)",
                      }}
                    >
                      <div style={{ fontSize: 13, color: NEUTRAL_700 }}>{k.label}</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <div style={{ fontFamily: "var(--font-heading)", fontSize: 17, color: "var(--color-text)" }}>
                          {k.value}
                        </div>
                        <div
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: k.positive ? "var(--color-accent-2-700, #4d5a3a)" : ACCENT_700,
                          }}
                        >
                          {k.delta}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedQuery.extraRow && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
                  {selectedQuery.extraRow.map((e) => (
                    <div
                      key={e.label}
                      style={{
                        background: "#fffdf9",
                        border: "1px solid rgba(32,30,29,0.08)",
                        borderRadius: 12,
                        padding: "10px 12px",
                      }}
                    >
                      <div style={{ fontSize: 11.5, color: NEUTRAL_700, marginBottom: 3 }}>{e.label}</div>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: 14.5, color: "var(--color-text)" }}>
                        {e.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div
                onClick={() => setActiveTab("viz")}
                className="btn btn-secondary"
                style={{ marginTop: 16, width: "100%", boxSizing: "border-box", justifyContent: "center" }}
              >
                View visualization
              </div>
            </>
          ) : (
            <EmptyState emoji="🎙️" title="No answer yet" body="Ask something on the Ask tab and your analyst will answer here." />
          ))}

        {activeTab === "viz" &&
          (selectedQuery ? (
            <>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--color-text)", margin: "8px 0 4px" }}>
                {selectedQuery.vizTitle}
              </div>
              <div style={{ fontSize: 13, color: NEUTRAL_700, marginBottom: 16 }}>{selectedQuery.label}</div>

              {hasBothViz && (
                <div
                  style={{
                    display: "flex",
                    background: "rgba(32,30,29,0.06)",
                    borderRadius: 999,
                    padding: 4,
                    marginBottom: 16,
                  }}
                >
                  <div onClick={() => setVizMode("trend")} style={segStyle(vizMode === "trend")}>
                    Trend
                  </div>
                  <div onClick={() => setVizMode("allocation")} style={segStyle(vizMode === "allocation")}>
                    Allocation
                  </div>
                </div>
              )}

              {showDonut && selectedQuery.donutStops && selectedQuery.donutLegend && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: "var(--color-neutral-100, #f0e8d8)",
                    borderRadius: "var(--radius-lg, 16px)",
                    padding: "24px 18px",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: "50%",
                      background: `conic-gradient(${selectedQuery.donutStops})`,
                      boxShadow: "inset 0 0 0 10px #fffdf9",
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", marginTop: 20 }}>
                    {selectedQuery.donutLegend.map((d) => (
                      <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 11, height: 11, borderRadius: 4, background: d.color, flex: "none" }} />
                        <div style={{ flex: 1, fontSize: 13.5, color: "var(--color-text)" }}>{d.label}</div>
                        <div style={{ fontSize: 13.5, fontFamily: "var(--font-heading)", color: "var(--color-text)" }}>
                          {d.pct}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showLine && (
                <div
                  style={{
                    background: "var(--color-neutral-100, #f0e8d8)",
                    borderRadius: "var(--radius-lg, 16px)",
                    padding: "20px 16px",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <svg width="100%" height="140" viewBox="0 0 320 140" preserveAspectRatio="none">
                    <path d={areaPath} fill="var(--color-accent-100, #f3ddc9)" stroke="none" />
                    <path
                      d={linePath}
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11.5, color: NEUTRAL_700 }}>
                    <span>{selectedQuery.axisStart}</span>
                    <span>{selectedQuery.axisEnd}</span>
                  </div>
                </div>
              )}

              <div
                onClick={() => setActiveTab("answer")}
                className="btn btn-ghost"
                style={{ marginTop: 16, width: "100%", boxSizing: "border-box", justifyContent: "center" }}
              >
                Back to answer
              </div>
            </>
          ) : (
            <EmptyState emoji="📊" title="Nothing to visualize yet" body="Ask a question first — a chart will show up here." />
          ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          padding: "8px 18px 26px",
          gap: 8,
          background: "rgba(245,234,216,0.92)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(32,30,29,0.08)",
        }}
      >
        <TabButton
          active={activeTab === "ask"}
          label="Ask"
          onClick={() => setActiveTab("ask")}
          icon={(color) => (
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="12" rx="3" stroke={color} strokeWidth="2.75" />
              <path d="M5 11a7 7 0 0 0 14 0" stroke={color} strokeWidth="2.75" strokeLinecap="round" />
            </svg>
          )}
        />
        <TabButton
          active={activeTab === "answer"}
          label="Answer"
          onClick={() => setActiveTab("answer")}
          icon={(color) => (
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16v12H8l-4 4V4z" stroke={color} strokeWidth="2.75" strokeLinejoin="round" />
            </svg>
          )}
        />
        <TabButton
          active={activeTab === "viz"}
          label="Visualize"
          onClick={() => setActiveTab("viz")}
          icon={(color) => (
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.75" />
              <path d="M12 3v9l7 4" stroke={color} strokeWidth="2.75" strokeLinecap="round" />
            </svg>
          )}
        />
      </div>
    </div>
  );
}

function EmptyState({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "60px 24px",
        color: "var(--color-text)",
      }}
    >
      <div style={{ fontSize: 34, marginBottom: 10 }}>{emoji}</div>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--color-text)", marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 13.5, color: NEUTRAL_700 }}>{body}</div>
    </div>
  );
}

function TabButton({
  active,
  label,
  onClick,
  icon,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  icon: (color: string) => React.ReactNode;
}) {
  const color = active ? ACCENT_700 : "var(--color-neutral-700,#8a8378)";
  return (
    <div onClick={onClick} style={tabStyle(active)}>
      {icon(color)}
      <span style={{ fontSize: 10.5, fontWeight: 600, color }}>{label}</span>
    </div>
  );
}
