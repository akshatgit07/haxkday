import SectionHeader from "./SectionHeader";
import ResearchMockup from "./ResearchMockup";

export default function ResearchSection() {
  return (
    <section className="px-6 py-20" style={{ background: "var(--cream)" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          number="01"
          label="Research"
          eyebrowColor="var(--accent)"
          headline={
            <>
              From scattered filings to a <span style={{ color: "var(--accent)" }}>clear</span>{" "}
              recommendation.
            </>
          }
          headlineColor="var(--cream-text)"
          description="Ask the question in plain language. Morgan reads the filing, runs the valuation, and cites where every number came from."
          descriptionColor="var(--cream-text-muted)"
          linkHref="/app"
          linkLabel="Try the reasoning layer"
          linkColor="var(--accent)"
        />
        <div className="mt-10">
          <ResearchMockup />
        </div>
      </div>
    </section>
  );
}
