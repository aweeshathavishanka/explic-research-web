import { CircleCheck, CircleDashed, Clock } from "lucide-react";

export type Status = "available" | "unavailable" | "completed" | "in-progress" | "upcoming" | "not-confirmed";

const config: Record<Status, { label: string; Icon: typeof CircleCheck; tone: string }> = {
  available: { label: "Available", Icon: CircleCheck, tone: "text-accent-text" },
  completed: { label: "Completed", Icon: CircleCheck, tone: "text-accent-text" },
  "in-progress": { label: "In progress", Icon: Clock, tone: "text-accent-text" },
  upcoming: { label: "Upcoming", Icon: Clock, tone: "text-fg" },
  unavailable: { label: "Not available yet", Icon: CircleDashed, tone: "text-subtle" },
  "not-confirmed": { label: "Not confirmed", Icon: CircleDashed, tone: "text-subtle" },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, Icon, tone } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] ${tone}`}>
      <Icon className="size-4" strokeWidth={1.5} aria-hidden />
      {label}
    </span>
  );
}
