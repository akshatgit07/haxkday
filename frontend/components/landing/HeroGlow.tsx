export default function HeroGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] opacity-70"
      style={{
        background:
          "radial-gradient(circle at 60% 40%, color-mix(in srgb, var(--accent) 35%, transparent), transparent 60%)",
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: "1px solid rgba(246, 239, 226, 0.14)" }}
      />
      <div
        className="absolute inset-[60px] rounded-full"
        style={{ border: "1px solid rgba(246, 239, 226, 0.1)" }}
      />
      <div
        className="absolute inset-[120px] rounded-full"
        style={{ border: "1px solid rgba(246, 239, 226, 0.08)" }}
      />
    </div>
  );
}
