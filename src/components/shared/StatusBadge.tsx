import type { SourceStatus, Confidence } from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function SourceStatusBadge({ status }: { status: SourceStatus }) {
  const map = {
    indexed:  { label: "Indexed",  cls: "bg-success/15 text-success border-success/30" },
    indexing: { label: "Indexing", cls: "bg-warning/15 text-warning border-warning/30" },
    failed:   { label: "Failed",   cls: "bg-destructive/15 text-destructive border-destructive/30" },
    pending:  { label: "Pending",  cls: "bg-muted text-muted-foreground border-border" },
  } as const;
  const it = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", it.cls)}>
      {status === "indexing" && <Loader2 className="h-3 w-3 animate-spin" />}
      {it.label}
    </span>
  );
}

export function ConfidenceBadge({ level }: { level: Confidence }) {
  const map = {
    high:   { label: "High confidence",   cls: "bg-success/15 text-success border-success/30",         tip: "3+ corroborating sources with >0.85 similarity" },
    medium: { label: "Medium confidence", cls: "bg-warning/15 text-warning border-warning/30",         tip: "Some supporting sources, partial coverage" },
    low:    { label: "Low confidence",    cls: "bg-destructive/15 text-destructive border-destructive/30", tip: "Limited supporting context" },
  } as const;
  const it = map[level];
  return (
    <span title={it.tip} className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", it.cls)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {it.label}
    </span>
  );
}
