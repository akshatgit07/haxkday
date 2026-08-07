import SectionHeader from "./SectionHeader";
import TraceDiagram from "./TraceDiagram";

export default function EvidenceSection() {
  return (
    <section className="px-6 py-20" style={{ background: "var(--cream)" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          number="04"
          label="Evidence layer"
          eyebrowColor="var(--accent)"
          headline={
            <>
              Show your <span style={{ color: "var(--accent)" }}>work</span>.
            </>
          }
          headlineColor="var(--cream-text)"
          description="The recommendation is only half the job. Morgan keeps the path alongside it, so an analyst can move from answer to source without breaking their train of thought."
          descriptionColor="var(--cream-text-muted)"
        />
        <div className="mt-10">
          <TraceDiagram />
        </div>
      </div>
    </section>
  );
}
