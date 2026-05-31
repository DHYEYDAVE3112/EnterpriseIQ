import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/_app/workspaces/$id/analytics")({
  head: () => ({ meta: [{ title: "Analytics — EnterpriseIQ" }] }),
  component: AnalyticsPage,
});

const days = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (13 - i));
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
});
const queryVolume = days.map((d, i) => ({ d, count: 8 + Math.round(Math.sin(i) * 4) + i % 5 * 2 }));
const latency = days.map((d, i) => ({ d, ms: 1100 + Math.round(Math.cos(i / 2) * 250) + i * 20 }));
const typeDist = [
  { name: "Code", value: 48, color: "var(--ent-class)" },
  { name: "Document", value: 24, color: "var(--ent-document)" },
  { name: "Graph", value: 14, color: "var(--ent-module)" },
  { name: "SQL", value: 10, color: "var(--ent-table)" },
  { name: "API", value: 4, color: "var(--ent-api)" },
];
const topSources = [
  { name: "payments-api", count: 64, color: "var(--src-github)" },
  { name: "docs.acme.com", count: 31, color: "var(--src-website)" },
  { name: "Stripe Guide", count: 22, color: "var(--src-pdf)" },
  { name: "billing_db", count: 18, color: "var(--src-sql)" },
  { name: "openapi", count: 9, color: "var(--src-api)" },
];
const confDist = days.map((d, i) => ({ d, high: 6 + i % 3, medium: 3 + i % 2, low: 1 + (i % 4 === 0 ? 2 : 0) }));
const entityCounts = [
  { type: "Module", count: 124, color: "var(--ent-module)" },
  { type: "Class", count: 312, color: "var(--ent-class)" },
  { type: "Function", count: 1042, color: "var(--ent-function)" },
  { type: "API", count: 88, color: "var(--ent-api)" },
  { type: "Service", count: 12, color: "var(--ent-service)" },
  { type: "DB Table", count: 41, color: "var(--ent-table)" },
];

function AnalyticsPage() {
  const [range, setRange] = useState<"7" | "30" | "90">("30");
  return (
    <div className="max-w-[1280px] mx-auto p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold tracking-tight">Usage analytics</h2>
        <div className="inline-flex rounded-md border border-border bg-card">
          {(["7","30","90"] as const).map(r => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 text-xs ${range === r ? "bg-brand text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Last {r} days</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total queries", value: "412" },
          { label: "Avg confidence", value: "82%" },
          { label: "Avg latency", value: "1.4s" },
          { label: "Indexed entities", value: "1,619" },
          { label: "Ingestion success", value: "94%" },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart title="Query volume">
          <ResponsiveContainer><LineChart data={queryVolume}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
            <Line type="monotone" dataKey="count" stroke="var(--brand)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart></ResponsiveContainer>
        </Chart>

        <Chart title="Query type distribution">
          <ResponsiveContainer><PieChart>
            <Pie data={typeDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
              {typeDist.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
          </PieChart></ResponsiveContainer>
        </Chart>

        <Chart title="Top queried sources">
          <ResponsiveContainer><BarChart data={topSources} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={11} width={90} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {topSources.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart></ResponsiveContainer>
        </Chart>

        <Chart title="Avg response latency (ms)">
          <ResponsiveContainer><AreaChart data={latency}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
            <Area type="monotone" dataKey="ms" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.2} />
          </AreaChart></ResponsiveContainer>
        </Chart>

        <Chart title="Confidence distribution">
          <ResponsiveContainer><BarChart data={confDist}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="high" stackId="a" fill="var(--success)" />
            <Bar dataKey="medium" stackId="a" fill="var(--warning)" />
            <Bar dataKey="low" stackId="a" fill="var(--destructive)" />
          </BarChart></ResponsiveContainer>
        </Chart>

        <Chart title="Entity counts by type">
          <ResponsiveContainer><BarChart data={entityCounts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis type="category" dataKey="type" stroke="var(--muted-foreground)" fontSize={11} width={80} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {entityCounts.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart></ResponsiveContainer>
        </Chart>
      </div>
    </div>
  );
}

function Chart({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}
