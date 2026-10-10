import { Section, SectionHeader } from "@/components/ui/SectionHeading";
import { MilestoneTimeline } from "@/components/sections/MilestoneTimeline";

export function Milestones() {
  return (
    <Section id="milestones" labelledBy="milestones-title">
      <SectionHeader
        id="milestones-title"
        title="Assessment timeline"
        lede="The official 2026 SLIIT research project assessment schedule, in date order. Open an assessment for its full date, type, and allocated marks."
      />

      <MilestoneTimeline />

      <p className="mt-6 max-w-[70ch] text-[13px] leading-relaxed text-subtle md:pl-[14.5rem]">
        Dates follow the official assessment schedule. An assessment is marked Completed only once the group confirms
        it; a past date without that confirmation shows as Not confirmed. Allocated marks will be added when published.
      </p>
    </Section>
  );
}
