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

const CAPABILITIES: Capability[] = [
  {
    label: "Voice Analysis",
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
    label: "Source Citations",
    description:
      "Every number in Morgan's answer links back to the exact filing or data source it came from — no more hunting to find where it came from.",
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
    label: "Scenario Modeling",
    description:
      "Ask a quick \"what if\" — Morgan runs the cost-shock math for real, inside an isolated sandbox, and gives you the margin impact.",
    visual: (
      <Card>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            ["Base margin", "30.0%"],
            ["New margin", "29.2%"],
            ["Change", "−0.8 pts"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px]" style={{ color: "var(--ink-text-muted)" }}>
                {label}
              </p>
              <p className="display mt-0.5 text-[16px]" style={{ color: "var(--ink-text)" }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </Card>
    ),
  },
  {
    label: "SEC Filings",
    description: "10-Ks and 10-Qs pulled directly from SEC EDGAR, not a stale cache.",
    visual: (
      <Card>
        <div className="flex items-center gap-3">
          <span
            className="rounded px-2 py-1 text-[10px] font-semibold"
            style={{ background: "rgba(224, 138, 79, 0.18)", color: "var(--accent-bright)" }}
          >
            10-K
          </span>
          <p className="text-[12px]" style={{ color: "var(--ink-text-muted)" }}>
            Pulled directly from SEC EDGAR
          </p>
        </div>
      </Card>
    ),
  },
  {
    label: "Real-Time Market",
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
      </Card>
    ),
  },
  {
    label: "Confidence Scoring",
    description: "Morgan flags when data is missing or an estimate is low-confidence — never smoothed over.",
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
    label: "Full Tracing",
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
  {
    label: "Barge-in",
    description: "Interrupt Morgan mid-sentence to redirect — it drops what it was saying and listens.",
    visual: (
      <Card>
        <p className="text-[13px]" style={{ color: "var(--ink-text)" }}>
          &ldquo;— and export restrictions&rdquo;{" "}
          <span style={{ color: "var(--ink-text-muted)" }}>— interrupted —</span>
        </p>
        <p className="mt-1 text-[12px]" style={{ color: "var(--accent-bright)" }}>
          &ldquo;Go on.&rdquo;
        </p>
      </Card>
    ),
  },
];

export default function CapabilitiesPills() {
  const [active, setActive] = useState(1);
  const current = CAPABILITIES[active];

  return (
    <section className="px-6 py-20" style={{ background: "var(--ink-950)" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          number="—"
          label="Built for power teams"
          eyebrowColor="var(--accent-bright)"
          headline={<>Essential capabilities, directly in your workflow.</>}
          headlineColor="var(--ink-text)"
          description="Every capability Morgan has, one tap away — no digging through menus."
          descriptionColor="var(--ink-text-muted)"
        />

        <div
          className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-b pb-4 text-[13px]"
          style={{ borderColor: "var(--ink-line)" }}
        >
          {CAPABILITIES.map((c, i) => (
            <button
              key={c.label}
              onClick={() => setActive(i)}
              className="font-semibold"
              style={{ color: i === active ? "var(--accent-bright)" : "var(--ink-text-muted)" }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div
          className="mt-8 grid gap-6 rounded-2xl border p-6 sm:grid-cols-2 sm:items-center sm:p-10"
          style={{ background: "var(--ink-900)", borderColor: "var(--ink-line)" }}
        >
          <div>
            <h3 className="display text-[22px]" style={{ color: "var(--ink-text)" }}>
              {current.label}
            </h3>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed" style={{ color: "var(--ink-text-muted)" }}>
              {current.description}
            </p>
          </div>
          <div className="rounded-2xl border p-4" style={{ borderColor: "var(--ink-line)" }}>
            {current.visual}
          </div>
        </div>
      </div>
    </section>
  );
}
