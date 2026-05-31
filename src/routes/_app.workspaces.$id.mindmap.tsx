import { createFileRoute } from "@tanstack/react-router";
import ReactFlow, { Background, Controls, type Node, type Edge } from "reactflow";
import { useMemo, useState } from "react";
import { RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";
import { MOCK_SOURCES, MOCK_WORKSPACES } from "@/lib/mock/data";

export const Route = createFileRoute("/_app/workspaces/$id/mindmap")({
  head: () => ({ meta: [{ title: "Mind Map — EnterpriseIQ" }] }),
  component: MindMapPage,
});

function MindMapPage() {
  const [regenerating, setRegenerating] = useState(false);
  const id = "ws_payments";
  const ws = MOCK_WORKSPACES.find(w => w.id === id)!;
  const sources = MOCK_SOURCES.filter(s => s.workspaceId === id && s.status === "indexed").slice(0, 6);

  const { nodes, edges } = useMemo(() => {
    const center = { x: 400, y: 300 };
    const root: Node = { id: "root", position: center, data: { label: ws.name }, style: { background: "var(--brand)", color: "white", borderRadius: 999, padding: "14px 22px", fontSize: 14, fontWeight: 600, border: "none" } };
    const radius = 220;
    const angleStep = (2 * Math.PI) / sources.length;
    const srcColor: Record<string, string> = { github: "var(--src-github)", pdf: "var(--src-pdf)", website: "var(--src-website)", sql: "var(--src-sql)", api: "var(--src-api)" };
    const srcNodes: Node[] = sources.map((s, i) => ({
      id: `s-${s.id}`,
      position: { x: center.x + Math.cos(angleStep * i) * radius, y: center.y + Math.sin(angleStep * i) * radius },
      data: { label: s.name },
      style: { background: srcColor[s.type], color: "white", borderRadius: 8, padding: "8px 12px", fontSize: 12, fontWeight: 500, border: "none" },
    }));
    const childRadius = 380;
    const childNodes: Node[] = [];
    sources.forEach((s, i) => {
      for (let c = 0; c < 2; c++) {
        const a = angleStep * i + (c === 0 ? -0.18 : 0.18);
        childNodes.push({
          id: `c-${s.id}-${c}`,
          position: { x: center.x + Math.cos(a) * childRadius, y: center.y + Math.sin(a) * childRadius },
          data: { label: c === 0 ? "Core entities" : "Sub-topics" },
          style: { background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", fontSize: 11 },
        });
      }
    });
    const es: Edge[] = [
      ...sources.map<Edge>((s) => ({ id: `r-${s.id}`, source: "root", target: `s-${s.id}`, type: "smoothstep", style: { stroke: srcColor[s.type], strokeOpacity: 0.6 } })),
      ...sources.flatMap<Edge>((s) => [0, 1].map((c) => ({ id: `r-${s.id}-${c}`, source: `s-${s.id}`, target: `c-${s.id}-${c}`, type: "smoothstep", style: { stroke: srcColor[s.type], strokeOpacity: 0.4 } }))),
    ];
    return { nodes: [root, ...srcNodes, ...childNodes], edges: es };
  }, [sources, ws.name]);

  if (sources.length === 0) {
    return (
      <div className="h-full grid place-items-center">
        <div className="text-center text-muted-foreground">
          <div className="text-sm">Index at least one source to generate a mind map.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-10rem)]">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button onClick={async () => { setRegenerating(true); await new Promise(r => setTimeout(r, 900)); setRegenerating(false); toast.success("Mind map regenerated"); }} disabled={regenerating} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:border-border-hover px-3 py-1.5 text-xs disabled:opacity-60">
          <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} /> Regenerate
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:border-border-hover px-3 py-1.5 text-xs"><Download className="h-3.5 w-3.5" /> PNG</button>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:border-border-hover px-3 py-1.5 text-xs"><Download className="h-3.5 w-3.5" /> JSON</button>
      </div>
      <ReactFlow nodes={nodes} edges={edges} fitView nodesDraggable zoomOnScroll>
        <Background color="#1a1a1a" gap={24} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
