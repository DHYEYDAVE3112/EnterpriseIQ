import { createFileRoute } from "@tanstack/react-router";
import ReactFlow, { Background, Controls, MiniMap, type Node, type Edge } from "reactflow";
import { useMemo, useState } from "react";
import { Search, Download, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_app/workspaces/$id/graph")({
  head: () => ({ meta: [{ title: "Knowledge Graph — EnterpriseIQ" }] }),
  component: GraphPage,
});

const ENTITY_TYPES = [
  { k: "module", label: "Module", color: "var(--ent-module)" },
  { k: "class", label: "Class", color: "var(--ent-class)" },
  { k: "function", label: "Function", color: "var(--ent-function)" },
  { k: "api", label: "API Endpoint", color: "var(--ent-api)" },
  { k: "service", label: "Service", color: "var(--ent-service)" },
  { k: "table", label: "DB Table", color: "var(--ent-table)" },
  { k: "document", label: "Document", color: "var(--ent-document)" },
] as const;

const REL_TYPES = ["CALLS", "DEPENDS_ON", "IMPORTS", "REFERENCES", "IMPLEMENTS", "RELATES_TO"];

interface Ent { id: string; type: typeof ENTITY_TYPES[number]["k"]; label: string; sourceFile?: string; }

const ENTS: Ent[] = [
  { id: "auth-service", type: "service", label: "auth-service", sourceFile: "src/services/auth-service.ts" },
  { id: "payments-api", type: "module", label: "payments-api" },
  { id: "ledger", type: "module", label: "ledger" },
  { id: "verifyToken", type: "function", label: "verifyToken()", sourceFile: "src/middleware/auth.ts:12" },
  { id: "Invoice", type: "class", label: "Invoice" },
  { id: "POST /refunds", type: "api", label: "POST /refunds" },
  { id: "POST /charges", type: "api", label: "POST /charges" },
  { id: "invoices", type: "table", label: "invoices" },
  { id: "customers", type: "table", label: "customers" },
  { id: "StripeGuide", type: "document", label: "Stripe Integration Guide" },
];

const EDGES: { src: string; tgt: string; rel: string }[] = [
  { src: "verifyToken", tgt: "auth-service", rel: "DEPENDS_ON" },
  { src: "payments-api", tgt: "auth-service", rel: "DEPENDS_ON" },
  { src: "payments-api", tgt: "ledger", rel: "IMPORTS" },
  { src: "POST /refunds", tgt: "ledger", rel: "CALLS" },
  { src: "POST /charges", tgt: "ledger", rel: "CALLS" },
  { src: "POST /charges", tgt: "invoices", rel: "REFERENCES" },
  { src: "Invoice", tgt: "invoices", rel: "REFERENCES" },
  { src: "invoices", tgt: "customers", rel: "RELATES_TO" },
  { src: "StripeGuide", tgt: "POST /charges", rel: "RELATES_TO" },
];

function colorFor(t: Ent["type"]) {
  return ENTITY_TYPES.find((e) => e.k === t)!.color;
}

function GraphPage() {
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(ENTITY_TYPES.map((e) => e.k)));
  const [activeRels, setActiveRels] = useState<Set<string>>(new Set(REL_TYPES));
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Ent | null>(null);

  const { nodes, edges } = useMemo(() => {
    const visible = ENTS.filter((e) => activeTypes.has(e.type) && (!search || e.label.toLowerCase().includes(search.toLowerCase())));
    const cols = 4;
    const ns: Node[] = visible.map((e, i) => ({
      id: e.id,
      data: { label: e.label },
      position: { x: (i % cols) * 220, y: Math.floor(i / cols) * 140 },
      style: {
        background: colorFor(e.type),
        color: "white",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        padding: "8px 14px",
        fontSize: 12,
        fontWeight: 500,
      },
    }));
    const visibleIds = new Set(visible.map((e) => e.id));
    const es: Edge[] = EDGES
      .filter((e) => activeRels.has(e.rel) && visibleIds.has(e.src) && visibleIds.has(e.tgt))
      .map((e, i) => ({ id: `e${i}`, source: e.src, target: e.tgt, label: e.rel, animated: false, style: { stroke: "var(--border-hover)" }, labelStyle: { fill: "var(--muted-foreground)", fontSize: 10 } }));
    return { nodes: ns, edges: es };
  }, [activeTypes, activeRels, search]);

  return (
    <div className="relative h-[calc(100vh-10rem)]">
      <div className="absolute top-4 left-4 z-10 w-72 rounded-lg border border-border bg-card p-4 shadow-lg space-y-4 max-h-[calc(100%-2rem)] overflow-y-auto">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Search</div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter nodes..." className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand" />
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Entity types</div>
          <div className="space-y-1.5">
            {ENTITY_TYPES.map((e) => (
              <label key={e.k} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={activeTypes.has(e.k)} onChange={() => {
                  const ns = new Set(activeTypes); if (ns.has(e.k)) ns.delete(e.k); else ns.add(e.k); setActiveTypes(ns);
                }} className="accent-brand" />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} />
                {e.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Relationships</div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {REL_TYPES.map((r) => (
              <label key={r} className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={activeRels.has(r)} onChange={() => { const ns = new Set(activeRels); if (ns.has(r)) ns.delete(r); else ns.add(r); setActiveRels(ns); }} className="accent-brand" />
                {r}
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <button onClick={() => { setActiveTypes(new Set(ENTITY_TYPES.map(e => e.k))); setActiveRels(new Set(REL_TYPES)); setSearch(""); }} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-border hover:border-border-hover px-2 py-1.5 text-xs"><RotateCcw className="h-3 w-3" /> Reset</button>
          <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-border hover:border-border-hover px-2 py-1.5 text-xs"><Download className="h-3 w-3" /> PNG</button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes} edges={edges}
        onNodeClick={(_, n) => setSelected(ENTS.find(e => e.id === n.id) ?? null)}
        fitView nodesDraggable elementsSelectable zoomOnScroll
      >
        <Background color="#2a2a2a" gap={20} />
        <Controls />
        <MiniMap nodeColor={(n) => (n.style?.background as string) ?? "#333"} maskColor="rgba(0,0,0,0.6)" style={{ background: "var(--card)" }} />
      </ReactFlow>

      {selected && (
        <div className="absolute right-0 top-0 h-full w-80 border-l border-border bg-card p-5 overflow-y-auto">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold tracking-tight">{selected.label}</h3>
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">×</button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: colorFor(selected.type) }} />
            <span className="text-xs capitalize text-muted-foreground">{selected.type}</span>
          </div>
          {selected.sourceFile && <div className="mt-3 text-xs text-muted-foreground font-mono">{selected.sourceFile}</div>}
          <div className="mt-4 text-xs text-muted-foreground">Extracted with 94% confidence.</div>

          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Outgoing</div>
            <div className="space-y-1">
              {EDGES.filter(e => e.src === selected.id).map((e, i) => (
                <div key={i} className="text-sm flex items-center gap-2 rounded bg-elevated px-2 py-1.5">
                  <span className="text-[10px] uppercase text-muted-foreground">{e.rel}</span>
                  <span className="truncate">{e.tgt}</span>
                </div>
              ))}
              {EDGES.filter(e => e.src === selected.id).length === 0 && <div className="text-xs text-muted-foreground">None</div>}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Incoming</div>
            <div className="space-y-1">
              {EDGES.filter(e => e.tgt === selected.id).map((e, i) => (
                <div key={i} className="text-sm flex items-center gap-2 rounded bg-elevated px-2 py-1.5">
                  <span className="text-[10px] uppercase text-muted-foreground">{e.rel}</span>
                  <span className="truncate">{e.src}</span>
                </div>
              ))}
              {EDGES.filter(e => e.tgt === selected.id).length === 0 && <div className="text-xs text-muted-foreground">None</div>}
            </div>
          </div>

          <button className="mt-6 w-full rounded-md bg-brand hover:bg-brand-hover text-primary-foreground py-2 text-sm font-medium active:scale-95">Ask About This Entity</button>
        </div>
      )}
    </div>
  );
}
