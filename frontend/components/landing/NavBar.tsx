import Link from "next/link";

export default function NavBar() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <span className="font-heading text-lg">Morgan</span>
      <nav className="hidden items-center gap-8 text-sm text-[var(--color-neutral-700)] sm:flex">
        <a href="#security" className="hover:text-[var(--color-text)]">
          Security
        </a>
        <Link href="/app" className="hover:text-[var(--color-text)]">
          Enterprise
        </Link>
        <a href="#capabilities" className="hover:text-[var(--color-text)]">
          Capabilities
        </a>
      </nav>
      <Link href="/app" className="btn btn-primary">
        Request Demo
      </Link>
    </header>
  );
}
