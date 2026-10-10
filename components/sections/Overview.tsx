import { components, overview, type ResearchComponent } from "@/data/site-content";

const rows = ["Voice", "Text"] as const;
const cols = ["Detection", "Explainability"] as const;

function ComponentCell({ c }: { c: ResearchComponent }) {
  const explain = c.role === "Explainability";
  return (
    <article
      className={`flex h-full flex-col rounded-xl border p-6 sm:p-7 ${
        explain ? "border-accent-line bg-accent-surface" : "border-line bg-surface"
      }`}
    >
      <p className="font-mono text-xs text-accent-text">
        {c.code} <span className="text-subtle lg:hidden">{c.modality.toLowerCase()} {c.role.toLowerCase()}</span>
      </p>
      <h4 className="mt-5 text-lg font-medium leading-snug text-fg">{c.title}</h4>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.summary}</p>
      <p className="mt-auto pt-6 text-[13px] text-subtle">Led by {c.lead}</p>
    </article>
  );
}

export function Overview() {
  return (
    <section id="introduction" aria-labelledby="overview-title" className="page-x border-t border-line py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="reveal lg:col-span-6">
          <h2 id="overview-title" className="text-[2rem] font-medium leading-[1.1] text-fg sm:text-[2.6rem] lg:text-5xl">
            {overview.title}
          </h2>
          <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-relaxed text-muted">{overview.lede}</p>
        </div>
        <dl className="space-y-7 lg:col-span-5 lg:col-start-8">
          {overview.reasons.map((r) => (
            <div key={r.label} className="reveal border-t border-line pt-5">
              <dt className="font-medium text-fg">{r.label}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted">{r.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-20">
        <h3 className="reveal text-xl font-medium text-fg">Four components, one framework</h3>
        <p className="reveal mt-2 max-w-[62ch] text-[15px] leading-relaxed text-muted">
          Each modality has a detection component and an explanation component that reads its evidence. Tinted cells
          are explanation components.
        </p>

        {/* Desktop: labelled modality × role matrix */}
        <div className="reveal mt-8 hidden grid-cols-[6.5rem_1fr_1fr] gap-3 lg:grid">
          <div />
          {cols.map((col) => (
            <p key={col} className="pb-1 font-mono text-xs text-subtle">
              {col}
            </p>
          ))}
          {rows.map((row) => (
            <div key={row} className="contents">
              <p className="pt-7 font-mono text-xs text-subtle">{row}</p>
              {cols.map((col) => {
                const c = components.find((x) => x.modality === row && x.role === col);
                return c ? <ComponentCell key={c.code} c={c} /> : <div key={col} />;
              })}
            </div>
          ))}
        </div>

        {/* Below lg: single column on mobile, two columns on tablet, in component order */}
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:hidden">
          {[...components]
            .sort((a, b) => a.code.localeCompare(b.code))
            .map((c) => (
              <li key={c.code} className="reveal">
                <ComponentCell c={c} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
