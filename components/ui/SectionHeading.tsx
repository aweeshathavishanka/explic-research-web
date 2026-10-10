type SectionProps = {
  id: string;
  labelledBy: string;
  children: React.ReactNode;
  className?: string;
};

/** Every landing section shares the same frame, padding, and divider. */
export function Section({ id, labelledBy, children, className = "" }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`page-x border-t border-line py-20 sm:py-28 ${className}`}>
      {children}
    </section>
  );
}

type SectionHeaderProps = {
  id: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** Small label above the headline. Use sparingly (hero + at most two sections). */
  label?: string;
};

/** Optional label, headline, and optional lede, stacked vertically. */
export function SectionHeader({ id, title, lede, label }: SectionHeaderProps) {
  return (
    <header className="reveal max-w-3xl">
      {label ? <p className="mb-4 font-mono text-[13px] text-accent-text">{label}</p> : null}
      <h2 id={id} className="text-[2rem] font-medium leading-[1.1] text-fg sm:text-[2.6rem] lg:text-5xl">
        {title}
      </h2>
      {lede ? <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-muted">{lede}</p> : null}
    </header>
  );
}

/** H3 used for the six Domain subsections. */
export function Subheading({ id, title, intro }: { id: string; title: string; intro?: string }) {
  return (
    <div className="reveal mb-10">
      <h3 id={id} className="text-2xl font-medium leading-tight text-fg sm:text-[1.875rem]">
        {title}
      </h3>
      {intro ? <p className="mt-4 max-w-[62ch] leading-relaxed text-muted">{intro}</p> : null}
    </div>
  );
}
