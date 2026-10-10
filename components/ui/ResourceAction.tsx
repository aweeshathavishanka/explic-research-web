import { ArrowUpRight, CircleDashed } from "lucide-react";

type ResourceActionProps = {
  /** Only set when the resource is available with a valid https URL. */
  url?: string;
  label: string;
  /** Resource title, so screen readers hear e.g. "View Presentation: PP1 Presentation". */
  title: string;
};

/** External link when a URL exists; otherwise a non-interactive "Coming soon" state (never href="#"). */
export function ResourceAction({ url, label, title }: ResourceActionProps) {
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-4 text-[13px] font-medium text-on-accent transition-colors duration-200 hover:bg-accent-strong"
      >
        {label}
        <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden />
        <span className="sr-only">: {title} (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <span className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-dashed border-line-strong px-4 text-[13px] text-subtle">
      <CircleDashed className="size-3.5" strokeWidth={1.5} aria-hidden />
      Coming soon
      <span className="sr-only">: {title} is not available yet</span>
    </span>
  );
}
