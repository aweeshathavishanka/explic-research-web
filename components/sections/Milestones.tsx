import { Section, SectionHeader } from "@/components/ui/SectionHeading";
import { MilestoneTimeline } from "@/components/sections/MilestoneTimeline";

export function Milestones() {
  return (
    <Section id="milestones" labelledBy="milestones-title">
      <SectionHeader
        id="milestones-title"
        title="Assessment timeline"
        lede="The official 2026 SLIIT research project assessment schedule, in date order. Open an assessment for its full date, type, and module weight."
      />

      <MilestoneTimeline />

      <p className="mt-6 max-w-[70ch] text-[13px] leading-relaxed text-subtle md:pl-[14.5rem]">
        Dates follow the official assessment schedule. Module weights are each assessment&apos;s contribution to the final
        module grade, taken from the official SLIIT rubrics; they are not marks achieved. An assessment is marked Completed only
        once the group confirms it, and a past date without that confirmation shows as Not confirmed.
      </p>
    </Section>
  );
}
