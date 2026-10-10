/**
 * Site-wide configuration and copy for the Explic research website.
 *
 * Sources (verified):
 *   [APP]    Public landing and /system pages of https://explic.vercel.app/ and
 *            its source (explicic/frontend/src/components/landing/landing-data.ts).
 *   [README] bsc-research-main-repo/README.md (proposal stage, March 2026).
 *   [AUDIT]  Voice backend audit reports (August 2026).
 *   [FIG]    Voice classification and XAI research figures (August 2026).
 *
 * Convention: anything not yet supplied is `null`. The UI renders `null` as an
 * explicit "To be confirmed" / "Not available yet" state, never as a made-up
 * value. Search for "TODO(content)" to find every field awaiting information.
 */

export type NavItem = { id: string; label: string };

export const navItems: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "domain", label: "Domain" },
  { id: "milestones", label: "Milestones" },
  { id: "documents", label: "Documents" },
  { id: "presentations", label: "Presentations" },
  { id: "about", label: "About Us" },
  { id: "contact", label: "Contact Us" },
];

export const site = {
  name: "Explic",
  projectId: "R26-IT-038",
  fullTitle:
    "Robust, Explainable Multi-Modal Classification of Deepfake Voice and AI-Generated Text",
  institution: "Sri Lanka Institute of Information Technology",
  institutionShort: "SLIIT",
  department: "Department of Information Technology",
  degree: "B.Sc. (Hons) in Information Technology",
  description:
    "Explic is an undergraduate research project at SLIIT that detects whether voice or text content is authentic or AI-generated, and explains the evidence behind each decision.",
  // [APP] footer disclaimer, reused verbatim in meaning.
  disclaimer:
    "Explic is an experimental academic system. Its results are not conclusive forensic, legal, financial, or identity-verification evidence.",
  copyrightYear: 2026,

  // The Explic application itself [APP]. Sign-in is required beyond the landing page.
  appUrl: "https://explic.vercel.app/",
  appCtaLabel: "Open Explic",

  // TODO(content): public URL where this static site will be hosted (canonical/Open Graph URLs).
  siteUrl: null as string | null,
  // TODO(content): verified research contact email. Enables the mailto: action in Contact Us.
  contactEmail: null as string | null,
  // TODO(content): other verified external links (e.g. public code repository).
  links: [] as { label: string; href: string }[],
};

export const hero = {
  eyebrow: "SLIIT · Undergraduate Research Project",
  // [APP] hero sentence, adapted to British spelling (18 words).
  description:
    "Explic analyses AI-generated voice and text, combines multiple detection models, and explains the evidence behind every result.",
  // Project video, streamed from ImageKit (never bundled: the static export has a 20 MB limit).
  // 1920 × 1080, H.264 + AAC, 2 min 46 s, about 39 MB. Metadata sits at the start of the file,
  // so playback begins while the rest streams.
  video: {
    src: "https://ik.imagekit.io/ojcyr6b6l/SLIIT%20-%20Research%20Y4/Research%20Video/Research%20Video.mp4",
    // ImageKit's first-frame thumbnail at 1280 px (about 10 KB), shown until playback starts.
    poster:
      "https://ik.imagekit.io/ojcyr6b6l/SLIIT%20-%20Research%20Y4/Research%20Video/Research%20Video.mp4/ik-thumbnail.jpg?tr=w-1280",
    label: "Explic project video",
    caption:
      "Project video: how AI-generated voice and text are used for fraud, and how Explic analyses a sample and explains the result.",
  },
  // Shown in place of the video if its URL is invalid or it fails to load.
  figure: {
    src: "/images/research/xlsr-attention-rollout.webp",
    width: 968,
    height: 522,
    alt: "Three aligned panels for one speech recording: the waveform, a log-mel spectrogram with high-attention time spans shaded, and the fused attention density over about nine seconds.",
    caption:
      "Temporal attention rollout from the XLS-R voice branch on a bona fide speech sample: waveform, log-mel spectrogram, and fused attention density over time.",
    source: "Voice explainability research figure (Components 1 and 4).",
  },
};

export const overview = {
  title: "Detection with evidence, for voice and text.",
  lede: "Explic classifies speech and writing as human or AI-generated, and pairs each result with evidence a reviewer can inspect: branch scores, time regions, and word-level attributions.",
  reasons: [
    {
      label: "Why it matters",
      text: "Voice cloning and large language models now produce content that passes casual inspection, and it is used for impersonation, fraud, and academic misconduct.",
    },
    {
      label: "Why generalisation",
      text: "Real synthetic content comes from generators a detector has never seen, and it may be deliberately altered to evade detection.",
    },
    {
      label: "Why explainability",
      text: "A bare score asks to be trusted. Evidence about where in a recording, or which words and writing habits, lets a reviewer question the result.",
    },
  ],
};

export type ResearchComponent = {
  code: string;
  modality: "Voice" | "Text";
  role: "Detection" | "Explainability";
  title: string;
  summary: string;
  lead: string;
};

// Titles and owners [README]; descriptions [APP].
export const components: ResearchComponent[] = [
  {
    code: "C1",
    modality: "Voice",
    role: "Detection",
    title: "Multi-Branch Deepfake Voice Detection",
    summary:
      "Four independent acoustic branches score each recording, and score-level fusion combines them into one bona fide or spoof probability.",
    lead: "Aweesha Thavishanka Wijesundara",
  },
  {
    code: "C2",
    modality: "Text",
    role: "Explainability",
    title: "Hybrid Neural Interpretability Framework (HNIF)",
    summary:
      "Fuses Attention Rollout and Integrated Gradients into one word-level explanation, computed locally without an external language model.",
    lead: "Fernando M.D.T",
  },
  {
    code: "C3",
    modality: "Text",
    role: "Detection",
    title: "Data-Centric AI Text Detection Engine",
    summary:
      "Sanitises adversarial input, then combines a semantic model and a stylometric model, reporting AI-Generated, Human-Written, or Mixed Content.",
    lead: "A.W.M. Ishara Udayanga Athapaththu",
  },
  {
    code: "C4",
    modality: "Voice",
    role: "Explainability",
    title: "Explainable Spoof Voice Analysis System (ESVAS)",
    summary:
      "Temporal evidence shows which moments drove a voice result; acoustic-feature evidence adds independent, auxiliary context.",
    lead: "Silva S.P.S",
  },
];
