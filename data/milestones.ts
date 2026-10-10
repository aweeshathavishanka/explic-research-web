/**
 * Official SLIIT Research Project Assessment Schedule, 2026 (13 events).
 *
 * Source: the official assessment schedule supplied by the group. Titles and
 * dates are copied exactly; do not change them unless the schedule is reissued.
 *
 * - The array follows the official schedule order (`scheduleNo` 1 to 13). The
 *   timeline sorts by start date, so item 3 (13 May) appears after item 4
 *   (11 to 13 May), as the dates require.
 * - Dates are ISO calendar dates (yyyy-mm-dd). They are date-only and are never
 *   converted through a timezone.
 * - `completion` records confirmed completion only. A date in the past is not
 *   confirmation. When an assessment is done, change "not-confirmed" to "completed".
 * - `marks`: allocated marks from the official guidelines. `null` until supplied,
 *   shown as "To be confirmed", never as 0.
 */

export type MilestoneType =
  | "submission"
  | "presentation"
  | "evaluation"
  | "publication";

/** UI grouping only. The official schedule itself has no categories. */
export type MilestoneCategory =
  | "proposal"
  | "progress"
  | "final-submissions"
  | "final-evaluation"
  | "publication";

export type CompletionStatus = "completed" | "not-confirmed";

export type Milestone = {
  id: string;
  /** Position in the official schedule (1 to 13). */
  scheduleNo: number;
  /** Exact name from the official schedule. */
  title: string;
  startDate: string;
  /** Last day, for events that run over several days. */
  endDate?: string;
  type: MilestoneType;
  category: MilestoneCategory;
  completion: CompletionStatus;
  /** Major assessment: given more typographic weight in the timeline. */
  key?: boolean;
  description?: string;
  marks: number | null;
};

export const milestoneCategories: Record<MilestoneCategory, string> = {
  proposal: "Project Proposal",
  progress: "Progress Assessments",
  "final-submissions": "Final Research Submissions",
  "final-evaluation": "Final Evaluation",
  publication: "Research Publication",
};

export const milestoneTypes: Record<MilestoneType, string> = {
  submission: "Submission",
  presentation: "Presentation",
  evaluation: "Evaluation",
  publication: "Publication",
};

// TODO(content): add allocated marks (`marks`) from the official module guidelines.
export const milestones: Milestone[] = [
  {
    id: "proposal-submission",
    scheduleNo: 1,
    title: "Proposal Submission",
    startDate: "2026-03-15",
    type: "submission",
    category: "proposal",
    completion: "completed",
    marks: null,
  },
  {
    id: "proposal-presentation",
    scheduleNo: 2,
    title: "Proposal Presentation",
    startDate: "2026-03-16",
    endDate: "2026-03-18",
    type: "presentation",
    category: "proposal",
    completion: "completed",
    marks: null,
  },
  {
    id: "checklist-submission",
    scheduleNo: 3,
    title: "Check List Submission",
    startDate: "2026-05-13",
    type: "submission",
    category: "progress",
    completion: "completed",
    marks: null,
  },
  {
    id: "progress-presentation-1",
    scheduleNo: 4,
    title: "Progress Presentation 1",
    startDate: "2026-05-11",
    endDate: "2026-05-13",
    type: "presentation",
    category: "progress",
    completion: "completed",
    marks: null,
  },
  {
    id: "progress-presentation-2",
    scheduleNo: 5,
    title: "Progress Presentation 2",
    startDate: "2026-08-31",
    endDate: "2026-09-02",
    type: "presentation",
    category: "progress",
    completion: "completed", // TODO(content): set to "completed" once confirmed
    key: true,
    marks: null,
  },
  {
    id: "draft-thesis-submission",
    scheduleNo: 6,
    title: "Draft Thesis Submission",
    startDate: "2026-10-11",
    type: "submission",
    category: "final-submissions",
    completion: "not-confirmed",
    key: true,
    marks: null,
  },
  {
    id: "website-submission",
    scheduleNo: 7,
    title: "Website Submission",
    startDate: "2026-10-11",
    type: "submission",
    category: "final-submissions",
    completion: "not-confirmed",
    key: true,
    marks: null,
  },
  {
    id: "final-checklist-submission",
    scheduleNo: 8,
    title: "Final Check List Submission",
    startDate: "2026-10-14",
    type: "submission",
    category: "final-submissions",
    completion: "not-confirmed",
    marks: null,
  },
  {
    id: "final-presentation-viva",
    scheduleNo: 9,
    title: "Final Presentation and Viva",
    startDate: "2026-10-19",
    endDate: "2026-10-21",
    type: "presentation",
    category: "final-evaluation",
    completion: "not-confirmed",
    key: true,
    marks: null,
  },
  {
    id: "website-evaluation-logbook",
    scheduleNo: 10,
    title: "Website Evaluation & Logbook Submission",
    startDate: "2026-10-19",
    endDate: "2026-10-21",
    type: "evaluation",
    category: "final-evaluation",
    completion: "not-confirmed",
    key: true,
    marks: null,
  },
  {
    id: "research-paper-submission",
    scheduleNo: 11,
    title: "Research Paper Submission",
    startDate: "2026-10-23",
    type: "submission",
    category: "publication",
    completion: "not-confirmed",
    marks: null,
  },
  {
    id: "final-thesis-submission",
    scheduleNo: 12,
    title: "Final Thesis Submission",
    startDate: "2026-10-28",
    type: "submission",
    category: "final-submissions",
    completion: "not-confirmed",
    key: true,
    marks: null,
  },
  {
    id: "publication-evidence-submission",
    scheduleNo: 13,
    title: "Research Paper Publication Evidence Submission",
    startDate: "2026-12-01",
    type: "publication",
    category: "publication",
    completion: "not-confirmed",
    marks: null,
  },
];

/* ------------------------------------------------------------------ */
/* Dates. ISO strings compare correctly as text, so no Date objects or  */
/* timezones are involved.                                             */
/* ------------------------------------------------------------------ */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parts(iso: string) {
  const [, y, m, d] = ISO_DATE.exec(iso) ?? [];
  return { year: Number(y), month: Number(m), day: d };
}

function isCalendarDate(iso: string) {
  if (!ISO_DATE.test(iso)) return false;
  const { year, month, day } = parts(iso);
  const date = new Date(Date.UTC(year, month - 1, Number(day)));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === Number(day)
  );
}

/** Short form for display, e.g. "15 Mar 2026", "16-18 Mar 2026", "31 Aug - 02 Sep 2026". */
export function formatDateRange(start: string, end?: string) {
  const s = parts(start);
  const short = (p: ReturnType<typeof parts>) =>
    MONTHS[p.month - 1].slice(0, 3);
  if (!end || end === start) return `${s.day} ${short(s)} ${s.year}`;
  const e = parts(end);
  if (s.year !== e.year)
    return `${s.day} ${short(s)} ${s.year} - ${e.day} ${short(e)} ${e.year}`;
  if (s.month !== e.month)
    return `${s.day} ${short(s)} - ${e.day} ${short(e)} ${e.year}`;
  return `${s.day}-${e.day} ${short(s)} ${s.year}`;
}

/** Full form for screen readers and details, e.g. "31 August to 2 September 2026". */
export function formatDateRangeLong(start: string, end?: string) {
  const s = parts(start);
  const long = (p: ReturnType<typeof parts>) =>
    `${Number(p.day)} ${MONTHS[p.month - 1]}`;
  if (!end || end === start) return `${long(s)} ${s.year}`;
  const e = parts(end);
  if (s.year !== e.year) return `${long(s)} ${s.year} to ${long(e)} ${e.year}`;
  if (s.month !== e.month) return `${long(s)} to ${long(e)} ${e.year}`;
  return `${Number(s.day)} to ${long(e)} ${e.year}`;
}

export type ScheduleState = "past" | "current" | "upcoming";

/** Where an event sits relative to `today` (yyyy-mm-dd). Says nothing about completion. */
export function scheduleState(m: Milestone, today: string): ScheduleState {
  const end = m.endDate ?? m.startDate;
  if (end < today) return "past";
  if (m.startDate > today) return "upcoming";
  return "current";
}

/** Chronological order by start date; same-day events keep their schedule order. */
export const timeline: Milestone[] = [...milestones].sort(
  (a, b) =>
    a.startDate.localeCompare(b.startDate) || a.scheduleNo - b.scheduleNo,
);

// Fail the build on a malformed entry rather than publish a wrong date.
for (const m of milestones) {
  if (!isCalendarDate(m.startDate))
    throw new Error(
      `milestones: "${m.id}" has an invalid startDate "${m.startDate}"`,
    );
  if (
    m.endDate !== undefined &&
    (!isCalendarDate(m.endDate) || m.endDate < m.startDate)
  ) {
    throw new Error(
      `milestones: "${m.id}" has an invalid endDate "${m.endDate}"`,
    );
  }
  if (m.marks !== null && !(Number.isFinite(m.marks) && m.marks > 0)) {
    throw new Error(
      `milestones: "${m.id}" marks must be a positive number or null`,
    );
  }
}
