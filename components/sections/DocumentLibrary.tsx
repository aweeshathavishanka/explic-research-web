"use client";

import { useId, useState } from "react";
import { ChevronDown, FileSpreadsheet, FileText, Folder, FolderOpen, Link2, Presentation } from "lucide-react";
// Type-only imports: the resource data itself arrives as public-only props.
import type { CategoryView, FilterId, ResourceView } from "@/data/research-documents";
import { ResourceAction } from "@/components/ui/ResourceAction";

type DocumentLibraryProps = {
  categories: CategoryView[];
  filters: { id: FilterId; label: string }[];
};

function ResourceIcon({ r }: { r: ResourceView }) {
  const props = { className: "size-4", strokeWidth: 1.5, "aria-hidden": true } as const;
  switch (r.format) {
    case "Folder":
      return <Folder {...props} />;
    case "Link":
      return <Link2 {...props} />;
    case "PPTX":
      return <Presentation {...props} />;
    case "XLSX":
      return <FileSpreadsheet {...props} />;
    default:
      return r.kind === "presentation" ? <Presentation {...props} /> : <FileText {...props} />;
  }
}

function visibleResources(c: CategoryView, filter: FilterId) {
  return c.resources.filter((r) => r.filters.includes(filter));
}

/** Empty folders stay listed under "All" and their own filter, so every category is represented. */
function isCategoryVisible(c: CategoryView, filter: FilterId) {
  if (visibleResources(c, filter).length > 0) return true;
  return c.resources.length === 0 && (filter === "all" || filter === c.filter);
}

function defaultOpen(categories: CategoryView[]) {
  const open = new Set(categories.filter((c) => c.resources.some((r) => r.url)).map((c) => c.id));
  if (categories[0]) open.add(categories[0].id);
  return open;
}

function ResourceRow({ r }: { r: ResourceView }) {
  const meta = [r.owner?.studentId, r.format, r.provider].filter(Boolean).join(", ");
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-5">
      <div className="flex min-w-0 flex-1 gap-4">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${
            r.url ? "border-accent-line bg-accent-surface text-accent-text" : "border-line bg-surface text-subtle"
          }`}
        >
          <ResourceIcon r={r} />
        </span>
        <div className="min-w-0">
          {/* Individual documents lead with the researcher; the shared title follows. */}
          <p className="text-[15px] font-medium text-fg">{r.owner ? r.owner.name : r.title}</p>
          {r.owner ? <p className="mt-0.5 text-sm text-muted">{r.title}</p> : null}
          {r.description ? <p className="mt-0.5 text-sm leading-relaxed text-muted">{r.description}</p> : null}
          {meta || r.sourceName ? (
            <p className="mt-1.5 wrap-break-word font-mono text-xs text-subtle">
              {r.owner?.studentId ? <span className="sr-only">Student ID </span> : null}
              {meta}
              {meta && r.sourceName ? <span aria-hidden> / </span> : null}
              {r.sourceName ? <span className="sr-only">Source file: </span> : null}
              {r.sourceName}
            </p>
          ) : null}
        </div>
      </div>
      <div className="pl-13 sm:pl-0">
        <ResourceAction url={r.url} label={r.action} title={r.owner ? `${r.title}, ${r.owner.name}` : r.title} />
      </div>
    </li>
  );
}

/** Rows grouped by subfolder, in first-seen order. Ungrouped rows come first. */
function groupRows(items: ResourceView[]) {
  const groups = new Map<string, ResourceView[]>();
  for (const r of items) {
    const key = r.group ?? "";
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }
  return [...groups.entries()].sort(([a], [b]) => Number(a !== "") - Number(b !== ""));
}

function FolderRow({ c }: { c: CategoryView }) {
  if (!c.folderUrl) return null;
  return (
    <div className="flex flex-col gap-3 border-b border-line py-4 sm:flex-row sm:items-center sm:gap-5">
      <div className="flex min-w-0 flex-1 gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-accent-line bg-accent-surface text-accent-text">
          <FolderOpen className="size-4" strokeWidth={1.5} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-fg">Complete submission folder</p>
          <p className="mt-0.5 text-sm text-muted">Every file in {c.folder}, as submitted.</p>
          <p className="mt-1.5 font-mono text-xs text-subtle">Google Drive Resources</p>
        </div>
      </div>
      <div className="pl-13 sm:pl-0">
        <ResourceAction url={c.folderUrl} label="Open Drive Folder" title={`${c.title} folder`} />
      </div>
    </div>
  );
}

export function DocumentLibrary({ categories, filters }: DocumentLibraryProps) {
  const baseId = useId();
  const [filter, setFilter] = useState<FilterId>("all");
  const [open, setOpen] = useState<Set<string>>(() => defaultOpen(categories));

  const shown = categories.filter((c) => isCategoryVisible(c, filter));
  const shownResources = shown.flatMap((c) => visibleResources(c, filter));
  const availableCount = shownResources.filter((r) => r.url).length;
  const folderCount = shown.filter((c) => c.folderUrl).length;
  const allOpen = shown.every((c) => open.has(c.id));

  const selectFilter = (id: FilterId) => {
    setFilter(id);
    // A filtered view is short, so show its groups expanded; "All" returns to the compact default.
    setOpen(id === "all" ? defaultOpen(categories) : new Set(categories.filter((c) => isCategoryVisible(c, id)).map((c) => c.id)));
  };

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="mt-10">
      {/* Filters: wrap on small screens, no hover-only behaviour. */}
      <div role="group" aria-label="Filter research documents" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = categories.flatMap((c) => visibleResources(c, f.id)).length;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active}
              onClick={() => selectFilter(f.id)}
              className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-200 ${
                active
                  ? "border-accent bg-accent text-on-accent"
                  : "border-line-strong text-fg hover:border-accent hover:text-accent-text"
              }`}
            >
              {f.label}
              <span className={`font-mono text-xs ${active ? "text-on-accent" : "text-subtle"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <p className="font-mono text-[13px] text-subtle" aria-live="polite">
          {shown.length} {shown.length === 1 ? "folder" : "folders"}, {folderCount} on Google Drive, {availableCount} of{" "}
          {shownResources.length} files linked
        </p>
        <button
          type="button"
          onClick={() => setOpen(allOpen ? new Set() : new Set(shown.map((c) => c.id)))}
          className="rounded-full text-sm text-accent-text underline-offset-4 hover:underline"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <ul className="mt-4 space-y-3">
        {shown.map((c) => {
          const items = visibleResources(c, filter);
          const isOpen = open.has(c.id);
          const panelId = `${baseId}-${c.id}-panel`;
          const available = items.filter((r) => r.url).length;
          return (
            <li key={c.id} className="rounded-xl border border-line bg-bg">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(c.id)}
                  className="flex w-full items-start justify-between gap-4 rounded-xl px-5 py-4 text-left transition-colors duration-200 hover:bg-surface sm:px-6"
                >
                  <span className="min-w-0">
                    <span className="block text-lg font-medium text-fg">{c.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{c.description}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 pt-1">
                    <span className="hidden font-mono text-xs text-subtle sm:inline">
                      {c.folderUrl ? <span className="text-accent-text">Drive folder</span> : null}
                      {c.folderUrl && items.length > 0 ? ", " : null}
                      {items.length === 0
                        ? c.folderUrl
                          ? null
                          : "No public items"
                        : `${available} of ${items.length} linked`}
                    </span>
                    <ChevronDown
                      className={`size-4 text-subtle transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </span>
                </button>
              </h3>
              <div id={panelId} hidden={!isOpen} className="border-t border-line px-5 sm:px-6">
                <FolderRow c={c} />
                {items.length > 0 ? (
                  groupRows(items).map(([group, rows]) => (
                    <div key={group || "_"}>
                      {group ? (
                        <h4 className="pt-4 font-mono text-xs text-accent-text">
                          {group}
                          <span className="sr-only"> ({rows.length})</span>
                        </h4>
                      ) : null}
                      <ul className="divide-y divide-line">
                        {rows.map((r) => (
                          <ResourceRow key={r.id} r={r} />
                        ))}
                      </ul>
                    </div>
                  ))
                ) : c.folderUrl ? null : (
                  <p className="py-4 text-sm leading-relaxed text-muted">
                    No documents from this folder are public yet. Administrative records stay internal.
                  </p>
                )}
                {c.folder !== c.title ? (
                  <p className="pb-4 font-mono text-xs text-subtle">
                    <span className="sr-only">Submission folder: </span>
                    {c.folder}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
