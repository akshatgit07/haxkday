"use client";

import { useState } from "react";

import SectionHeader from "./SectionHeader";

interface Capability {
  label: string;
  description: string;
  visual: React.ReactNode;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "var(--ink-800)" }}>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px]" style={{ color: "var(--ink-text-muted)" }}>
        {label}
      </p>
      <p className="display mt-0.5 text-[16px]" style={{ color: "var(--ink-text)" }}>
        {value}
      </p>
    </div>
  );
}

const CAPABILITIES: Capability[] = [
  {
    label: "Voice analysis",
    description:
      "Ask a question out loud. Morgan runs the full pipeline and speaks back a recommendation — the companion screen syncs live as it works.",
    visual: (
      <Card>
        <p className="text-[12px]" style={{ color: "var(--ink-text-muted)" }}>
          Listening…
        </p>
        <p className="display mt-1 text-[15px]" style={{ color: "var(--ink-text)" }}>
          &ldquo;How&rsquo;s NVDA&rsquo;s margin trending?&rdquo;
        </p>
      </Card>
    ),
  },
  {
    label: "Source citations",
    description:
      "Every number in Morgan's answer links back to the exact filing or data source it came from — never take it on faith.",
    visual: (
      <Card>
        <p className="text-[13px]" style={{ color: "var(--ink-text)" }}>
          Gross margin held at 75%
          <sup
            className="ml-1 rounded px-1 py-0.5 text-[10px] font-semibold"
            style={{ background: "rgba(224, 138, 79, 0.18)", color: "var(--accent-bright)" }}
          >
            1
          </sup>
        </p>
        <p className="mt-2 text-[11px]" style={{ color: "var(--ink-text-muted)" }}>
          1 · SEC 10-K, fiscal period 2025-01-26
        </p>
      </Card>
    ),
  },
  {
    label: "Scenario modeling",
    description:
      "Ask a quick “what if” — Morgan runs the cost-shock math for real, inside an isolated sandbox, and gives you the margin impact.",
    visual: (
      <Card>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Base margin" value="30.0%" />
          <Stat label="New margin" value="29.2%" />
          <Stat label="Change" value="−0.8 pts" />
        </div>
      </Card>
    ),
  },
  {
    label: "Real-time market",
    description: "Live price, market cap, and headlines, sourced fresh for every question.",
    visual: (
      <Card>
        <div className="flex items-center justify-between">
          <p className="display text-[18px]" style={{ color: "var(--ink-text)" }}>
            $180.50
          </p>
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ background: "rgba(157, 177, 120, 0.2)", color: "var(--accent-2-bright)" }}
          >
            +2.1%
          </span>
        </div>
        <p className="mt-1 text-[11px]" style={{ color: "var(--ink-text-muted)" }}>
          NVDA · live via Polygon
        </p>
      </Card>
    ),
  },
  {
    label: "Confidence scoring",
    description:
      "Morgan flags when data is missing or an estimate is low-confidence — never smoothed over.",
    visual: (
      <Card>
        <p className="text-[13px]" style={{ color: "var(--ink-text)" }}>
          Confidence: 92%
        </p>
        <p className="mt-1 text-[11px]" style={{ color: "var(--accent-bright)" }}>
          Note: risk assessment not available
        </p>
      </Card>
    ),
  },
  {
    label: "Full tracing",
    description: "Every agent step, tool call, and sandbox execution is traced end-to-end.",
    visual: (
      <Card>
        <div className="space-y-1.5">
          {["planner", "research", "valuation", "memo"].map((step) => (
            <div key={step} className="flex items-center gap-2 text-[12px]" style={{ color: "var(--ink-text-muted)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent-2-bright)" }} />
              {step}
            </div>
          ))}
        </div>
      </Card>
    ),
  },
];

export default function InterfaceSection() {
  const [active, setActive] = useState(1);
  const current = CAPABILITIES[active];

  return (
    <section id="capabilities" className="px-6 py-20" style={{ background: "var(--ink-950)" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          number="02"
          label="Software"
          eyebrowColor="var(--accent-2-bright)"
          headline={
            <>
              The work is the <span style={{ color: "var(--accent-2-bright)" }}>interface</span>.
            </>
          }
          headlineColor="var(--ink-text)"
          description="Morgan is built around the moments investment teams actually work in — and the context they can't afford to lose."
          descriptionColor="var(--ink-text-muted)"
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-[220px_1fr]">
          <div
            className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-visible sm:border-r sm:pr-4"
            style={{ borderColor: "var(--ink-line)" }}
          >
            {CAPABILITIES.map((c, i) => (
              <button
                key={c.label}
                onClick={() => setActive(i)}
                className="flex-none whitespace-nowrap border-l-2 px-3 py-2.5 text-left text-[13px] transition-colors"
                style={{
                  borderColor: i === active ? "var(--accent-2-bright)" : "transparent",
                  color: i === active ? "var(--ink-text)" : "var(--ink-text-muted)",
                  background: i === active ? "var(--ink-900)" : "transparent",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div
            className="rounded-2xl border p-6 sm:p-8"
            style={{ background: "var(--ink-900)", borderColor: "var(--ink-line)" }}
          >
            <div className="grid gap-6 sm:grid-cols-[1fr_260px] sm:items-center">
              <div>
                <h3 className="display text-[22px]" style={{ color: "var(--ink-text)" }}>
                  {current.label}
                </h3>
                <p className="mt-3 max-w-sm text-[14px] leading-relaxed" style={{ color: "var(--ink-text-muted)" }}>
                  {current.description}
                </p>
              </div>
              {current.visual}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
