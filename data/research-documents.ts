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
 *        Canva         https://www.canva.com/design/<id>/<token>/view (view-only;
 *                      never an /edit link, which can grant editing rights)
 *   2. Paste it as `url` and set `status: "available"`.
 *   3. Set `format` if it is not already set (and `provider` if it cannot be
 *      detected from the URL).
 * To add a resource, append an object to `researchResources`; the UI needs no change.
 * A whole submission folder is shared once, as its category's `folderUrl`.
 *
 * Rules (enforced by `validateResources` at build time):
 *   - `status: "available"` requires an https URL. Without one, use "coming-soon".
 *   - Only `visibility: "public"` entries are ever rendered on the website.
 *   - A resource with `hold` is never linked, even with a URL (e.g. a Canva
 *     link that opens the editor). Remove `hold` once the link is fixed.
 *   - Canva URLs containing /edit fail the build.
 *   - Never invent filenames, dates, or URLs. `sourceName` is the exact name in the
 *     submission folder and is left out when the real file is not yet known.
 */

import { team } from "@/data/team";
import {
  formatDateRange,
  formatDateRangeLong,
  milestones,
} from "@/data/milestones";

export type ResourceFormat =
  | "PDF"
  | "DOCX"
  | "PPTX"
  | "XLSX"
  | "FOLDER"
  | "LINK"
  | "OTHER";
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
  | "log-book";

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
  /** Overrides the action label derived from `kind` (e.g. "Open Repository"). */
  action?: string;
  /** Exact file or folder name in the submission cloud, when known. */
  sourceName?: string;
  /** Also listed in the Presentations section under this assessment stage. */
  presentationStage?: PresentationStage;
  /** Subfolder inside the category folder, used to group rows (e.g. "Individual Reports"). */
  group?: string;
  /** Team member id (data/team.ts) for documents written by one researcher. */
  owner?: string;
  /** Why a supplied URL is withheld from the website. While set, the resource is not linked. */
  hold?: string;
};

export type FilterId =
  | "all"
  | "proposal"
  | "presentations"
  | "research-paper"
  | "final-reports"
  | "other";

export type DocumentCategory = {
  id: CategoryId;
  /** Folder name in the SLIIT submission cloud. */
  folder: string;
  title: string;
  description: string;
  filter: Exclude<FilterId, "all">;
  order: number;
  /** Public sharing link for the whole submission folder ("Anyone with the link can view"). */
  folderUrl?: string;
};

export const documentCategories: DocumentCategory[] = [
  {
    id: "project-proposal",
    folder: "Project Proposal",
    title: "Project Proposal",
    description: "Individual proposal reports and the proposal presentation.",
    filter: "proposal",
    order: 1,
    folderUrl:
      "https://drive.google.com/drive/folders/14xoAxrcZv_581UBSwosLjeEIeky58cRI?usp=drive_link",
  },
  {
    id: "progress-presentation-1",
    folder: "Progress Presentation - 1",
    title: "Progress Presentation 1",
    description: "Slides for the first progress review.",
    filter: "presentations",
    order: 2,
    folderUrl:
      "https://drive.google.com/drive/folders/1S05OK1YICZ9aFYDXDeQOGH7uO2X19Wq_?usp=drive_link",
  },
  {
    id: "progress-presentation-2",
    folder: "Progress Presentation - 2",
    title: "Progress Presentation 2",
    description: "Slides for the second progress review.",
    filter: "presentations",
    order: 3,
    folderUrl:
      "https://drive.google.com/drive/folders/1GxSziNrQD7fMT-V0Jz09qR5fOm-kc1z3?usp=drive_link",
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
    folderUrl:
      "https://drive.google.com/drive/folders/1glNfMq5OkoKh6zkQxH-wNjKHO94KLBPJ?usp=drive_link",
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
];

export const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "proposal", label: "Proposal" },
  { id: "presentations", label: "Presentations" },
  { id: "research-paper", label: "Research Paper" },
  { id: "final-reports", label: "Final Reports" },
  { id: "other", label: "Other" },
];

// Seeded from the verified folder structure (public Drive folders checked October 2026).

// The canva.link URLs were supplied by the group. They redirect to Canva share links
// ending /edit, so keep each design's link access at "Can view" in Canva.

export const researchResources: ResearchDocument[] = [
  // Project Proposal / Individual Reports (filenames verified in the public folder).
  ...(
    [
      [
        "dinitha-fernando",
        "R26-IT-038_IT22090744_Fernando M.D.T.pdf",
        "https://drive.google.com/file/d/1MM_0yKsCJdky_kWt59-mc0qVYWo92CYY/view?usp=drive_link",
      ],
      [
        "aweesha-wijesundara",
        "R26-IT-038_IT22183668_Wijesundara W.M.A.T.pdf",
        "https://drive.google.com/file/d/11P0gKfzTEvJfqIFj4gHcnxOGze_s5qe6/view",
      ],
      [
        "pratheesha-silva",
        "R26-IT-038_IT22219602_Silva S.P.S.pdf",
        "https://drive.google.com/file/d/1T83ULGNX1GYrgBaYv72IUPQI4J1MIpdl/view?usp=drive_link",
      ],
      [
        "ishara-udayanga",
        "R26-IT-038_IT22251046_Athapathtu A.W.M.I.U.pdf",
        "https://drive.google.com/file/d/1cYlINvdwTwWCUBZijGsMDKFKldd0j2bH/view?usp=drive_link",
      ],
    ] as const
  ).map(
    ([owner, sourceName, url]): ResearchDocument => ({
      id: `proposal-report-${owner}`,
      category: "project-proposal",
      group: "Individual Reports",
      title: "Individual Proposal Report",
      owner,
      format: "PDF",
      kind: "document",
      sourceName,
      url,
      status: "available",
      visibility: "public",
    }),
  ),

  // Project Proposal / Presentation
  {
    id: "proposal-slides",
    category: "project-proposal",
    group: "Presentation",
    title: "Proposal Presentation Slides",
    provider: "canva",
    kind: "presentation",
    presentationStage: "proposal",
    url: "https://canva.link/ttri8imzfh4gop6",
    status: "available",
    visibility: "public",
  },
  {
    id: "proposal-pptx",
    category: "project-proposal",
    group: "Presentation",
    title: "Proposal Presentation",
    format: "PPTX",
    kind: "presentation",
    sourceName: "R26-038-IT-Proposal Presentation.pptx",
    presentationStage: "proposal",
    url: "https://docs.google.com/presentation/d/1qEuboaSV1y0smN8TbyThqSG1Ob15aV4c/edit?usp=drive_link&ouid=112580306435014240380&rtpof=true&sd=true",
    status: "available",
    visibility: "public",
  },

  // Progress Presentation - 1 / Presentation
  {
    id: "pp1-slides",
    category: "progress-presentation-1",
    group: "Presentation",
    title: "PP1 Presentation Slides",
    provider: "canva",
    kind: "presentation",
    presentationStage: "pp1",
    url: "https://canva.link/vcfdcwi20zbslxw",
    status: "available",
    visibility: "public",
  },
  {
    id: "pp1-pptx",
    category: "progress-presentation-1",
    group: "Presentation",
    title: "PP1 Presentation",
    format: "PPTX",
    kind: "presentation",
    sourceName: "PP1 Presentation R26-IT-038.pptx",
    presentationStage: "pp1",
    url: "https://docs.google.com/presentation/d/1Aj58pVcnpXi-1noi4xURjbtjPjSNhrDi/edit?usp=drive_link&ouid=112580306435014240380&rtpof=true&sd=true",
    status: "available",
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

  // Progress Presentation - 2 / Presentation
  {
    id: "pp2-slides",
    category: "progress-presentation-2",
    group: "Presentation",
    title: "PP2 Presentation Slides",
    provider: "canva",
    kind: "presentation",
    presentationStage: "pp2",
    url: "https://canva.link/dc81xwv3jbrdwwe",
    status: "available",
    visibility: "public",
  },
  {
    id: "pp2-pptx",
    category: "progress-presentation-2",
    group: "Presentation",
    title: "PP2 Presentation",
    format: "PPTX",
    kind: "presentation",
    sourceName: "PP2 Presentation R26-IT-038.pptx",
    presentationStage: "pp2",
    url: "https://docs.google.com/presentation/d/1KrSVLNtDc_Ze0SkzM4GTnG0SA6yFEMNH/edit?usp=drive_link&ouid=112580306435014240380&rtpof=true&sd=true",
    status: "available",
    visibility: "public",
  },

  // Research Paper
  {
    id: "paper-voice",
    category: "research-paper",
    title: "Deepfake Voice Classification Research Paper",
    format: "PDF",
    kind: "paper",
    url: "https://drive.google.com/file/d/1hEPpv-MoxBwbpbwFutzeNpX3K70zvSDn/view?usp=sharing",
    status: "available",
    visibility: "public",
  },
  {
    id: "paper-text",
    category: "research-paper",
    title: "AI-Generated Text Classification Research Paper",
    format: "PDF",
    kind: "paper",
    url: "https://drive.google.com/file/d/1E-AlYZzmJaPFaxgZD1nW93-CMZxpWL00/view?usp=sharing",
    status: "available",
    visibility: "public",
  },

  // Final Report & Presentation / Group Research Thesis
  {
    id: "final-group-report-draft",
    category: "final-report-presentation",
    group: "Group Research Thesis",
    title: "Draft Final Group Research Report",
    description:
      "Draft version shared for review. This is not the approved final submission.",
    format: "PDF",
    kind: "document",
    url: "https://drive.google.com/file/d/1CbUdv5K12SIz0cLsTxNxU3QJCu6mDDZ_/view?usp=sharing",
    status: "available",
    visibility: "public",
  },

  // Final Report & Presentation / Individual Research Theses
  ...(
    [
      [
        "aweesha-wijesundara",
        "https://drive.google.com/file/d/1lsAycUiknDshzMsnmpkyFYdGs9u8lrOe/view?usp=sharing",
      ],
      [
        "dinitha-fernando",
        "https://drive.google.com/file/d/1h4vUX0UBdTl-O1NQkPMG8Y9trzhDv3Qx/view?usp=sharing",
      ],
      [
        "ishara-udayanga",
        "https://drive.google.com/file/d/1w2f8xg6a09Efaza7l6wBsfE0IJNOxHoR/view?usp=sharing",
      ],
      [
        "pratheesha-silva",
        "https://drive.google.com/file/d/1BuQmKOCuOohJh3rXTa446LqKjrj1PxOd/view?usp=drive_link",
      ],
    ] as const
  ).map(
    ([owner, url]): ResearchDocument => ({
      id: `thesis-${owner}`,
      category: "final-report-presentation",
      group: "Individual Research Theses",
      title: "Individual Research Thesis",
      owner,
      format: "PDF",
      kind: "document",
      url,
      status: "available",
      visibility: "public",
    }),
  ),

  // Final Report & Presentation / Presentation
  {
    id: "final-presentation",
    category: "final-report-presentation",
    group: "Presentation",
    title: "Final Research Presentation",
    provider: "canva",
    kind: "presentation",
    presentationStage: "final",
    url: "https://canva.link/l52soh0z42sm2ag",
    status: "available",
    visibility: "public",
  },

  // Check List Documents
  {
    id: "checklist-01-github",
    category: "checklist-documents",
    title: "Checklist 01 — GitHub Repository",
    format: "LINK",
    kind: "resource",
    action: "Open Repository",
    url: "https://github.com/DinithaFdo/R26-IT-038#robust-explainable-multi-modal-classification-of-deepfake-voice-and-ai-generated-text",
    status: "available",
    visibility: "public",
  },
  {
    id: "checklist-02",
    category: "checklist-documents",
    title: "Checklist 02",
    format: "XLSX",
    kind: "document",
    url: "https://docs.google.com/spreadsheets/d/1NTrHpI4NEQ1bNQn1vp1NMkFwg5am-vWt/edit?usp=sharing&ouid=112580306435014240380&rtpof=true&sd=true",
    status: "available",
    visibility: "public",
  },

  // Website
  {
    id: "website-live",
    category: "website",
    title: "Explic Research Website",
    format: "LINK",
    kind: "resource",
    action: "Visit Website",
    url: "https://explic-info.vercel.app/",
    status: "available",
    visibility: "public",
  },
  {
    id: "website-repository",
    category: "website",
    title: "Research Website — GitHub Repository",
    format: "LINK",
    kind: "resource",
    action: "Open Repository",
    url: "https://github.com/aweeshathavishanka/explic-research-web",
    status: "available",
    visibility: "public",
  },

  // Log Book: one logbook per researcher.
  {
    id: "logbook-aweesha-wijesundara",
    category: "log-book",
    title: "Research Logbook",
    owner: "aweesha-wijesundara",
    format: "PDF",
    kind: "document",
    action: "View Logbook",
    url: "https://drive.google.com/file/d/1oYUyWD8XBGuHzVTGhsTW7c9iz2atuJzf/view?usp=sharing",
    status: "available",
    visibility: "public",
  },
  ...(["dinitha-fernando", "ishara-udayanga", "pratheesha-silva"] as const).map(
    (owner): ResearchDocument => ({
      id: `logbook-${owner}`,
      category: "log-book",
      title: "Research Logbook",
      owner,
      kind: "document",
      status: "coming-soon",
      visibility: "public",
    }),
  ),
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

/** A resource is linkable only when marked available, not on hold, AND it has a valid https URL. */
export function isAvailable(
  r: ResearchDocument,
): r is ResearchDocument & { url: string } {
  return r.status === "available" && !r.hold && isValidResourceUrl(r.url);
}

export function detectProvider(
  r: ResearchDocument,
): ResourceProvider | undefined {
  if (r.provider) return r.provider;
  if (!isValidResourceUrl(r.url)) return undefined;
  const host = new URL(r.url).hostname;
  if (host.endsWith("drive.google.com") || host.endsWith("docs.google.com"))
    return "google-drive";
  if (
    host.endsWith("1drv.ms") ||
    host.endsWith("onedrive.live.com") ||
    host.endsWith("sharepoint.com")
  )
    return "onedrive";
  if (host.endsWith("canva.com") || host === "canva.link") return "canva";
  return "other";
}

export const providerLabel: Record<ResourceProvider, string> = {
  "google-drive": "Google Drive",
  onedrive: "OneDrive",
  canva: "Canva Slides",
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
  paper: "View Research Paper",
  resource: "Open Resource",
};

/** Canva editor links can grant editing rights to anyone holding them. */
function isCanvaEditUrl(url: string | undefined) {
  if (!isValidResourceUrl(url)) return false;
  const { hostname, pathname } = new URL(url);
  return hostname.endsWith("canva.com") && /\/edit\/?$/.test(pathname);
}

/** Fails the build on configuration mistakes instead of shipping a broken link. */
function validateResources(list: ResearchDocument[]) {
  const ids = new Set<string>();
  const categories = new Set(documentCategories.map((c) => c.id));
  for (const c of documentCategories) {
    if (c.folderUrl !== undefined && !isValidResourceUrl(c.folderUrl)) {
      throw new Error(
        `research-documents: category "${c.id}" has an invalid folderUrl`,
      );
    }
  }
  for (const r of list) {
    if (isCanvaEditUrl(r.url)) {
      throw new Error(
        `research-documents: "${r.id}" is a Canva /edit link. Use a view-only link.`,
      );
    }
    if (r.owner && !team.some((p) => p.id === r.owner)) {
      throw new Error(
        `research-documents: "${r.id}" has an unknown owner "${r.owner}"`,
      );
    }
    if (ids.has(r.id))
      throw new Error(`research-documents: duplicate id "${r.id}"`);
    ids.add(r.id);
    if (!categories.has(r.category))
      throw new Error(`research-documents: unknown category on "${r.id}"`);
    if (r.status === "available" && !isValidResourceUrl(r.url)) {
      throw new Error(
        `research-documents: "${r.id}" is "available" but has no valid https URL`,
      );
    }
  }
  return list;
}

/**
 * Public resources only. Import this module from Server Components only: client
 * components receive the `ResourceView` objects below as props, so internal
 * entries never reach the exported HTML or JavaScript.
 */
export const publicResources = validateResources(researchResources).filter(
  (r) => r.visibility === "public",
);

export const sortedCategories = [...documentCategories].sort(
  (a, b) => a.order - b.order,
);

export function matchesFilter(r: ResearchDocument, filter: FilterId): boolean {
  if (filter === "all") return true;
  const categoryFilter = documentCategories.find(
    (c) => c.id === r.category,
  )?.filter;
  // Presentation slides also appear under "Presentations" when filed in another folder.
  if (filter === "presentations")
    return r.kind === "presentation" || categoryFilter === "presentations";
  return categoryFilter === filter;
}

/** Serializable, public-only shape handed to the UI (including client components). */
export type ResourceView = {
  id: string;
  title: string;
  group?: string;
  owner?: { name: string; studentId?: string };
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
  folderUrl?: string;
  resources: ResourceView[];
};

export function toResourceView(r: ResearchDocument): ResourceView {
  const provider = detectProvider(r);
  const owner = r.owner ? team.find((p) => p.id === r.owner) : undefined;
  return {
    id: r.id,
    title: r.title,
    group: r.group,
    owner: owner ? { name: owner.name, studentId: owner.studentId } : undefined,
    description: r.description,
    format: r.format ? formatLabel[r.format] : undefined,
    provider: provider ? providerLabel[provider] : undefined,
    sourceName: r.sourceName,
    url: isAvailable(r) ? r.url : undefined,
    action:
      r.action ?? (provider === "canva" ? "View Slides" : actionLabel[r.kind]),
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
    folderUrl: c.folderUrl,
    resources: publicResources
      .filter((r) => r.category === c.id)
      .map(toResourceView),
  }));
}

/* ------------------------------------------------------------------ */
/* Presentations: one card per assessment stage, built from the same   */
/* records, folder links, and milestone dates as the Documents archive. */
/* ------------------------------------------------------------------ */

export const presentationStages: {
  id: PresentationStage;
  title: string;
  /** Assessment type label shown above the title. */
  assessment: string;
  /** Date and assessment weight come from this milestone. */
  milestoneId: string;
  /** The Drive folder for this stage is this category's `folderUrl`. */
  category: CategoryId;
}[] = [
  {
    id: "proposal",
    title: "Proposal Presentation",
    assessment: "Project Proposal",
    milestoneId: "proposal-presentation",
    category: "project-proposal",
  },
  {
    id: "pp1",
    title: "Progress Presentation 1",
    assessment: "Progress Review 1",
    milestoneId: "progress-presentation-1",
    category: "progress-presentation-1",
  },
  {
    id: "pp2",
    title: "Progress Presentation 2",
    assessment: "Progress Review 2",
    milestoneId: "progress-presentation-2",
    category: "progress-presentation-2",
  },
  {
    id: "final",
    title: "Final Presentation",
    assessment: "Final Assessment",
    milestoneId: "final-presentation-viva",
    category: "final-report-presentation",
  },
];

export type PresentationView = {
  id: PresentationStage;
  title: string;
  assessment: string;
  date?: { short: string; long: string };
  weight?: number;
  /** Canva slides; `url` only when publishable. */
  slides: { title: string; url?: string };
  driveFolderUrl?: string;
  /** Slide files registered in the folder; `url` only when a file-level link exists. */
  files: { id: string; name: string; format?: string; url?: string }[];
};

export function getPresentationViews(): PresentationView[] {
  return presentationStages.map((s) => {
    const m = milestones.find((x) => x.id === s.milestoneId);
    const records = publicResources.filter((r) => r.presentationStage === s.id);
    const slides = records.find((r) => detectProvider(r) === "canva");
    return {
      id: s.id,
      title: s.title,
      assessment: s.assessment,
      date: m
        ? {
            short: formatDateRange(m.startDate, m.endDate),
            long: formatDateRangeLong(m.startDate, m.endDate),
          }
        : undefined,
      weight: m?.moduleWeight?.value,
      slides: {
        title: slides?.title ?? `${s.title} slides`,
        url: slides && isAvailable(slides) ? slides.url : undefined,
      },
      driveFolderUrl: documentCategories.find((c) => c.id === s.category)
        ?.folderUrl,
      files: records
        .filter((r) => r !== slides && r.sourceName)
        .map((r) => ({
          id: r.id,
          name: r.sourceName!,
          format: r.format,
          url: isAvailable(r) ? r.url : undefined,
        })),
    };
  });
}
