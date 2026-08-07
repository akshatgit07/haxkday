export default function AuditableSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-6 py-20 sm:grid-cols-2 sm:items-center">
      <div>
        <h2 className="font-heading text-3xl sm:text-4xl">
          Auditable
          <br />
          from start to
          <br />
          finish
        </h2>
        <p className="text-muted mt-4 max-w-sm text-[15px] leading-relaxed">
          Morgan provides integrated citations, attributing every output back to the underlying
          filing or dataset.
        </p>
      </div>

      <div
        className="rounded-2xl border p-6"
        style={{ background: "var(--color-neutral-100)", borderColor: "var(--color-divider)" }}
      >
        <div className="rounded-xl bg-[#fffdf9] p-5 shadow-sm">
          <p className="text-[13px] leading-relaxed text-[var(--color-text)]">
            Revenue grew twenty-two percent year over year, led by data-center demand.{" "}
            <span
              className="rounded px-1 py-0.5 text-[12px] font-semibold"
              style={{ background: "var(--color-accent-100)", color: "var(--color-accent-700)" }}
            >
              [1]
            </span>{" "}
            Gross margin expanded to seventy-five percent.
          </p>
          <div className="mt-4 border-t pt-3" style={{ borderColor: "var(--color-divider)" }}>
            <p className="flex items-center gap-2 text-[12px] text-[var(--color-neutral-700)]">
              <span
                className="flex h-4 w-4 items-center justify-center rounded text-[10px] font-semibold"
                style={{ background: "var(--color-accent-100)", color: "var(--color-accent-700)" }}
              >
                1
              </span>
              SEC 10-K, fiscal period 2025-01-26
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
