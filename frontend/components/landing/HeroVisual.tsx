export default function HeroVisual() {
  return (
    <div
      className="mx-auto flex max-w-lg items-center gap-4 rounded-2xl border p-4 text-left shadow-lg"
      style={{
        background: "rgba(253, 249, 240, 0.08)",
        borderColor: "rgba(253, 249, 240, 0.16)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        className="flex h-11 w-11 flex-none items-center justify-center rounded-full"
        style={{ background: "var(--color-accent)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="2" width="6" height="12" rx="3" stroke="#fff" strokeWidth="2.2" />
          <path d="M5 11a7 7 0 0 0 14 0" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="12" y1="18" x2="12" y2="22" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-xs text-[var(--color-accent-2-100)] opacity-70">&ldquo;Should I invest in Nvidia?&rdquo;</p>
        <p className="mt-0.5 text-sm text-[#fdf9f0]">
          <span className="font-heading">NVDA</span> · BUY · 92% confidence
        </p>
      </div>
      <span
        className="flex-none rounded-full px-3 py-1 text-xs font-semibold"
        style={{ background: "var(--color-accent-2-100)", color: "var(--color-accent-2-800)" }}
      >
        Live
      </span>
    </div>
  );
}
