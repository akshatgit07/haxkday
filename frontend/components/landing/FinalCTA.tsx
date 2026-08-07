import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="mx-4 my-6 rounded-[32px] px-6 py-16 text-center sm:mx-6" style={{ background: "var(--color-accent-2-800)" }}>
      <h2 className="font-heading mx-auto max-w-lg text-3xl text-[#fdf9f0] sm:text-4xl">
        Hire your autonomous financial analyst
      </h2>
      <div className="mx-auto mt-8 flex max-w-sm flex-wrap justify-center gap-3">
        <a href="mailto:hello@morgan.ai" className="btn btn-primary">
          Enterprise
        </a>
        <Link href="/app" className="btn btn-on-dark">
          Watch Demo
        </Link>
      </div>
    </section>
  );
}
