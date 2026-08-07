import Link from "next/link";

export default function NavBar() {
  return (
    <header
      className="flex items-center justify-between px-6 py-3.5"
      style={{ background: "var(--cream-raised)", borderBottom: "1px solid var(--cream-line)" }}
    >
      <span className="display text-[15px]" style={{ color: "var(--cream-text)" }}>
        Morgan
      </span>
      <nav
        className="eyebrow hidden items-center gap-8 sm:flex"
        style={{ color: "var(--cream-text-muted)" }}
      >
        <a href="#capabilities" className="hover:opacity-70">
          Product
        </a>
        <a href="#security" className="hover:opacity-70">
          Trust
        </a>
        <Link href="/app" className="hover:opacity-70">
          Enterprise
        </Link>
      </nav>
      <Link href="/app" className="btn btn-outline-light text-[12px]">
        Request Access
      </Link>
    </header>
  );
}
