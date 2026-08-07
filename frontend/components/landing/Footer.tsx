export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-10 text-xs text-[var(--color-neutral-500)] sm:flex-row">
      <span>Morgan 2026. All Rights Reserved</span>
      <div className="flex gap-5">
        <a href="mailto:hello@morgan.ai" className="hover:text-[var(--color-text)]">
          Contact
        </a>
      </div>
    </footer>
  );
}
