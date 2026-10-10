/**
 * Research team: one list rendered by the About Us section.
 *
 * Sources: display names and portraits supplied by the group (images hosted on
 * ImageKit, linked rather than bundled); roles, components, and student IDs
 * from the project README (R26-IT-038).
 *
 * - `image.width` / `image.height` are the source dimensions, used to reserve
 *   space. Portraits are shown in a 4:5 frame with `object-cover`; adjust
 *   `image.position` if a crop ever cuts a face.
 * - Only add `links` (e.g. LinkedIn, email) with the person's consent.
 * - Never invent titles, roles, IDs, or links.
 */

export type TeamGroup = "supervision" | "research";

export type TeamPerson = {
  id: string;
  name: string;
  group: TeamGroup;
  image: { src: string; width: number; height: number; position?: string };
  /** Supervision role, as recorded in the project documentation. */
  role?: string;
  /** Team designation shown as a small label, e.g. "Group Leader". */
  designation?: string;
  /** Research component, e.g. "Component 1". */
  component?: string;
  /** Research contribution or focus area. */
  contribution?: string;
  studentId?: string;
  /** Name as written in the project registration records. */
  formalName?: string;
  links?: { label: string; href: string }[];
};

const IMAGEKIT = "https://ik.imagekit.io/ojcyr6b6l/SLIIT%20-%20Research%20Y4/Team%20Members";

export const teamGroups: { id: TeamGroup; title: string; description: string }[] = [
  {
    id: "supervision",
    title: "Supervision Team",
    description: "Academic mentors guiding the research.",
  },
  {
    id: "research",
    title: "Research Team",
    description: "Four final-year undergraduates, each leading one research component.",
  },
];

export const team: TeamPerson[] = [
  // Supervision team (roles from the project README).
  {
    id: "kalpani-manathunga",
    name: "Dr. Kalpani Manathunga",
    group: "supervision",
    role: "Internal Supervisor",
    image: { src: `${IMAGEKIT}/profile_1777975576.jpg`, width: 1200, height: 1200 },
  },
  {
    id: "poojani-gunathilaka",
    name: "Poojani Gunathilaka",
    group: "supervision",
    role: "Co-Supervisor",
    formalName: "Ms. Poojani Gunathilake",
    image: { src: `${IMAGEKIT}/poojanigunathilaka.jpg`, width: 1200, height: 1200 },
  },
  {
    id: "samitha-vidanarachchi",
    name: "Samitha Vidanarachchi",
    group: "supervision",
    role: "External Supervisor",
    formalName: "Mr. Samitha Vidhanaarachchi",
    image: { src: `${IMAGEKIT}/samitha-Samitha-Vidhanaarachchi.webp`, width: 1600, height: 2000 },
  },

  // Research team, in the order set by the group: group leader first.
  // Components and student IDs from the project README.
  {
    id: "dinitha-fernando",
    name: "Dinitha Fernando",
    group: "research",
    designation: "Group Leader",
    component: "Component 2",
    contribution: "Hybrid Neural Interpretability Framework (HNIF)",
    studentId: "IT22090744",
    formalName: "Fernando M.D.T",
    image: { src: `${IMAGEKIT}/Dinitha%20Fernando.png`, width: 1080, height: 1350 },
  },
  {
    id: "ishara-udayanga",
    name: "Ishara Udayanga",
    group: "research",
    component: "Component 3",
    contribution: "Data-Centric AI Text Detection Engine",
    studentId: "IT22251046",
    formalName: "A.W.M. Ishara Udayanga Athapaththu",
    image: { src: `${IMAGEKIT}/Edit/Ishara%20Udayanga.png`, width: 1122, height: 1402 },
  },
  {
    id: "pratheesha-silva",
    name: "Pratheesha Silva",
    group: "research",
    component: "Component 4",
    contribution: "Explainable Spoof Voice Analysis System (ESVAS)",
    studentId: "IT22219602",
    formalName: "Silva S.P.S",
    image: { src: `${IMAGEKIT}/Edit/Pratheesha%20Silva.png`, width: 1122, height: 1402 },
  },
  {
    id: "aweesha-wijesundara",
    name: "Aweesha Wijesundara",
    group: "research",
    component: "Component 1",
    contribution: "Multi-Branch Deepfake Voice Detection",
    studentId: "IT22183668",
    formalName: "Aweesha Thavishanka Wijesundara",
    image: { src: `${IMAGEKIT}/Edit/Aweesha%20Wijesundara.png`, width: 1122, height: 1402 },
  },
];

// TODO(content): add verified achievements (publications, awards, competitions).
// The block is hidden while this list is empty.
export const achievements: { title: string; detail: string }[] = [];
