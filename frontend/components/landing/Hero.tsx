import Link from "next/link";

import HeroGlow from "./HeroGlow";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-14 pt-16" style={{ background: "var(--ink-950)" }}>
      <HeroGlow />

      <div className="relative mx-auto grid max-w-6xl gap-10 sm:grid-cols-[1fr_260px]">
        <div>
          <p className="eyebrow" style={{ color: "var(--accent-bright)" }}>
            AI Analyst for Investment Professionals
          </p>
          <h1
            className="display mt-5 max-w-xl text-[44px] sm:text-[56px]"
            style={{ color: "var(--ink-text)" }}
          >
            The analyst <span style={{ color: "var(--accent-bright)" }}>behind</span> every
            recommendation.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed" style={{ color: "var(--ink-text-muted)" }}>
            Morgan reasons across SEC filings, live market data, and a sandboxed valuation
            engine — then hands you a memo you can follow, challenge, and cite.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/voice/live" className="btn btn-accent">
              Try the live demo
            </Link>
            <a href="#capabilities" className="btn btn-outline-dark">
              See how it works
            </a>
          </div>
        </div>

        <div className="sm:pt-2">
          <p className="eyebrow" style={{ color: "var(--ink-text-muted)" }}>
            A different kind of intelligence
          </p>
          <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "var(--ink-text-muted)" }}>
            Not another chatbot that guesses. Ask a question by voice and get back an answer
            with a paper trail.
          </p>
        </div>
      </div>

      <div
        className="relative mx-auto mt-14 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t pt-5 text-[11px]"
        style={{ borderColor: "var(--ink-line)", color: "var(--ink-text-muted)" }}
      >
        <span>SEC FILINGS &nbsp;·&nbsp; LIVE MARKET DATA &nbsp;·&nbsp; SANDBOXED VALUATION</span>
        <span>VOICE &amp; DASHBOARD &nbsp;·&nbsp; DEMO LIVE</span>
      </div>
    </section>
  );
}
