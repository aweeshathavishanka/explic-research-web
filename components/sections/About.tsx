import { achievements, team, teamGroups, type TeamPerson } from "@/data/team";
import { site } from "@/data/site-content";
import { Section, SectionHeader } from "@/components/ui/SectionHeading";
import { Portrait } from "@/components/ui/Portrait";

// Supervision: 3 portraits across on desktop. Research: 4 across. Two columns below lg.
const gridClass: Record<TeamPerson["group"], string> = {
  supervision: "grid-cols-2 lg:grid-cols-3",
  research: "grid-cols-2 lg:grid-cols-4",
};

function PersonCard({ person }: { person: TeamPerson }) {
  return (
    <li className="reveal group">
      <Portrait
        src={person.image.src}
        name={person.name}
        width={person.image.width}
        height={person.image.height}
        position={person.image.position}
      />
      <div className="mt-4">
        {person.component || person.designation ? (
          <p className="flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1">
            {person.component ? <span className="font-mono text-xs text-accent-text">{person.component}</span> : null}
            {person.designation ? (
              <span className="rounded-full border border-accent-line bg-accent-surface px-2 py-px text-xs font-medium text-accent-text">
                {person.designation}
              </span>
            ) : null}
          </p>
        ) : null}
        <h4 className={`${person.component || person.designation ? "mt-1" : ""} text-base font-medium leading-snug text-fg sm:text-lg`}>
          {person.name}
        </h4>
        {person.role ? <p className="mt-1 text-sm text-accent-text">{person.role}</p> : null}
        {person.contribution ? <p className="mt-1.5 text-sm leading-snug text-muted">{person.contribution}</p> : null}
        {person.studentId ? <p className="mt-2 font-mono text-xs text-subtle">{person.studentId}</p> : null}
        {person.links?.length ? (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {person.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent-text underline-offset-4 hover:underline"
                >
                  {l.label}
                  <span className="sr-only"> for {person.name} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

export function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <SectionHeader
        id="about-title"
        title="The People Behind Explic"
        lede="Meet the researchers and academic mentors contributing to the Explic research project."
      />

      <dl className="reveal mt-10 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
        {[
          ["Project ID", site.projectId],
          ["Institution", site.institutionShort],
          ["Department", "Information Technology"],
          ["Degree", "B.Sc. (Hons) in IT"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[13px] text-subtle">{k}</dt>
            <dd className="mt-1 text-[15px] text-fg">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-16 space-y-16">
        {teamGroups.map((g) => {
          const people = team.filter((p) => p.group === g.id);
          if (people.length === 0) return null;
          return (
            <div key={g.id} className="border-t border-line pt-8">
              <div className="reveal mb-8">
                <h3 className="text-xl font-medium text-fg">{g.title}</h3>
                <p className="mt-1.5 text-[15px] text-muted">{g.description}</p>
              </div>
              <ul className={`grid gap-x-4 gap-y-10 sm:gap-x-6 ${gridClass[g.id]}`}>
                {people.map((p) => (
                  <PersonCard key={p.id} person={p} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {achievements.length > 0 ? (
        <div className="mt-16 border-t border-line pt-8">
          <h3 className="text-xl font-medium text-fg">Research achievements</h3>
          <ul className="mt-6 space-y-5">
            {achievements.map((a) => (
              <li key={a.title}>
                <p className="font-medium text-fg">{a.title}</p>
                <p className="mt-1 text-sm text-muted">{a.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}
