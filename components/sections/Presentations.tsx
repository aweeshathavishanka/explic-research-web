import { publicResources, toResourceView, type PresentationStage } from "@/data/research-documents";
import { formatDateRange, formatDateRangeLong, milestones } from "@/data/milestones";
import { Section, SectionHeader } from "@/components/ui/SectionHeading";
import { ResourceAction } from "@/components/ui/ResourceAction";

// Each assessment stage, linked to its milestone so dates are maintained in one place.
const stages: { id: PresentationStage; title: string; stage: string; milestoneId: string }[] = [
  { id: "proposal", title: "Proposal Presentation", stage: "Project Proposal", milestoneId: "proposal-presentation" },
  { id: "pp1", title: "Progress Presentation 1", stage: "Progress Review 1", milestoneId: "progress-presentation-1" },
  { id: "pp2", title: "Progress Presentation 2", stage: "Progress Review 2", milestoneId: "progress-presentation-2" },
  { id: "final", title: "Final Presentation", stage: "Final Assessment", milestoneId: "final-presentation-viva" },
];

export function Presentations() {
  // Same source as the Documents archive: resources tagged with a presentation stage.
  const slides = publicResources.filter((r) => r.presentationStage).map(toResourceView);

  return (
    <Section id="presentations" labelledBy="presentations-title">
      <SectionHeader
        id="presentations-title"
        title="Presentation archive"
        lede="Slides from each assessment stage. Each link opens the presentation on Google Drive, OneDrive, or Canva in a new tab."
      />

      {/* One continuous strip: four columns on desktop, 2 × 2 on tablet, stacked on mobile. */}
      <ul className="reveal mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((s) => {
          const m = milestones.find((x) => x.id === s.milestoneId);
          const items = slides.filter((r) => r.presentationStage === s.id);
          return (
            <li key={s.id} className="flex flex-col bg-bg p-6">
              <p className="font-mono text-xs text-subtle">{s.stage}</p>
              <h3 className="mt-2 text-lg font-medium text-fg">{s.title}</h3>
              <dl className="mt-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-subtle">Date</dt>
                  <dd className={m ? "font-mono text-fg" : "text-subtle"}>
                    {m ? (
                      <>
                        <span aria-hidden>{formatDateRange(m.startDate, m.endDate)}</span>
                        <span className="sr-only">{formatDateRangeLong(m.startDate, m.endDate)}</span>
                      </>
                    ) : (
                      "To be confirmed"
                    )}
                  </dd>
                </div>
              </dl>
              <ul className="mt-6 space-y-5 border-t border-line pt-5">
                {items.map((r) => (
                  <li key={r.id}>
                    <p className="text-sm font-medium text-fg">{r.title}</p>
                    {r.format || r.provider ? (
                      <p className="mt-0.5 font-mono text-xs text-subtle">{[r.format, r.provider].filter(Boolean).join(", ")}</p>
                    ) : null}
                    <div className="mt-3">
                      <ResourceAction url={r.url} label={r.action} title={r.title} />
                    </div>
                  </li>
                ))}
                {items.length === 0 ? <li className="text-sm text-subtle">No slides listed yet.</li> : null}
              </ul>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
