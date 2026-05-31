import { createFileRoute, useParams } from "@tanstack/react-router";
import { MOCK_SOURCES, type SourceType } from "@/lib/mock/data";
import { SourceTypeIcon, sourceLabel } from "@/components/shared/SourceTypeIcon";
import { SourceStatusBadge } from "@/components/shared/StatusBadge";
import { Plus, MoreHorizontal, RefreshCw, Trash2, FileText, Github, Globe, Database, Plug, X } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/workspaces/$id/sources")({
  head: () => ({ meta: [{ title: "Sources — EnterpriseIQ" }] }),
  component: SourcesPage,
});

const TYPES: { t: SourceType | "all"; label: string }[] = [
  { t: "all", label: "All" },
  { t: "github", label: "GitHub" },
  { t: "pdf", label: "PDF" },
  { t: "website", label: "Website" },
  { t: "sql", label: "SQL" },
  { t: "api", label: "API" },
];

function SourcesPage() {
  const { id } = useParams({ from: "/_app/workspaces/$id/sources" });
  const all = MOCK_SOURCES.filter((s) => s.workspaceId === id);
  const [filter, setFilter] = useState<SourceType | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(all[0]?.id ?? null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = filter === "all" ? all : all.filter((s) => s.type === filter);
  const selected = all.find((s) => s.id === selectedId);

  return (
    <div className="flex h-[calc(100vh-10rem)]">
      <aside className="w-[360px] border-r border-border flex flex-col">
        <div className="p-3 border-b border-border flex flex-wrap gap-1">
          {TYPES.map((t) => (
            <button key={t.t} onClick={() => setFilter(t.t)} className={cn("rounded-full px-2.5 py-1 text-xs border transition",
              filter === t.t ? "border-brand bg-brand/15 text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            )}>{t.label}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground text-center">No sources match this filter.</div>
          ) : filtered.map((s) => (
            <button key={s.id} onClick={() => setSelectedId(s.id)} className={cn("w-full text-left p-4 flex items-start gap-3 hover:bg-elevated/50 transition", selectedId === s.id && "bg-elevated")}>
              <SourceTypeIcon type={s.type} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{s.name}</div>
                <div className="mt-1 flex items-center gap-2">
                  <SourceStatusBadge status={s.status} />
                  <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(s.lastIndexedAt), { addSuffix: true })}</span>
                </div>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-border">
          <button onClick={() => setSheetOpen(true)} className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand hover:bg-brand-hover text-primary-foreground py-2 text-sm font-medium active:scale-95">
            <Plus className="h-4 w-4" /> Add Source
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">
        {!selected ? (
          <div className="h-full grid place-items-center text-sm text-muted-foreground">Select a source to view details</div>
        ) : (
          <div className="p-6 md:p-8 space-y-6 max-w-4xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <SourceTypeIcon type={selected.type} />
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">{selected.name}</h2>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <span className="rounded bg-elevated px-1.5 py-0.5 text-xs">{sourceLabel(selected.type)}</span>
                    <SourceStatusBadge status={selected.status} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toast.success("Reindex started")} className="inline-flex items-center gap-1.5 rounded-md border border-border hover:border-border-hover px-3 py-1.5 text-sm active:scale-95"><RefreshCw className="h-3.5 w-3.5" /> Reindex</button>
                <button onClick={() => toast.error("Source deleted (demo)")} className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 text-destructive hover:bg-destructive/10 px-3 py-1.5 text-sm active:scale-95"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Meta label="URI" value={selected.uri} />
              <Meta label="Added" value={new Date(selected.addedAt).toLocaleDateString()} />
              <Meta label="Chunks" value={selected.chunkCount.toLocaleString()} />
              <Meta label="Entities" value={selected.entityCount.toLocaleString()} />
            </div>

            <section>
              <h3 className="text-sm font-semibold mb-2">Ingestion log</h3>
              <pre className="rounded-md border border-border bg-[#161616] p-3 text-xs font-mono leading-relaxed text-muted-foreground max-h-64 overflow-y-auto">
{`[10:21:04] info  Fetching ${selected.uri}
[10:21:08] info  Cloning... 12.4 MB
[10:21:14] info  Detected language: TypeScript
[10:21:18] info  Parsing AST for 248 files
[10:21:31] info  Chunking source (target: 800 tokens)
[10:21:45] info  Generated 1284 chunks
[10:22:02] info  Embedding chunks via text-embedding-3-large
[10:22:48] info  Building knowledge graph (312 entities, 904 edges)
[10:23:12] info  Indexing complete`}
              </pre>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold mb-3">Entity preview</h3>
              <div className="h-48 rounded-md border border-border bg-elevated/40 grid place-items-center text-sm text-muted-foreground">
                Mini-graph preview · {selected.entityCount} entities · <button className="ml-2 text-brand hover:text-brand-hover">View Full Graph →</button>
              </div>
            </section>
          </div>
        )}
      </main>

      {sheetOpen && <AddSourceSheet onClose={() => setSheetOpen(false)} />}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium truncate" title={value}>{value}</div>
    </div>
  );
}

function AddSourceSheet({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<SourceType | null>(null);
  const opts: { t: SourceType; label: string; icon: typeof Github; desc: string }[] = [
    { t: "github", label: "GitHub Repository", icon: Github, desc: "Public or private repos" },
    { t: "pdf", label: "PDF Document", icon: FileText, desc: "Up to 50 MB" },
    { t: "website", label: "Website", icon: Globe, desc: "With crawl depth control" },
    { t: "sql", label: "SQL Database", icon: Database, desc: "Postgres / MySQL / SQLite" },
    { t: "api", label: "API / OpenAPI", icon: Plug, desc: "JSON or YAML spec" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border flex flex-col">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Add a source</h2>
            <div className="text-xs text-muted-foreground mt-0.5">Step {step} of 3</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {step === 1 && (
            <div className="space-y-2">
              {opts.map(({ t, label, icon: Icon, desc }) => (
                <button key={t} onClick={() => { setType(t); setStep(2); }} className="w-full text-left rounded-lg border border-border hover:border-brand bg-elevated p-4 flex items-center gap-3 transition">
                  <Icon className="h-5 w-5 text-brand shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {step === 2 && type && (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">Configure your {type.toUpperCase()} source.</p>
              {type === "pdf" ? (
                <div className="rounded-md border border-dashed border-border bg-elevated p-8 text-center text-muted-foreground">Drag and drop a PDF here, or click to browse</div>
              ) : (
                <input placeholder="Enter source URL or details" className="w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
              )}
            </div>
          )}
          {step === 3 && (
            <div className="text-sm">Review & confirm — estimated ingestion 2–6 min.</div>
          )}
        </div>
        <div className="p-5 border-t border-border flex justify-between">
          {step > 1 ? <button onClick={() => setStep(step - 1)} className="text-sm text-muted-foreground hover:text-foreground">Back</button> : <span />}
          {step < 3 ? (
            <button disabled={step === 1 ? !type : false} onClick={() => setStep(step + 1)} className="rounded-md bg-brand hover:bg-brand-hover text-primary-foreground px-4 py-2 text-sm font-medium active:scale-95 disabled:opacity-50">Next</button>
          ) : (
            <button onClick={() => { toast.success("Ingestion started"); onClose(); }} className="rounded-md bg-brand hover:bg-brand-hover text-primary-foreground px-4 py-2 text-sm font-medium active:scale-95">Start Ingestion</button>
          )}
        </div>
      </div>
    </div>
  );
}
