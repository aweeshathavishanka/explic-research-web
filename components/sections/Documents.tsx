import { filters, getCategoryViews } from "@/data/research-documents";
import { Section, SectionHeader } from "@/components/ui/SectionHeading";
import { DocumentLibrary } from "@/components/sections/DocumentLibrary";

export function Documents() {
  // Built at export time: only public resources are serialised into the page.
  const categories = getCategoryViews();
  return (
    <Section id="documents" labelledBy="documents-title">
      <SectionHeader
        id="documents-title"
        label="RESEARCH RESOURCES"
        title="Research Documents"
        lede="Explore research proposals, assessment presentations, academic publications, project reports, and supporting resources from the Explic research project."
      />
      <DocumentLibrary categories={categories} filters={filters} />
      <p className="mt-8 max-w-[70ch] text-[13px] leading-relaxed text-subtle">
        Documents are hosted on Google Drive, OneDrive, or Canva and open in a new tab. Resources marked Coming soon
        will be linked once they are approved for public release.
      </p>
    </Section>
  );
}
