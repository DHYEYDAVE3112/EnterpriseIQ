import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Key, Check, AlertCircle, Trash2, Plus } from "lucide-react";
import { MOCK_USER, PLANS } from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings/")({
  head: () => ({ meta: [{ title: "Settings — EnterpriseIQ" }] }),
  component: SettingsPage,
});

const TABS = ["Profile", "Security", "API Keys", "Notifications"] as const;
type Tab = typeof TABS[number];

function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Profile");

  return (
    <div className="max-w-[1280px] mx-auto p-6 md:p-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Settings</h1>
      <div className="flex gap-1 border-b border-border mb-6">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-2 text-sm border-b-2 -mb-px transition",
            tab === t ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          )}>{t}</button>
        ))}
      </div>

      <div className="max-w-2xl">
        {tab === "Profile" && <ProfileTab />}
        {tab === "Security" && <SecurityTab />}
        {tab === "API Keys" && <ApiKeysTab />}
        {tab === "Notifications" && <NotificationsTab />}
      </div>
    </div>
  );
}

function ProfileTab() {
  const [name, setName] = useState(MOCK_USER.fullName);
  const [email, setEmail] = useState(MOCK_USER.email);
  const initial = MOCK_USER.fullName === name && MOCK_USER.email === email;
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-5">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-brand/20 text-brand grid place-items-center text-xl font-semibold">{name.split(" ").map(n => n[0]).join("")}</div>
        <button className="text-sm text-brand hover:text-brand-hover">Upload avatar</button>
      </div>
      <Field label="Full Name"><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="Email">
        <div className="flex items-center gap-2">
          <input className="input flex-1" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          {MOCK_USER.emailVerified ? <span className="inline-flex items-center gap-1 text-xs text-success"><Check className="h-3 w-3" /> Verified</span> : <span className="inline-flex items-center gap-1 text-xs text-warning"><AlertCircle className="h-3 w-3" /> Unverified</span>}
        </div>
      </Field>
      <button disabled={initial} onClick={() => toast.success("Profile updated")} className="rounded-md bg-brand hover:bg-brand-hover disabled:opacity-50 text-primary-foreground px-4 py-2 text-sm font-medium active:scale-95">Save Changes</button>
      <style>{`.input{width:100%;border-radius:6px;border:1px solid var(--border);background:var(--background);padding:8px 12px;font-size:14px;outline:none}.input:focus{box-shadow:0 0 0 2px var(--brand)}`}</style>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h3 className="font-semibold">Change password</h3>
        <Field label="Current password"><input type="password" className="input" /></Field>
        <Field label="New password"><input type="password" className="input" /></Field>
        <Field label="Confirm new password"><input type="password" className="input" /></Field>
        <button onClick={() => toast.success("Password updated")} className="rounded-md bg-brand hover:bg-brand-hover text-primary-foreground px-4 py-2 text-sm font-medium active:scale-95">Update Password</button>
      </div>
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold mb-3">Connected accounts</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">GitHub</div>
            <div className="text-xs text-muted-foreground">Connected as @aaravm</div>
          </div>
          <button onClick={() => toast.success("Disconnected")} className="rounded-md border border-border hover:border-destructive/40 hover:text-destructive px-3 py-1.5 text-sm active:scale-95">Disconnect</button>
        </div>
      </div>
      <style>{`.input{width:100%;border-radius:6px;border:1px solid var(--border);background:var(--background);padding:8px 12px;font-size:14px;outline:none}.input:focus{box-shadow:0 0 0 2px var(--brand)}`}</style>
    </div>
  );
}

function ApiKeysTab() {
  const isFree = MOCK_USER.plan === "free";
  const [keys, setKeys] = useState([
    { id: "k1", name: "Production", prefix: "eiq_live", created: "2025-04-12", lastUsed: "2025-05-30" },
  ]);
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground mb-5">API keys allow programmatic access to EnterpriseIQ. Only available on Pro and Enterprise plans.</p>
      {isFree && (
        <div className="mb-5 rounded-md border border-warning/30 bg-warning/10 text-warning text-xs p-3">
          Upgrade to Pro to create API keys.
        </div>
      )}
      <div className={cn("space-y-3", isFree && "opacity-50 pointer-events-none")}>
        <table className="w-full text-sm">
          <thead className="text-muted-foreground text-xs">
            <tr><th className="text-left p-2">Name</th><th className="text-left p-2">Prefix</th><th className="text-left p-2">Created</th><th className="text-left p-2">Last used</th><th /></tr>
          </thead>
          <tbody>
            {keys.map(k => (
              <tr key={k.id} className="border-t border-border">
                <td className="p-2 font-medium">{k.name}</td>
                <td className="p-2 font-mono text-xs">{k.prefix}...</td>
                <td className="p-2 text-muted-foreground">{k.created}</td>
                <td className="p-2 text-muted-foreground">{k.lastUsed}</td>
                <td className="p-2 text-right">
                  <button onClick={() => { setKeys(keys.filter(x => x.id !== k.id)); toast.success("Key revoked"); }} className="text-destructive hover:underline text-xs inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => toast.success("Key created (demo)")} className="inline-flex items-center gap-2 rounded-md border border-border hover:border-border-hover px-3 py-1.5 text-sm"><Plus className="h-4 w-4" /> Generate New Key</button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({ done: true, fail: true, weekly: false });
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <Toggle label="Email when ingestion completes" checked={prefs.done} onChange={(v) => setPrefs({ ...prefs, done: v })} />
      <Toggle label="Email when ingestion fails" checked={prefs.fail} onChange={(v) => setPrefs({ ...prefs, fail: v })} />
      <Toggle label="Weekly usage digest" checked={prefs.weekly} onChange={(v) => setPrefs({ ...prefs, weekly: v })} />
      <button onClick={() => toast.success("Preferences saved")} className="rounded-md bg-brand hover:bg-brand-hover text-primary-foreground px-4 py-2 text-sm font-medium active:scale-95">Save Preferences</button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-medium mb-1.5">{label}</label>{children}</div>;
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm">{label}</span>
      <button type="button" onClick={() => onChange(!checked)} className={cn("relative h-5 w-9 rounded-full transition", checked ? "bg-brand" : "bg-border")}>
        <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white transition", checked ? "left-4" : "left-0.5")} />
      </button>
    </label>
  );
}
