import SectionHeader from "./SectionHeader";

const PILLARS = [
  {
    title: "Secrets stay server-side",
    body: "API keys live only in the deployment platform's environment — never in code, never sent to the browser.",
    icon: (
      <path d="M6 11V7a6 6 0 0 1 12 0v4M5 11h14v9H5z" stroke="currentColor" strokeWidth="1.6" fill="none" />
    ),
  },
  {
    title: "Every call authenticated",
    body: "Voice-agent tool calls carry a shared secret Morgan checks before touching the pipeline.",
    icon: (
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Traceable by design",
    body: "Every agent step, tool call, and sandbox run is traced end-to-end — not just the final answer.",
    icon: (
      <>
        <circle cx="6" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <circle cx="18" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <circle cx="12" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <path d="M8 7l6.5 9.5M16 7l-6.5 9.5" stroke="currentColor" strokeWidth="1.4" />
      </>
    ),
  },
];

export default function MethodologySection() {
  return (
    <section id="security" className="px-6 py-20" style={{ background: "var(--ink-950)" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          number="05"
          label="Methodology and confidence"
          eyebrowColor="var(--accent-2-bright)"
          headline={
            <>
              Serious about <span style={{ color: "var(--accent-2-bright)" }}>the source</span>.
            </>
          }
          headlineColor="var(--ink-text)"
          description="Precision built where it counts. Morgan is designed around context provenance and the right level of visibility."
          descriptionColor="var(--ink-text-muted)"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="border-t pt-5" style={{ borderColor: "var(--ink-line)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ color: "var(--accent-2-bright)" }}>
                {p.icon}
              </svg>
              <h3 className="display mt-4 text-[17px]" style={{ color: "var(--ink-text)" }}>
                {p.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--ink-text-muted)" }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
