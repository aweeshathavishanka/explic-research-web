import { ChevronDown } from "lucide-react";
import {
  datasets,
  literature,
  methodologyNotes,
  objectives,
  references,
  researchGaps,
  researchProblem,
  technologyGroups,
} from "@/data/domain";
import { Section, SectionHeader, Subheading } from "@/components/ui/SectionHeading";
import { PipelineDiagram } from "@/components/visualizations/PipelineDiagram";
import { TextArchitecture, VoiceArchitecture } from "@/components/visualizations/ArchitectureDiagrams";

const subsections = [
  { id: "literature", title: "Literature Survey" },
  { id: "research-gap", title: "Research Gap" },
  { id: "research-problem", title: "Research Problem" },
  { id: "objectives", title: "Research Objectives" },
  { id: "methodology", title: "Methodology" },
  { id: "technologies", title: "Technologies Used" },
];

// Objectives bento: two wide cells, then three narrower cells (5 items, 5 cells).
const objectiveSpan = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "sm:col-span-2 lg:col-span-2"];

export function Domain() {
  return (
    <Section id="domain" labelledBy="domain-title">
      <SectionHeader
        id="domain-title"
        title="The research domain"
        lede="The context, open questions, and methods behind Explic, from prior work in speech anti-spoofing, text detection, and explainable AI to the pipelines each component investigates."
      />

      <div className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-10">
        <nav aria-label="Domain subsections" className="hidden lg:col-span-3 lg:block">
          <ol className="sticky top-24 space-y-0.5 border-l border-line">
            {subsections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="-ml-px block border-l-2 border-transparent py-2 pl-4 text-sm text-muted transition-colors duration-200 hover:border-accent hover:text-fg"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-28 lg:col-span-9">
          {/* Literature survey */}
          <div>
            <Subheading id="literature" title="Literature Survey" />
            <dl className="space-y-10 border-t border-line pt-10">
              {literature.map((item) => (
                <div key={item.title} className="reveal grid gap-2 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-8">
                  <dt className="font-medium text-fg">{item.title}</dt>
                  <dd className="leading-relaxed text-muted">
                    {item.text}{" "}
                    <span className="whitespace-nowrap font-mono text-xs text-accent-text">
                      {item.refs.map((r) => `[${r}]`).join(" ")}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <details className="group reveal mt-10 rounded-xl border border-line bg-surface">
              <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-5 py-4 text-sm font-medium text-fg">
                <span>
                  References <span className="ml-1 font-mono text-xs text-subtle">{references.length}</span>
                </span>
                <ChevronDown
                  className="size-4 text-subtle transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </summary>
              <ol className="space-y-3 border-t border-line px-5 py-5 text-sm leading-relaxed text-muted">
                {references.map((ref) => (
                  <li key={ref.id} className="grid grid-cols-[2.5rem_1fr]">
                    <span className="font-mono text-xs leading-6 text-accent-text">[{ref.id}]</span>
                    <span>{ref.text}</span>
                  </li>
                ))}
              </ol>
              <p className="border-t border-line px-5 py-3 text-xs text-subtle">
                Selected references from the project proposal documentation. Full lists appear in the individual
                reports.
              </p>
            </details>
          </div>

          {/* Research gap */}
          <div>
            <Subheading
              id="research-gap"
              title="Research Gap"
              intro="These open questions motivate the research. They describe what the project sets out to examine, not conclusions it has already established."
            />
            <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {researchGaps.map((gap) => (
                <article key={gap.title} className="reveal border-t border-line-strong pt-5">
                  <h4 className="text-lg font-medium text-fg">{gap.title}</h4>
                  <p className="mt-3 leading-relaxed text-muted">{gap.text}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Research problem */}
          <div>
            <Subheading id="research-problem" title="Research Problem" />
            <div className="reveal rounded-xl border border-accent-line bg-accent-surface p-7 sm:p-10 lg:p-12">
              <p className="max-w-[62ch] leading-relaxed text-muted">{researchProblem.context}</p>
              <p className="mt-8 font-mono text-xs text-accent-text">Problem statement</p>
              <p className="mt-3 max-w-[48ch] text-2xl leading-snug text-fg sm:text-[1.75rem]">
                {researchProblem.statement}
              </p>
            </div>
          </div>

          {/* Objectives */}
          <div>
            <Subheading
              id="objectives"
              title="Research Objectives"
              intro="Objectives define the research scope. Progress and outcomes for each are reported in the component documents."
            />
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {objectives.map((o, i) => (
                <li
                  key={o.code}
                  className={`reveal flex flex-col rounded-xl border p-6 ${objectiveSpan[i]} ${
                    o.explain ? "border-accent-line bg-accent-surface" : "border-line bg-surface"
                  }`}
                >
                  <span className="font-mono text-xs text-accent-text">Objective {i + 1}</span>
                  <h4 className="mt-4 text-lg font-medium leading-snug text-fg">{o.title}</h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{o.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Methodology */}
          <div>
            <Subheading
              id="methodology"
              title="Methodology"
              intro="Both modalities follow the same high-level process. Each track then uses its own detection and explanation components, developed and validated independently before integration."
            />

            <PipelineDiagram />

            <div className="mt-14 space-y-5">
              <VoiceArchitecture />
              <TextArchitecture />
            </div>

            <div className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {methodologyNotes.map((note) => (
                <div key={note.title} className="reveal border-t border-line pt-5">
                  <h4 className="font-medium text-fg">{note.title}</h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{note.text}</p>
                </div>
              ))}
            </div>

            <div className="reveal mt-14">
              <h4 className="font-medium text-fg">Datasets referenced</h4>
              <ul className="mt-4 flex flex-wrap gap-2">
                {datasets.map((d) => (
                  <li
                    key={d.name}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] text-fg"
                  >
                    <span className="font-mono">{d.name}</span>
                    <span className="text-subtle">{d.modality}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 max-w-[62ch] text-[13px] leading-relaxed text-subtle">
                Publicly licensed research datasets named in the project documentation. Final dataset use per component
                is described in the research documents.
              </p>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <Subheading id="technologies" title="Technologies Used" />
            <dl className="space-y-6 border-t border-line pt-8">
              {technologyGroups.map((g) => (
                <div key={g.group} className="reveal grid gap-3 md:grid-cols-[minmax(0,12rem)_1fr] md:gap-8">
                  <dt className="pt-1.5 font-medium text-fg">{g.group}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2">
                      {g.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[13px] text-fg"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
