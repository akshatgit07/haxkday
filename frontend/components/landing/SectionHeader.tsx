interface SectionHeaderProps {
  number: string;
  label: string;
  eyebrowColor: string;
  headline: React.ReactNode;
  headlineColor: string;
  description: React.ReactNode;
  descriptionColor: string;
  linkHref?: string;
  linkLabel?: string;
  linkColor?: string;
}

export default function SectionHeader({
  number,
  label,
  eyebrowColor,
  headline,
  headlineColor,
  description,
  descriptionColor,
  linkHref,
  linkLabel,
  linkColor,
}: SectionHeaderProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-[7fr_5fr] sm:items-end">
      <div>
        <p className="eyebrow" style={{ color: eyebrowColor }}>
          {number === "—" ? label : `${number} · ${label}`}
        </p>
        <h2 className="display mt-4 max-w-md text-[32px] sm:text-[40px]" style={{ color: headlineColor }}>
          {headline}
        </h2>
      </div>
      <div className="sm:pb-1">
        <p className="max-w-sm text-[14px] leading-relaxed sm:ml-auto sm:text-right" style={{ color: descriptionColor }}>
          {description}
        </p>
        {linkHref && (
          <a
            href={linkHref}
            className="mt-3 inline-block text-[12px] font-semibold sm:block sm:text-right"
            style={{ color: linkColor }}
          >
            {linkLabel} →
          </a>
        )}
      </div>
    </div>
  );
}
