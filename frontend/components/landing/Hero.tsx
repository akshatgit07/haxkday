"use client";

import { useState } from "react";
import Link from "next/link";

import HeroVisual from "./HeroVisual";

export default function Hero() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    window.location.href = `mailto:hello@morgan.ai?subject=Access%20request&body=${encodeURIComponent(email)}`;
  }

  return (
    <section
      className="mx-4 overflow-hidden rounded-[32px] px-6 pb-16 pt-14 text-center sm:mx-6"
      style={{ background: "linear-gradient(180deg, var(--color-accent-2-700), var(--color-accent-2-900))" }}
    >
      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--color-accent-2-100)] opacity-80">
        ANNOUNCING PRE-SEED
      </p>
      <h1 className="font-heading mx-auto mt-4 max-w-2xl text-4xl text-[#fdf9f0] sm:text-5xl">
        The Autonomous Financial Analyst
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row sm:gap-0"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Business email"
          className="w-full rounded-full border-0 bg-[#fdf9f0] px-5 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-neutral-500)] sm:rounded-r-none"
        />
        <button
          type="submit"
          className="btn btn-primary rounded-full px-6 py-3 sm:-ml-8 sm:rounded-l-none"
        >
          Request Access
        </button>
      </form>
      <p className="mt-3 text-xs text-[var(--color-accent-2-100)] opacity-70">
        to accelerate access, email{" "}
        <a href="mailto:hello@morgan.ai" className="underline underline-offset-2">
          hello@morgan.ai
        </a>
      </p>

      <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-[#fdf9f0] opacity-90">
        Ask about a company by voice. Morgan pulls the filings, runs a real DCF in a sandbox, and
        returns an investment memo with a recommendation.
      </p>

      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-2 text-[11px] font-semibold tracking-[0.1em] text-[var(--color-accent-2-100)] opacity-60">
        <span>MULTI-STRATEGY HEDGE FUNDS</span>
        <span>LEADING INVESTMENT BANKS</span>
        <span>$100B+ AUM PRIVATE EQUITY FIRMS</span>
        <span>FORTUNE 500 FINANCE TEAMS</span>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <HeroVisual />
      </div>

      <div className="mx-auto mt-6 flex max-w-md justify-center gap-3">
        <Link href="/app" className="btn btn-on-dark">
          Watch Demo
        </Link>
      </div>
    </section>
  );
}
