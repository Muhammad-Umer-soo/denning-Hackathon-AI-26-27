"use client";

import { cn } from "@/lib/utils";

type Status = "live" | "delayed" | "latest_reported" | "preliminary" | "final" | "sample";

interface ProvenanceBadgeProps {
  source: string;
  unit?: string;
  asOf: string;
  status: Status;
  className?: string;
}

const STATUS_STYLES: Record<Status, string> = {
  live: "bg-green-100 text-green-800 border-green-200",
  delayed: "bg-yellow-100 text-yellow-800 border-yellow-200",
  latest_reported: "bg-blue-100 text-blue-800 border-blue-200",
  preliminary: "bg-purple-100 text-purple-800 border-purple-200",
  final: "bg-slate-100 text-slate-800 border-slate-200",
  sample: "bg-orange-100 text-orange-800 border-orange-200",
};

const STATUS_LABELS: Record<Status, string> = {
  live: "● Live",
  delayed: "◑ Delayed",
  latest_reported: "◈ Latest Reported",
  preliminary: "◇ Preliminary",
  final: "◉ Final",
  sample: "⚠ Sample",
};

export function ProvenanceBadge({ source, unit, asOf, status, className }: ProvenanceBadgeProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5 text-xs mt-2", className)}>
      <span className={cn("px-2 py-0.5 rounded-full border font-medium", STATUS_STYLES[status])}>
        {STATUS_LABELS[status]}
      </span>
      <span className="text-slate-500">
        {source}
        {unit ? ` · ${unit}` : ""} · {asOf}
      </span>
    </div>
  );
}
