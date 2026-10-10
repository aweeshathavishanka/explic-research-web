"use client";

import { useSyncExternalStore } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  formatDateRange,
  formatDateRangeLong,
  milestoneCategories,
  milestones,
  milestoneTypes,
  scheduleState,
  timeline,
  type Milestone,
} from "@/data/milestones";
import { StatusBadge, type Status } from "@/components/ui/StatusBadge";

/** Visitor's local calendar date as yyyy-mm-dd. */
function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Re-read the date when the tab is shown again, so a page left open past midnight updates.
function subscribe(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/**
 * Completion comes only from the data. The date decides between Upcoming, In
 * progress, and Not confirmed (date passed, completion not recorded).
 * Without a date (build time, before hydration) unconfirmed items show no status.
 */
function statusFor(m: Milestone, today: string | null): Status | null {
  if (m.completion === "completed") return "completed";
  if (!today) return null;
  const state = scheduleState(m, today);
  return state === "past" ? "not-confirmed" : state === "current" ? "in-progress" : "upcoming";
}

function DateText({ m }: { m: Milestone }) {
  return (
    <>
      <span aria-hidden>{formatDateRange(m.startDate, m.endDate)}</span>
      <span className="sr-only">{formatDateRangeLong(m.startDate, m.endDate)}</span>
    </>
  );
}

// Node centre sits 1.875rem below the top of each row, level with the title.
const NODE_TOP = "mt-[1.125rem]";
const LINE_FROM_NODE = "top-[1.875rem]";
const LINE_TO_NODE = "h-[1.875rem]";

function TodayRow({ today, first }: { today: string; first: boolean }) {
  return (
    <div className="col-span-2 grid grid-cols-subgrid md:col-span-3">
      <p aria-hidden className="hidden pt-2.5 text-right font-mono text-xs text-accent-text md:block">
        Today
      </p>
      <div aria-hidden className="relative flex justify-center">
        {!first ? <span className="absolute inset-y-0 w-px bg-line-strong" /> : null}
        <span className="relative mt-3 size-2.5 rounded-full bg-accent" />
      </div>
      <p className="flex items-center gap-3 pb-3 pt-2">
        <span aria-hidden className="font-mono text-xs text-accent-text md:hidden">
          Today
        </span>
        <span className="sr-only">Today is {formatDateRangeLong(today)}. The assessments below are still to come.</span>
        <span aria-hidden className="h-px flex-1 bg-accent-line" />
      </p>
    </div>
  );
}

function TimelineRow({ m, today, first, last, showToday }: { m: Milestone; today: string | null; first: boolean; last: boolean; showToday: boolean }) {
  const status = statusFor(m, today);
  const done = m.completion === "completed";
  const lapsed = status === "not-confirmed";
  const lineClass = last ? `top-0 ${LINE_TO_NODE}` : first && !showToday ? `${LINE_FROM_NODE} bottom-0` : "inset-y-0";

  return (
    <li className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 sm:gap-x-5 md:grid-cols-[10rem_1.5rem_minmax(0,1fr)] md:gap-x-6">
      {showToday && today ? <TodayRow today={today} first={first} /> : null}

      <p className={`hidden pt-[1.1rem] text-right font-mono text-[13px] md:block ${m.key ? "text-fg" : "text-muted"}`}>
        <DateText m={m} />
      </p>

      <div aria-hidden className="relative flex justify-center">
        {first && last ? null : <span className={`absolute w-px bg-line-strong ${lineClass}`} />}
        <span
          className={`relative ${NODE_TOP} flex size-6 items-center justify-center rounded-full border ${
            done
              ? "border-accent bg-accent text-on-accent"
              : `${lapsed ? "border-dashed" : ""} ${m.key ? "border-accent" : "border-line-strong"} bg-bg`
          }`}
        >
          {done ? <Check className="size-3.5" strokeWidth={2} /> : null}
          {!done && m.key ? <span className="size-2 rounded-full bg-accent" /> : null}
        </span>
      </div>

      <div className="pb-3">
        <details
          className={`group rounded-xl border border-line transition-colors duration-200 hover:border-line-strong open:border-line-strong ${
            m.key ? "bg-surface" : "bg-bg"
          }`}
        >
          <summary className="flex cursor-pointer items-start justify-between gap-4 rounded-xl px-4 py-4 sm:px-5">
            <span className="min-w-0">
              <span className="mb-1 block font-mono text-xs text-muted md:hidden">
                <DateText m={m} />
              </span>
              <span className={`block text-fg ${m.key ? "text-lg font-medium leading-7" : "text-base leading-6"}`}>{m.title}</span>
              <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-subtle">
                {milestoneCategories[m.category]}
                {status ? (
                  <span className="sm:hidden">
                    <StatusBadge status={status} />
                  </span>
                ) : null}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-4 pt-1">
              {status ? (
                <span className="hidden sm:inline-flex">
                  <StatusBadge status={status} />
                </span>
              ) : null}
              <ChevronDown
                className="size-4 shrink-0 text-subtle transition-transform duration-200 group-open:rotate-180"
                strokeWidth={1.5}
                aria-hidden
              />
            </span>
          </summary>
          <div className="border-t border-line px-4 py-4 sm:px-5">
            {m.description ? <p className="mb-5 max-w-[64ch] leading-relaxed text-muted">{m.description}</p> : null}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              <div>
                <dt className="text-[13px] text-subtle">Scheduled</dt>
                <dd className="mt-1 text-sm text-fg">{formatDateRangeLong(m.startDate, m.endDate)}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-subtle">Allocated marks</dt>
                <dd className={`mt-1 text-sm ${m.marks === null ? "text-subtle" : "text-fg"}`}>{m.marks ?? "To be confirmed"}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-subtle">Type</dt>
                <dd className="mt-1 text-sm text-fg">{milestoneTypes[m.type]}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-subtle">Official schedule</dt>
                <dd className="mt-1 text-sm text-fg">
                  Item <span className="font-mono">{String(m.scheduleNo).padStart(2, "0")}</span> of {milestones.length}
                </dd>
              </div>
            </dl>
          </div>
        </details>
      </div>
    </li>
  );
}

export function MilestoneTimeline() {
  const today = useSyncExternalStore(subscribe, localToday, () => null);
  // The Today marker goes above the first event that has not fully passed.
  const nextIndex = today ? timeline.findIndex((m) => scheduleState(m, today) !== "past") : -1;

  return (
    <ol className="mt-14 max-w-5xl">
      {timeline.map((m, i) => (
        <TimelineRow
          key={m.id}
          m={m}
          today={today}
          first={i === 0}
          last={i === timeline.length - 1}
          showToday={i === nextIndex}
        />
      ))}
    </ol>
  );
}
