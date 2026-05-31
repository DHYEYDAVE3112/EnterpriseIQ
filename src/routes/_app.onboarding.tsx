import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Github, FileText, Globe, Database, Plug, ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { SourceType } from "@/lib/mock/data";

export const Route = createFileRoute("/_app/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — EnterpriseIQ" }] }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [wsName, setWsName] = useState("");
  const [wsDesc, setWsDesc] = useState("");
  const [sourceType, setSourceType] = useState<SourceType | null>(null);
  const [sourceInput, setSourceInput] = useState("");
  const [indexing, setIndexing] = useState(false);

  const opts: { t: SourceType; label: string; icon: typeof Github; desc: string }[] = [
    { t: "github", label: "GitHub Repository", icon: Github, desc: "Index a repo from github.com" },
    { t: "pdf", label: "Upload PDF", icon: FileText, desc: "Upload a document up to 50MB" },
    { t: "website", label: "Enter Website URL", icon: Globe, desc: "Crawl a public website" },
    { t: "sql", label: "Connect SQL Database", icon: Database, desc: "Postgres, MySQL, SQLite" },
  ];

  return (
    <div className="min-h-screen grid place-items-center px-6 py-10">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-7 w-7 rounded bg-brand grid place-items-center"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
          <span className="font-semibold tracking-tight text-lg">EnterpriseIQ</span>
        </div>

        <div className="mb-6 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className={cn("h-1 flex-1 rounded-full", n <= step ? "bg-brand" : "bg-border")} />
          ))}
        </div>
        <div className="text-xs text-muted-foreground mb-2">Step {step} of 3</div>

        <div className="rounded-lg border border-border bg-card p-6">
          {step === 1 && (
            <>
              <h1 className="text-xl font-semibold">Create your first workspace</h1>
              <p className="text-sm text-muted-foreground mt-1">Workspaces hold a collection of related sources you can query together.</p>
              <div className="mt-6 space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5">Workspace name</label>
                  <input value={wsName} onChange={(e) => setWsName(e.target.value)} placeholder="e.g. Payments Platform" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Description <span className="text-muted-foreground">(optional)</span></label>
                  <textarea value={wsDesc} onChange={(e) => setWsDesc(e.target.value)} rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand resize-none" />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button disabled={!wsName.trim()} onClick={() => setStep(2)} className="inline-flex items-center gap-2 rounded-md bg-brand hover:bg-brand-hover disabled:opacity-50 text-primary-foreground px-4 py-2 text-sm font-medium active:scale-95">Next <ArrowRight className="h-4 w-4" /></button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-xl font-semibold">Connect your first source</h1>
              <p className="text-sm text-muted-foreground mt-1">You can add more sources later from the workspace.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {opts.map(({ t, label, icon: Icon, desc }) => (
                  <button key={t} onClick={() => setSourceType(t)} className={cn("text-left rounded-lg border p-4 transition", sourceType === t ? "border-brand bg-brand/5" : "border-border hover:border-border-hover bg-elevated")}>
                    <Icon className="h-5 w-5 text-brand" />
                    <div className="mt-2 font-medium text-sm">{label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
              {sourceType && (
                <div className="mt-4">
                  <label className="block text-xs font-medium mb-1.5">
                    {sourceType === "github" ? "Repository URL" : sourceType === "website" ? "Website URL" : sourceType === "pdf" ? "Drop a PDF" : "Connection string"}
                  </label>
                  {sourceType === "pdf" ? (
                    <div className="rounded-md border border-dashed border-border bg-elevated p-6 text-center text-sm text-muted-foreground">Drag and drop a PDF here, or click to browse</div>
                  ) : (
                    <input value={sourceInput} onChange={(e) => setSourceInput(e.target.value)} placeholder={sourceType === "github" ? "https://github.com/org/repo" : "https://..."} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand" />
                  )}
                </div>
              )}
              <div className="mt-6 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</button>
                <div className="flex items-center gap-2">
                  <button onClick={() => setStep(3)} className="text-sm text-muted-foreground hover:text-foreground">Skip for now</button>
                  <button onClick={() => setStep(3)} className="inline-flex items-center gap-2 rounded-md bg-brand hover:bg-brand-hover text-primary-foreground px-4 py-2 text-sm font-medium active:scale-95">Next <ArrowRight className="h-4 w-4" /></button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-xl font-semibold">Ready to go</h1>
              <p className="text-sm text-muted-foreground mt-1">Review your setup and start indexing.</p>
              <div className="mt-6 rounded-md border border-border bg-elevated p-4 text-sm space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Workspace</span><span className="font-medium">{wsName || "Untitled"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">First source</span><span className="font-medium">{sourceType ?? "None"}</span></div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</button>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate({ to: "/dashboard" })} className="text-sm text-muted-foreground hover:text-foreground">Explore First</button>
                  <button onClick={async () => {
                    setIndexing(true);
                    await new Promise((r) => setTimeout(r, 1200));
                    toast.success("Workspace created");
                    navigate({ to: "/workspaces/$id/query", params: { id: "ws_payments" } });
                  }} disabled={indexing} className="inline-flex items-center gap-2 rounded-md bg-brand hover:bg-brand-hover text-primary-foreground px-4 py-2 text-sm font-medium active:scale-95 disabled:opacity-60">
                    {indexing && <Loader2 className="h-4 w-4 animate-spin" />} Start Indexing
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
