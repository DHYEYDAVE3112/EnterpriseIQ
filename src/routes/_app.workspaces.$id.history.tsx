import { createFileRoute, useParams } from "@tanstack/react-router";
import { MOCK_QUERIES, type QueryType, type Confidence } from "@/lib/mock/data";
import { ConfidenceBadge } from "@/components/shared/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { Search, Download, Trash2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/workspaces/$id/history")({
  head: () => ({ meta: [{ title: "Query History — EnterpriseIQ" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const { id } = useParams({ from: "/_app/workspaces/$id/history" });
  const [q, setQ] = useState("");
  const [type, setType] = useState<QueryType | "all">("all");
  const [conf, setConf] = useState<Confidence | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const rows = useMemo(() => MOCK_QUERIES.filter(r => r.workspaceId === id)
    .filter(r => !q || r.text.toLowerCase().includes(q.toLowerCase()))
    .filter(r => type === "all" || r.type === type)
    .filter(r => conf === "all" || r.confidence === conf),
    [id, q, type, conf]);

  return (
    <div className="max-w-[1280px] mx-auto p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search queries..." className="w-full rounded-md border border-border bg-card pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value as QueryType | "all")} className="rounded-md border border-border bg-card px-3 py-2 text-sm">
          <option value="all">All types</option>
          {(["code","document","graph","sql","api","hybrid"] as const).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={conf} onChange={(e) => setConf(e.target.value as Confidence | "all")} className="rounded-md border border-border bg-card px-3 py-2 text-sm">
          <option value="all">Any confidence</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button onClick={() => toast.success("Exported as CSV")} className="inline-flex items-center gap-1.5 rounded-md border border-border hover:border-border-hover px-3 py-2 text-sm"><Download className="h-3.5 w-3.5" /> Export CSV</button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-elevated text-muted-foreground text-xs">
            <tr>
              <th className="text-left p-3 font-medium">Query</th>
              <th className="text-left p-3 font-medium">Type</th>
              <th className="text-left p-3 font-medium">Sources</th>
              <th className="text-left p-3 font-medium">Latency</th>
              <th className="text-left p-3 font-medium">Confidence</th>
              <th className="text-left p-3 font-medium">When</th>
              <th className="p-3 w-12" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No queries match these filters.</td></tr>
            ) : rows.map(r => (
              <>
                <tr key={r.id} className="border-t border-border hover:bg-elevated/40 cursor-pointer" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                  <td className="p-3 max-w-md truncate" title={r.text}>{r.text}</td>
                  <td className="p-3"><span className="rounded bg-elevated px-1.5 py-0.5 text-xs capitalize">{r.type}</span></td>
                  <td className="p-3 text-muted-foreground">{r.sources.length}</td>
                  <td className="p-3 text-muted-foreground tabular-nums">{r.responseTimeMs} ms</td>
                  <td className="p-3"><ConfidenceBadge level={r.confidence} /></td>
                  <td className="p-3 text-muted-foreground">{formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}</td>
                  <td className="p-3"><ChevronDown className={`h-4 w-4 text-muted-foreground transition ${expanded === r.id ? "rotate-180" : ""}`} /></td>
                </tr>
                {expanded === r.id && (
                  <tr className="border-t border-border bg-elevated/30">
                    <td colSpan={7} className="p-5">
                      <div className="text-xs text-muted-foreground mb-2">Retrievers used: {r.retrievers.join(", ")} · {r.candidatesBefore} → {r.candidatesAfter} candidates</div>
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">{r.answer}</div>
                      <div className="mt-3 flex gap-2">
                        <button className="text-xs text-brand hover:text-brand-hover">View full answer</button>
                        <button onClick={(e) => { e.stopPropagation(); toast.error("Deleted (demo)"); }} className="ml-auto text-xs text-destructive hover:underline inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> Delete</button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{rows.length} queries</span>
        <div className="flex gap-2">
          <button className="rounded border border-border px-3 py-1 disabled:opacity-40" disabled>Previous</button>
          <span>Page 1</span>
          <button className="rounded border border-border px-3 py-1 disabled:opacity-40" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
