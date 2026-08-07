export default function AudienceStrip() {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-6 py-3 text-center text-[11px]"
      style={{ background: "var(--mint)", color: "var(--accent-2-ink)" }}
    >
      <span className="eyebrow opacity-70">Built for</span>
      <span className="opacity-40">·</span>
      <span>Investment Banking</span>
      <span className="opacity-40">·</span>
      <span>Private Equity</span>
      <span className="opacity-40">·</span>
      <span>Asset Management</span>
      <span className="opacity-40">·</span>
      <span>Corporate Development</span>
    </div>
  );
}
