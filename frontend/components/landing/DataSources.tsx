import SectionHeader from "./SectionHeader";

const SOURCES = [
  { name: "SEC EDGAR", note: "10-K / 10-Q filings" },
  { name: "Polygon", note: "Price, market cap, news" },
  { name: "Alpha Vantage", note: "Fundamentals" },
  { name: "Fireworks AI", note: "Reasoning" },
  { name: "Daytona", note: "Sandboxed execution" },
  { name: "ElevenLabs", note: "Voice" },
  { name: "Braintrust", note: "Tracing" },
];

export default function DataSources() {
  return (
    <section className="px-6 py-20" style={{ background: "var(--cream)" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          number="—"
          label="Data sources"
          eyebrowColor="var(--accent)"
          headline={<>Morgan integrates natively with internal and external sources.</>}
          headlineColor="var(--cream-text)"
          description="No stale caches. Every answer draws on data pulled fresh, from a source you can name."
          descriptionColor="var(--cream-text-muted)"
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SOURCES.map((s) => (
            <div
              key={s.name}
              className="rounded-xl border p-4 text-center"
              style={{ background: "var(--cream-raised)", borderColor: "var(--cream-line)" }}
            >
              <p className="display text-[15px]" style={{ color: "var(--cream-text)" }}>
                {s.name}
              </p>
              <p className="mt-1 text-[11px]" style={{ color: "var(--cream-text-muted)" }}>
                {s.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
