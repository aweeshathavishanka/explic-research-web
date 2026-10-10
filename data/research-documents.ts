/**
 * Research resource archive: the single source for the Documents and
 * Presentations sections.
 *
 * Mirrors the top-level folders of the SLIIT submission cloud for group
 * R26-IT-038. Files stay on Google Drive / OneDrive / Canva; the website only
 * links to them, so nothing here adds to the exported site size.
 *
 * To publish a resource:
 *   1. Create a sharing link ("Anyone with the link can view"):
 *        Google Drive  https://drive.google.com/file/d/<id>/view
 *        OneDrive      https://1drv.ms/... or https://<tenant>-my.sharepoint.com/...
 *        Canva         https://www.canva.com/design/<id>/view
 *   2. Paste it as `url` and set `status: "available"`.
 *   3. Set `format` if it is not already set (and `provider` if it cannot be
 *      detected from the URL).
 * To add a resource, append an object to `researchResources`; the UI needs no change.
 *
 * Rules (enforced by `validateResources` at build time):
 *   - `status: "available"` requires an https URL. Without one, use "coming-soon".
 *   - Only `visibility: "public"` entries are ever rendered on the website.
 *   - Never invent filenames, dates, or URLs. `sourceName` is the exact name in the
 *     submission folder and is left out when the real file is not yet known.
 */

export type ResourceFormat = "PDF" | "DOCX" | "PPTX" | "XLSX" | "FOLDER" | "LINK" | "OTHER";
export type ResourceProvider = "google-drive" | "onedrive" | "canva" | "other";
export type ResourceKind = "document" | "presentation" | "paper" | "resource";
export type PresentationStage = "proposal" | "pp1" | "pp2" | "final";

export type CategoryId =
  | "project-proposal"
  | "progress-presentation-1"
  | "progress-presentation-2"
  | "research-paper"
  | "final-report-presentation"
  | "checklist-documents"
  | "website"
  | "log-book"
  | "project-registration";

export type ResearchDocument = {
  id: string;
  category: CategoryId;
  title: string;
  description?: string;
  format?: ResourceFormat;
  provider?: ResourceProvider;
  url?: string;
  status: "available" | "coming-soon";
  visibility: "public" | "internal";
  /** Decides the action label: View Document, View Presentation, Open Research Paper, Open Resource. */
  kind: ResourceKind;
  /** Exact file or folder name in the submission cloud, when known. */
  sourceName?: string;
  /** Also listed in the Presentations section under this assessment stage. */
  presentationStage?: PresentationStage;
};

export type FilterId = "all" | "proposal" | "presentations" | "research-paper" | "final-reports" | "other";

export type DocumentCategory = {
  id: CategoryId;
  /** Folder name in the SLIIT submission cloud. */
  folder: string;
  title: string;
  description: string;
  filter: Exclude<FilterId, "all">;
  order: number;
};

export const documentCategories: DocumentCategory[] = [
  {
    id: "project-proposal",
    folder: "Project Proposal",
    title: "Project Proposal",
    description: "Individual proposal reports and the proposal presentation.",
    filter: "proposal",
    order: 1,
  },
  {
    id: "progress-presentation-1",
    folder: "Progress Presentation - 1",
    title: "Progress Presentation 1",
    description: "Slides for the first progress review.",
    filter: "presentations",
    order: 2,
  },
  {
    id: "progress-presentation-2",
    folder: "Progress Presentation - 2",
    title: "Progress Presentation 2",
    description: "Slides for the second progress review.",
    filter: "presentations",
    order: 3,
  },
  {
    id: "research-paper",
    folder: "Research Paper",
    title: "Research Paper",
    description: "Research publications produced from the project.",
    filter: "research-paper",
    order: 4,
  },
  {
    id: "final-report-presentation",
    folder: "Final Report & Presentation",
    title: "Final Report & Presentation",
    description: "The final research report and final presentation.",
    filter: "final-reports",
    order: 5,
  },
  {
    id: "checklist-documents",
    folder: "Check List Documents",
    title: "Checklist Documents",
    description: "Research checklists submitted during the project.",
    filter: "other",
    order: 6,
  },
  {
    id: "website",
    folder: "Website",
    title: "Website",
    description: "Research website resources and source repository.",
    filter: "other",
    order: 7,
  },
  {
    id: "log-book",
    folder: "Log Book",
    title: "Log Book",
    description: "Biweekly research logbooks.",
    filter: "other",
    order: 8,
  },
  {
    id: "project-registration",
    folder: "Project Registration Documents",
    title: "Project Registration Documents",
    description: "Registration records. Only documents explicitly marked public are listed.",
    filter: "other",
    order: 9,
  },
];

export const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "proposal", label: "Proposal" },
  { id: "presentations", label: "Presentations" },
  { id: "research-paper", label: "Research Paper" },
  { id: "final-reports", label: "Final Reports" },
  { id: "other", label: "Other" },
];

// Seeded from the verified folder structure. TODO(content): add each sharing URL.
export const researchResources: ResearchDocument[] = [
  // Project Proposal
  {
    id: "proposal-individual-reports",
    category: "project-proposal",
    title: "Individual Proposal Reports",
    description: "Proposal reports for each of the four research components.",
    format: "FOLDER",
    kind: "document",
    sourceName: "Individual Reports",
    status: "coming-soon",
    visibility: "public",
  },
  {
    id: "proposal-presentation",
    category: "project-proposal",
    title: "Proposal Presentation",
    description: "Slides presented at the proposal assessment.",
    format: "FOLDER",
    kind: "presentation",
    sourceName: "Presentation",
    presentationStage: "proposal",
    status: "coming-soon",
    visibility: "public",
  },

  // Progress Presentation - 1
  {
    id: "pp1-presentation",
    category: "progress-presentation-1",
    title: "PP1 Presentation",
    description: "Slide deck for the first progress review.",
    format: "PPTX",
    kind: "presentation",
    sourceName: "PP1 Presentation R26-IT-038.pptx",
    presentationStage: "pp1",
    status: "coming-soon",
    visibility: "public",
  },
  {
    id: "pp1-canva",
    category: "progress-presentation-1",
    title: "PP1 Presentation on Canva",
    description: "The same presentation, viewable online in Canva.",
    format: "LINK",
    provider: "canva",
    kind: "presentation",
    sourceName: "PP1 Presentation Canva Link.url",
    presentationStage: "pp1",
    status: "coming-soon",
    visibility: "public",
  },
  {
    id: "pp1-readme",
    category: "progress-presentation-1",
    title: "PP1 ReadMe",
    format: "OTHER",
    kind: "resource",
    sourceName: "ReadMe.txt",
    status: "coming-soon",
    visibility: "internal",
  },

  // Progress Presentation - 2 (contents not yet verified)
  {
    id: "pp2-presentation",
    category: "progress-presentation-2",
    title: "PP2 Presentation",
    description: "Slide deck for the second progress review.",
    kind: "presentation",
    presentationStage: "pp2",
    status: "coming-soon",
    visibility: "public",
  },

  // Research Paper (contents not yet verified)
  {
    id: "research-paper",
    category: "research-paper",
    title: "Research Paper",
    description: "Publication links will be added once available.",
    kind: "paper",
    status: "coming-soon",
    visibility: "public",
  },

  // Final Report & Presentation (contents not yet verified)
  {
    id: "final-report",
    category: "final-report-presentation",
    title: "Final Report",
    description: "The final research report.",
    kind: "document",
    status: "coming-soon",
    visibility: "public",
  },
  {
    id: "final-presentation",
    category: "final-report-presentation",
    title: "Final Presentation",
    description: "Slides for the final assessment.",
    kind: "presentation",
    presentationStage: "final",
    status: "coming-soon",
    visibility: "public",
  },

  // Check List Documents (contents not yet verified)
  {
    id: "checklists",
    category: "checklist-documents",
    title: "Research Checklists",
    description: "Checklist documents submitted during the project.",
    kind: "document",
    status: "coming-soon",
    visibility: "public",
  },

  // Website (contents not yet verified)
  {
    id: "website-resources",
    category: "website",
    title: "Website Resources",
    description: "Research website files or source repository link.",
    kind: "resource",
    status: "coming-soon",
    visibility: "public",
  },

  // Log Book (contents not yet verified)
  {
    id: "log-books",
    category: "log-book",
    title: "Biweekly Research Logbooks",
    description: "Logbooks recording research progress every two weeks.",
    kind: "document",
    status: "coming-soon",
    visibility: "public",
  },

  // Project Registration Documents: administrative, internal unless explicitly made public.
  {
    id: "registration-documents",
    category: "project-registration",
    title: "Project Registration Documents",
    kind: "document",
    status: "coming-soon",
    visibility: "internal",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers shared by the Documents and Presentations sections.         */
/* ------------------------------------------------------------------ */

export function isValidResourceUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

/** A resource is linkable only when marked available AND it has a valid https URL. */
export function isAvailable(r: ResearchDocument): r is ResearchDocument & { url: string } {
  return r.status === "available" && isValidResourceUrl(r.url);
}

export function detectProvider(r: ResearchDocument): ResourceProvider | undefined {
  if (r.provider) return r.provider;
  if (!isValidResourceUrl(r.url)) return undefined;
  const host = new URL(r.url).hostname;
  if (host.endsWith("drive.google.com") || host.endsWith("docs.google.com")) return "google-drive";
  if (host.endsWith("1drv.ms") || host.endsWith("onedrive.live.com") || host.endsWith("sharepoint.com")) return "onedrive";
  if (host.endsWith("canva.com")) return "canva";
  return "other";
}

export const providerLabel: Record<ResourceProvider, string> = {
  "google-drive": "Google Drive",
  onedrive: "OneDrive",
  canva: "Canva",
  other: "External link",
};

export const formatLabel: Record<ResourceFormat, string> = {
  PDF: "PDF",
  DOCX: "DOCX",
  PPTX: "PPTX",
  XLSX: "XLSX",
  FOLDER: "Folder",
  LINK: "Link",
  OTHER: "File",
};

export const actionLabel: Record<ResourceKind, string> = {
  document: "View Document",
  presentation: "View Presentation",
  paper: "Open Research Paper",
  resource: "Open Resource",
};

/** Fails the build on configuration mistakes instead of shipping a broken link. */
function validateResources(list: ResearchDocument[]) {
  const ids = new Set<string>();
  const categories = new Set(documentCategories.map((c) => c.id));
  for (const r of list) {
    if (ids.has(r.id)) throw new Error(`research-documents: duplicate id "${r.id}"`);
    ids.add(r.id);
    if (!categories.has(r.category)) throw new Error(`research-documents: unknown category on "${r.id}"`);
    if (r.status === "available" && !isValidResourceUrl(r.url)) {
      throw new Error(`research-documents: "${r.id}" is "available" but has no valid https URL`);
    }
  }
  return list;
}

/**
 * Public resources only. Import this module from Server Components only: client
 * components receive the `ResourceView` objects below as props, so internal
 * entries never reach the exported HTML or JavaScript.
 */
export const publicResources = validateResources(researchResources).filter((r) => r.visibility === "public");

export const sortedCategories = [...documentCategories].sort((a, b) => a.order - b.order);

export function matchesFilter(r: ResearchDocument, filter: FilterId): boolean {
  if (filter === "all") return true;
  const categoryFilter = documentCategories.find((c) => c.id === r.category)?.filter;
  // Presentation slides also appear under "Presentations" when filed in another folder.
  if (filter === "presentations") return r.kind === "presentation" || categoryFilter === "presentations";
  return categoryFilter === filter;
}

/** Serializable, public-only shape handed to the UI (including client components). */
export type ResourceView = {
  id: string;
  title: string;
  description?: string;
  format?: string;
  provider?: string;
  sourceName?: string;
  /** Present only when the resource is available with a valid https URL. */
  url?: string;
  action: string;
  kind: ResourceKind;
  filters: FilterId[];
  presentationStage?: PresentationStage;
};

export type CategoryView = {
  id: CategoryId;
  title: string;
  folder: string;
  description: string;
  filter: DocumentCategory["filter"];
  resources: ResourceView[];
};

export function toResourceView(r: ResearchDocument): ResourceView {
  const provider = detectProvider(r);
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    format: r.format ? formatLabel[r.format] : undefined,
    provider: provider ? providerLabel[provider] : undefined,
    sourceName: r.sourceName,
    url: isAvailable(r) ? r.url : undefined,
    action: actionLabel[r.kind],
    kind: r.kind,
    filters: filters.map((f) => f.id).filter((f) => matchesFilter(r, f)),
    presentationStage: r.presentationStage,
  };
}

export function getCategoryViews(): CategoryView[] {
  return sortedCategories.map((c) => ({
    id: c.id,
    title: c.title,
    folder: c.folder,
    description: c.description,
    filter: c.filter,
    resources: publicResources.filter((r) => r.category === c.id).map(toResourceView),
  }));
}
