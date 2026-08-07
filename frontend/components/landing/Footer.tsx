export default function Footer() {
  return (
    <footer
      className="flex flex-wrap items-center justify-between gap-3 px-6 py-6 text-[11px]"
      style={{ background: "var(--ink-950)", color: "var(--ink-text-muted)" }}
    >
      <span className="display" style={{ color: "var(--ink-text)" }}>
        Morgan
      </span>
      <span>© 2026 Morgan. All rights reserved.</span>
      <a href="mailto:hello@morgan.ai" className="hover:opacity-70">
        hello@morgan.ai
      </a>
    </footer>
  );
}
