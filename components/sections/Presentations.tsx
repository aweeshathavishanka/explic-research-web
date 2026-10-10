import { ArrowUpRight, CircleDashed, FolderOpen, Presentation as PresentationIcon } from "lucide-react";
import { getPresentationViews } from "@/data/research-documents";
import { Section, SectionHeader } from "@/components/ui/SectionHeading";

type ActionProps = {
  label: string;
  provider: string;
  url?: string;
  /** What the link opens, so screen readers hear which deck or folder. */
  context: string;
  primary?: boolean;
  icon: "slides" | "folder";
};

/** Full-width action row: a link when the URL is publishable, otherwise a non-interactive Coming soon state. */
function Action({ label, provider, url, context, primary = false, icon }: ActionProps) {
  const Icon = icon === "slides" ? PresentationIcon : FolderOpen;
  const body = (
    <>
      <Icon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium">{label}</span>
        <span className={`block text-xs ${url && primary ? "text-on-accent" : "text-subtle"}`}>
          {url ? provider : "Coming soon"}
        </span>
      </span>
    </>
  );
  if (!url) {
    return (
      <span className="flex items-center gap-3 rounded-lg border border-dashed border-line-strong px-3 py-2.5 text-subtle">
        {body}
        <CircleDashed className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
        <span className="sr-only">: {context} is not available yet</span>
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors duration-200 ${
        primary
          ? "border-accent bg-accent text-on-accent hover:bg-accent-strong"
          : "border-line-strong text-fg hover:border-accent hover:text-accent-text"
      }`}
    >
      {body}
      <ArrowUpRight className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
      <span className="sr-only">: {context} (opens in a new tab)</span>
    </a>
  );
}

export function Presentations() {
  // Same source as the Documents archive: records, Drive folders, and milestone dates.
  const stages = getPresentationViews();

  return (
    <Section id="presentations" labelledBy="presentations-title">
      <SectionHeader
        id="presentations-title"
        title="Presentation archive"
        lede="Slides from each assessment stage. Slides open in Canva and supporting files in the stage's Google Drive folder, each in a new tab."
      />

      {/* One continuous strip: four columns on desktop, 2 × 2 on tablet, stacked on mobile. */}
      <ul className="reveal mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((s) => (
          <li key={s.id} className="flex flex-col bg-bg p-6">
            <p className="font-mono text-xs text-subtle">{s.assessment}</p>
            <h3 className="mt-2 text-lg font-medium text-fg">{s.title}</h3>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-subtle">Date</dt>
                <dd className={s.date ? "font-mono text-fg" : "text-subtle"}>
                  {s.date ? (
                    <>
                      <span aria-hidden>{s.date.short}</span>
                      <span className="sr-only">{s.date.long}</span>
                    </>
                  ) : (
                    "To be confirmed"
                  )}
                </dd>
              </div>
              {s.weight ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-subtle">Module weight</dt>
                  <dd className="font-mono text-fg">{s.weight}%</dd>
                </div>
              ) : null}
            </dl>

            {s.files.length > 0 ? (
              <div className="mt-5 border-t border-line pt-4">
                <p className="text-xs text-subtle">Slide files</p>
                <ul className="mt-1.5 space-y-1">
                  {s.files.map((f) => (
                    <li key={f.id} className="wrap-break-word font-mono text-xs leading-relaxed text-muted">
                      {f.url ? (
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-fg underline-offset-4 hover:text-accent-text hover:underline"
                        >
                          {f.name.slice(0, f.name.lastIndexOf(" ") + 1)}
                          {/* Keep the arrow on the same line as the end of the filename. */}
                          <span className="whitespace-nowrap">
                            {f.name.slice(f.name.lastIndexOf(" ") + 1)}
                            <ArrowUpRight className="ml-1 inline size-3 align-[-1px]" strokeWidth={1.5} aria-hidden />
                          </span>
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        f.name
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-auto space-y-2 pt-6">
              <Action label="View Slides" provider="Canva Slides" url={s.slides.url} context={s.slides.title} primary icon="slides" />
              <Action
                label="Open Drive Folder"
                provider="Google Drive Resources"
                url={s.driveFolderUrl}
                context={`${s.title} Google Drive folder`}
                icon="folder"
              />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
