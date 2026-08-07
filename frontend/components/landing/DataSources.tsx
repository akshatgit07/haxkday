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
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--color-accent-700)]">DATA SOURCES</p>
      <h2 className="font-heading mt-3 max-w-lg text-3xl sm:text-4xl">
        Morgan integrates natively with internal data and external sources
      </h2>

      <div
        className="mt-10 rounded-2xl border p-6 sm:p-10"
        style={{ background: "var(--color-neutral-100)", borderColor: "var(--color-divider)" }}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SOURCES.map((s) => (
            <div key={s.name} className="rounded-xl bg-[#fffdf9] p-4 text-center shadow-sm">
              <p className="font-heading text-[15px]">{s.name}</p>
              <p className="mt-1 text-[11px] text-[var(--color-neutral-500)]">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
