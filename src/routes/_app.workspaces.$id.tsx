import { createFileRoute, Outlet, Link, useRouterState, useParams } from "@tanstack/react-router";
import { MOCK_WORKSPACES, MOCK_SOURCES } from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/workspaces/$id")({
  component: WorkspaceLayout,
});

const TABS = [
  { to: "/workspaces/$id/sources", label: "Sources" },
  { to: "/workspaces/$id/query", label: "Query" },
  { to: "/workspaces/$id/graph", label: "Graph" },
  { to: "/workspaces/$id/mindmap", label: "Mind Map" },
  { to: "/workspaces/$id/history", label: "History" },
  { to: "/workspaces/$id/analytics", label: "Analytics" },
] as const;

function WorkspaceLayout() {
  const { id } = useParams({ from: "/_app/workspaces/$id" });
  const ws = MOCK_WORKSPACES.find((w) => w.id === id) ?? MOCK_WORKSPACES[0];
  const indexing = MOCK_SOURCES.find((s) => s.workspaceId === id && s.status === "indexing");
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-background">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 pt-6">
          <h1 className="text-2xl font-semibold tracking-tight">{ws.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{ws.description}</p>
          <div className="mt-5 flex gap-1 overflow-x-auto">
            {TABS.map((t) => {
              const href = t.to.replace("$id", id);
              const active = path === href;
              return (
                <Link key={t.to} to={t.to} params={{ id }} className={cn(
                  "shrink-0 rounded-md px-3 py-1.5 text-sm transition border-b-2 -mb-px",
                  active ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                )}>
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {indexing && (
        <div className="bg-warning/10 border-b border-warning/30 text-warning text-sm">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-2.5 flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Indexing in progress: <strong>{indexing.name}</strong> — {indexing.progress ?? 0}% complete</span>
            <div className="flex-1 h-1 rounded-full bg-warning/20 overflow-hidden max-w-xs">
              <div className="h-full bg-warning" style={{ width: `${indexing.progress ?? 0}%` }} />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  );
}
