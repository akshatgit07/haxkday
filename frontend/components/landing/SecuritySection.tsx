const PRACTICES = [
  "Secrets never committed to source",
  "Signed, short-lived voice session URLs",
  "Shared-secret webhook authentication",
  "TLS in transit end-to-end",
];

export default function SecuritySection() {
  return (
    <section id="security" className="mx-auto max-w-6xl px-6 py-4">
      <div
        className="rounded-[28px] p-8 sm:p-12"
        style={{ background: "var(--color-accent-2-100)" }}
      >
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--color-accent-2-700)]">
          SECURITY
        </p>
        <h2 className="font-heading mt-3 text-3xl">Built with security in mind</h2>
        <p className="text-muted mt-3 max-w-lg text-[15px] leading-relaxed">
          API keys live only in the deployment platform&rsquo;s environment, never in code or the
          browser. Every voice-agent tool call is authenticated with a shared secret before it can
          reach the pipeline.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {PRACTICES.map((p) => (
            <span
              key={p}
              className="rounded-full border px-3 py-1.5 text-[12px]"
              style={{ borderColor: "var(--color-accent-2-400)", color: "var(--color-accent-2-800)" }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
