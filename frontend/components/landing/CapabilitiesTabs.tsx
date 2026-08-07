"use client";

import { useState } from "react";

interface Capability {
  label: string;
  description: string;
  visual: React.ReactNode;
}

function OrbTag() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#fffdf9] p-4 shadow-sm">
      <div
        className="flex h-10 w-10 flex-none items-center justify-center rounded-full"
        style={{ background: "var(--color-accent)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="2" width="6" height="12" rx="3" stroke="#fff" strokeWidth="2.4" />
          <path d="M5 11a7 7 0 0 0 14 0" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
      <div className="text-[13px]">
        <p className="text-[var(--color-neutral-500)]">Listening…</p>
        <p className="font-heading">&ldquo;How&rsquo;s NVDA&rsquo;s margin trending?&rdquo;</p>
      </div>
    </div>
  );
}

function CitationTag() {
  return (
    <div className="rounded-xl bg-[#fffdf9] p-4 shadow-sm">
      <p className="text-[13px] text-[var(--color-text)]">
        Gross margin held at 75%
        <span
          className="ml-1 rounded px-1 py-0.5 text-[11px] font-semibold"
          style={{ background: "var(--color-accent-100)", color: "var(--color-accent-700)" }}
        >
          [1]
        </span>
      </p>
      <p className="mt-2 text-[11px] text-[var(--color-neutral-500)]">
        [1] SEC 10-K, fiscal period 2025-01-26
      </p>
    </div>
  );
}

function ScenarioTag() {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#fffdf9] p-4 shadow-sm">
      {[
        { label: "Base margin", value: "30.0%" },
        { label: "New margin", value: "29.2%" },
        { label: "Change", value: "−0.8 pts" },
      ].map((s) => (
        <div key={s.label} className="text-center">
          <p className="text-[10px] text-[var(--color-neutral-500)]">{s.label}</p>
          <p className="font-heading text-sm">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

function MarketTag() {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#fffdf9] p-4 shadow-sm">
      <div>
        <p className="font-heading text-lg">$180.50</p>
        <p className="text-[11px] text-[var(--color-neutral-500)]">NVDA · live via Polygon</p>
      </div>
      <span
        className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
        style={{ background: "var(--color-accent-2-100)", color: "var(--color-accent-2-700)" }}
      >
        +2.1%
      </span>
    </div>
  );
}

function FilingTag() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#fffdf9] p-4 shadow-sm">
      <span
        className="rounded px-2 py-1 text-[10px] font-semibold"
        style={{ background: "var(--color-accent-100)", color: "var(--color-accent-700)" }}
      >
        10-K
      </span>
      <p className="text-[12px] text-[var(--color-neutral-700)]">Pulled directly from SEC EDGAR</p>
    </div>
  );
}

function ConfidenceTag() {
  return (
    <div className="rounded-xl bg-[#fffdf9] p-4 shadow-sm">
      <p className="text-[13px]">
        Confidence: <span className="font-heading">92%</span>
      </p>
      <p className="mt-1 text-[11px]" style={{ color: "var(--color-accent-700)" }}>
        Note: risk assessment not available
      </p>
    </div>
  );
}

function TraceTag() {
  return (
    <div className="space-y-1.5 rounded-xl bg-[#fffdf9] p-4 shadow-sm">
      {["planner", "research", "valuation", "memo"].map((step) => (
        <div key={step} className="flex items-center gap-2 text-[12px] text-[var(--color-neutral-700)]">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-accent-2)" }} />
          {step}
        </div>
      ))}
    </div>
  );
}

function BargeInTag() {
  return (
    <div className="rounded-xl bg-[#fffdf9] p-4 shadow-sm">
      <p className="text-[13px] text-[var(--color-text)]">
        &ldquo;— and export restrictions&rdquo;{" "}
        <span className="text-[var(--color-neutral-500)]">— interrupted —</span>
      </p>
      <p className="mt-1 text-[12px]" style={{ color: "var(--color-accent-700)" }}>
        &ldquo;Go on.&rdquo;
      </p>
    </div>
  );
}

const CAPABILITIES: Capability[] = [
  {
    label: "Voice Analysis",
    description:
      "Ask a question out loud. Morgan runs the full pipeline and speaks back a recommendation — the companion screen syncs live as it works.",
    visual: <OrbTag />,
  },
  {
    label: "Source Citations",
    description:
      "Every number in Morgan's answer links back to the exact filing or data source it came from — no more hunting to find where it came from.",
    visual: <CitationTag />,
  },
  {
    label: "Scenario Modeling",
    description:
      "Ask a quick \"what if\" — Morgan runs the cost-shock math for real, inside an isolated sandbox, and gives you the margin impact.",
    visual: <ScenarioTag />,
  },
  {
    label: "SEC Filings",
    description: "10-Ks and 10-Qs pulled directly from SEC EDGAR, not a stale cache.",
    visual: <FilingTag />,
  },
  {
    label: "Real-Time Market",
    description: "Live price, market cap, and headlines, sourced fresh for every question.",
    visual: <MarketTag />,
  },
  {
    label: "Confidence Scoring",
    description: "Morgan flags when data is missing or an estimate is low-confidence — never smoothed over.",
    visual: <ConfidenceTag />,
  },
  {
    label: "Full Tracing",
    description: "Every agent step, tool call, and sandbox execution is traced end-to-end.",
    visual: <TraceTag />,
  },
  {
    label: "Barge-in",
    description: "Interrupt Morgan mid-sentence to redirect — it drops what it was saying and listens.",
    visual: <BargeInTag />,
  },
];

export default function CapabilitiesTabs() {
  const [active, setActive] = useState(1);
  const current = CAPABILITIES[active];

  return (
    <section id="capabilities" className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--color-accent-700)]">
        BUILT FOR POWER TEAMS
      </p>
      <h2 className="font-heading mt-3 max-w-md text-3xl sm:text-4xl">
        Essential capabilities, directly in your workflow
      </h2>

      <div
        className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-b pb-4 text-sm"
        style={{ borderColor: "var(--color-divider)" }}
      >
        {CAPABILITIES.map((c, i) => (
          <button
            key={c.label}
            onClick={() => setActive(i)}
            className={i === active ? "font-semibold" : "text-[var(--color-neutral-600)]"}
            style={i === active ? { color: "var(--color-accent-700)" } : undefined}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div
        className="mt-8 grid gap-6 rounded-2xl border p-6 sm:grid-cols-2 sm:items-center sm:p-10"
        style={{ background: "var(--color-neutral-100)", borderColor: "var(--color-divider)" }}
      >
        <div>
          <h3 className="font-heading text-2xl">{current.label}</h3>
          <p className="text-muted mt-3 max-w-sm text-[14px] leading-relaxed">{current.description}</p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: "var(--color-divider)" }}>
          {current.visual}
        </div>
      </div>
    </section>
  );
}
