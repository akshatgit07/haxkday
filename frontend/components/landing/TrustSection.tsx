import SectionHeader from "./SectionHeader";

function StatCard({
  value,
  label,
  bg,
  valueColor,
  labelColor,
}: {
  value: string;
  label: string;
  bg: string;
  valueColor: string;
  labelColor: string;
}) {
  return (
    <div className="rounded-2xl p-6" style={{ background: bg }}>
      <p className="display text-[40px]" style={{ color: valueColor }}>
        {value}
      </p>
      <p className="mt-1 max-w-[16ch] text-[12.5px] leading-snug" style={{ color: labelColor }}>
        {label}
      </p>
    </div>
  );
}

export default function TrustSection() {
  return (
    <section className="px-6 py-20" style={{ background: "var(--mint)" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          number="03"
          label="Trust, with context"
          eyebrowColor="var(--accent-2-ink)"
          headline={
            <>
              Confident is not the same <br />
              as <span style={{ color: "var(--accent)" }}>correct</span>.
            </>
          }
          headlineColor="var(--cream-text)"
          description="Morgan says what it knows, what it doesn't, and where it got the difference — every time, not just when asked."
          descriptionColor="var(--accent-2-ink)"
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard
            value="7"
            label="live data sources reasoned over per question"
            bg="var(--ink-950)"
            valueColor="var(--ink-text)"
            labelColor="var(--ink-text-muted)"
          />
          <StatCard
            value="100%"
            label="of memos carry a citation or an explicit gap — never silent"
            bg="var(--cream-raised)"
            valueColor="var(--cream-text)"
            labelColor="var(--cream-text-muted)"
          />
          <StatCard
            value="60%"
            label="confidence floor below which every estimate is auto-flagged"
            bg="var(--accent)"
            valueColor="#fffaf3"
            labelColor="rgba(255, 250, 243, 0.82)"
          />
        </div>
      </div>
    </section>
  );
}
