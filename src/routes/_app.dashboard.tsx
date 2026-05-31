import { createFileRoute, Link } from "@tanstack/react-router";
import { MOCK_USER, MOCK_USAGE, MOCK_WORKSPACES, MOCK_SOURCES, MOCK_QUERIES, PLANS } from "@/lib/mock/data";
import { SourceTypeIcon, sourceLabel } from "@/components/shared/SourceTypeIcon";
import { SourceStatusBadge, ConfidenceBadge } from "@/components/shared/StatusBadge";
import { Plus, FileUp, MessageSquare, FolderKanban, Database, Network, Gauge, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — EnterpriseIQ" }] }),
  component: Dashboard,
});

function Dashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const plan = PLANS[MOCK_USER.plan];
  const recentQueries = MOCK_QUERIES.slice(0, 10);
  const recentSources = MOCK_SOURCES.slice(0, 5);

  return (
    <div className="max-w-[1280px] mx-auto p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{greeting}, {MOCK_USER.fullName.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground mt-1">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {MOCK_USER.plan === "free" && (
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold">{plan.name} plan</div>
              <div className="text-xs text-muted-foreground">Track your monthly usage</div>
            </div>
            <Link to="/settings/billing" className="text-sm text-brand hover:text-brand-hover">Manage billing →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UsageMeter label="Queries" used={MOCK_USAGE.queriesUsed} limit={plan.queries} />
            <UsageMeter label="Sources" used={MOCK_USAGE.sourcesUsed} limit={plan.sources} />
            <UsageMeter label="Workspaces" used={MOCK_USAGE.workspacesUsed} limit={plan.workspaces} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={Database} label="Sources Indexed" value="27" />
        <Stat icon={MessageSquare} label="Queries this week" value="142" />
        <Stat icon={Network} label="Graph nodes" value="3,184" />
        <Stat icon={Gauge} label="Avg response" value="1.4s" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Link to="/workspaces" className="inline-flex items-center gap-2 rounded-md bg-brand hover:bg-brand-hover text-primary-foreground px-3.5 py-2 text-sm font-medium active:scale-95"><Plus className="h-4 w-4" /> New Workspace</Link>
        <Link to="/workspaces/$id/sources" params={{ id: "ws_payments" }} className="inline-flex items-center gap-2 rounded-md border border-border hover:border-border-hover px-3.5 py-2 text-sm font-medium active:scale-95"><FileUp className="h-4 w-4" /> Upload PDF</Link>
        <Link to="/workspaces/$id/query" params={{ id: "ws_payments" }} className="inline-flex items-center gap-2 rounded-md border border-border hover:border-border-hover px-3.5 py-2 text-sm font-medium active:scale-95"><MessageSquare className="h-4 w-4" /> Ask a Question</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-brand" /> Recent queries</h2>
          </div>
          <div className="divide-y divide-border">
            {recentQueries.map((q) => {
              const ws = MOCK_WORKSPACES.find(w => w.id === q.workspaceId);
              return (
                <div key={q.id} className="p-4 flex items-center gap-4 text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{q.text}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{ws?.name}</span>
                      <span>·</span>
                      <span className="inline-block rounded bg-elevated px-1.5 py-0.5 text-[10px] uppercase">{q.type}</span>
                      <span>·</span>
                      <span>{formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <ConfidenceBadge level={q.confidence} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2"><FolderKanban className="h-4 w-4 text-brand" /> Recent sources</h2>
          </div>
          <div className="divide-y divide-border">
            {recentSources.map((s) => (
              <div key={s.id} className="p-4 flex items-center gap-3">
                <SourceTypeIcon type={s.type} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{sourceLabel(s.type)}</div>
                </div>
                <SourceStatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Database; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs">{label}</span>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function UsageMeter({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = limit === Infinity ? 0 : Math.min(100, (used / limit) * 100);
  const color = pct >= 100 ? "bg-destructive" : pct >= 80 ? "bg-warning" : "bg-brand";
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{used}<span className="text-muted-foreground">/{limit === Infinity ? "∞" : limit}</span></span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-elevated overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
