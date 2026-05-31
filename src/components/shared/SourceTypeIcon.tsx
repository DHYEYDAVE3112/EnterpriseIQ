import { Github, FileText, Globe, Database, Plug } from "lucide-react";
import type { SourceType } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

const MAP: Record<SourceType, { icon: typeof Github; color: string; label: string }> = {
  github:  { icon: Github,   color: "text-src-github bg-src-github/10",   label: "GitHub" },
  pdf:     { icon: FileText, color: "text-src-pdf bg-src-pdf/10",         label: "PDF" },
  website: { icon: Globe,    color: "text-src-website bg-src-website/10", label: "Website" },
  sql:     { icon: Database, color: "text-src-sql bg-src-sql/10",         label: "SQL" },
  api:     { icon: Plug,     color: "text-src-api bg-src-api/10",         label: "API" },
};

export function SourceTypeIcon({ type, size = "md" }: { type: SourceType; size?: "sm" | "md" | "lg" }) {
  const { icon: Icon, color } = MAP[type];
  const sz = size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const ic = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <span className={cn("inline-flex items-center justify-center rounded-md", color, sz)} aria-label={MAP[type].label}>
      <Icon className={ic} />
    </span>
  );
}

export const sourceLabel = (t: SourceType) => MAP[t].label;
