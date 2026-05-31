import { createFileRoute, Link } from "@tanstack/react-router";
import { MOCK_WORKSPACES, MOCK_SOURCES } from "@/lib/mock/data";
import { Plus, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/workspaces/")({
  head: () => ({ meta: [{ title: "Workspaces — EnterpriseIQ" }] }),
  component: WorkspaceList,
});

function WorkspaceList() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div className="max-w-[1280px] mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Workspaces</h1>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-md bg-brand hover:bg-brand-hover text-primary-foreground px-3.5 py-2 text-sm font-medium active:scale-95">
          <Plus className="h-4 w-4" /> New Workspace
        </button>
      </div>

      {MOCK_WORKSPACES.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center text-muted-foreground">
          You have no workspaces yet. Create one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_WORKSPACES.map((w) => {
            const sources = MOCK_SOURCES.filter((s) => s.workspaceId === w.id).length;
            return (
              <div key={w.id} className="rounded-lg border border-border bg-card p-5 hover:border-border-hover transition flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold tracking-tight">{w.name}</h3>
                  <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">{w.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-elevated px-1.5 py-0.5">{sources} sources</span>
                  <span>·</span>
                  <span>{formatDistanceToNow(new Date(w.lastActivity), { addSuffix: true })}</span>
                </div>
                <Link to="/workspaces/$id/sources" params={{ id: w.id }} className="mt-4 inline-flex items-center justify-center rounded-md bg-brand hover:bg-brand-hover text-primary-foreground py-2 text-sm font-medium active:scale-95">Open</Link>
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <div role="dialog" className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">Create workspace</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1.5">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Description (optional)</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand resize-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button disabled={!name.trim()} onClick={() => { toast.success(`Workspace "${name}" created`); setOpen(false); setName(""); setDesc(""); }} className="rounded-md bg-brand hover:bg-brand-hover disabled:opacity-50 text-primary-foreground px-4 py-2 text-sm font-medium active:scale-95">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
