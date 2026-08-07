"use client";

import { useState } from "react";

import SectionHeader from "./SectionHeader";

export default function FinalCTA() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    window.location.href = `mailto:hello@morgan.ai?subject=Access%20request&body=${encodeURIComponent(email)}`;
    setSent(true);
  }

  return (
    <section id="access" className="px-6 py-20" style={{ background: "var(--mint)" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          number="06"
          label="Start a conversation"
          eyebrowColor="var(--accent-2-ink)"
          headline={
            <>
              Add an autonomous <span style={{ color: "var(--accent)" }}>analyst</span> to the
              team.
            </>
          }
          headlineColor="var(--cream-text)"
          description="Tell us where the thread gets hardest today. We'll show you how Morgan can help your team hold it."
          descriptionColor="var(--accent-2-ink)"
        />

        <div className="mt-10 max-w-md">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-5 shadow-lg"
            style={{ background: "var(--cream-raised)" }}
          >
            <label className="eyebrow" style={{ color: "var(--cream-text-muted)" }}>
              Work email
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@firm.com"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: "var(--cream-line)", color: "var(--cream-text)" }}
              />
              <button type="submit" className="btn btn-accent flex-none px-4 py-2.5">
                →
              </button>
            </div>
            <p className="mt-2 text-[11px]" style={{ color: "var(--cream-text-muted)" }}>
              {sent ? "Opening your mail client…" : "We reply within one business day."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
