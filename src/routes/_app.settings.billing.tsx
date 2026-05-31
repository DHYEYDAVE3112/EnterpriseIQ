import { createFileRoute } from "@tanstack/react-router";
import { MOCK_USER, MOCK_USAGE, MOCK_INVOICES, PLANS, type PlanTier } from "@/lib/mock/data";
import { Download, Sparkles, CreditCard } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings/billing")({
  head: () => ({ meta: [{ title: "Billing — EnterpriseIQ" }] }),
  component: BillingPage,
});

function BillingPage() {
  const plan = PLANS[MOCK_USER.plan];
  const nextPlan: PlanTier | null = MOCK_USER.plan === "free" ? "pro" : MOCK_USER.plan === "pro" ? "enterprise" : null;
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div className="max-w-[1280px] mx-auto p-6 md:p-8 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>

      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Current plan</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-semibold tracking-tight">{plan.name}</span>
              <span className="rounded bg-brand/15 text-brand text-xs font-medium px-2 py-0.5">Monthly</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">Next billing: 1 July 2025</div>
          </div>
          <div className="flex gap-2">
            {nextPlan && <button onClick={() => setShowCheckout(true)} className="rounded-md bg-brand hover:bg-brand-hover text-primary-foreground px-4 py-2 text-sm font-medium active:scale-95">Upgrade</button>}
            <button onClick={() => toast.error("Subscription cancelled (demo)")} className="text-sm text-muted-foreground hover:text-destructive">Cancel</button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-semibold mb-4">Usage this month</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Meter label="Queries" used={MOCK_USAGE.queriesUsed} limit={plan.queries} />
          <Meter label="Sources" used={MOCK_USAGE.sourcesUsed} limit={plan.sources} />
          <Meter label="Workspaces" used={MOCK_USAGE.workspacesUsed} limit={plan.workspaces} />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border"><h2 className="font-semibold">Invoice history</h2></div>
        <table className="w-full text-sm">
          <thead className="bg-elevated text-muted-foreground text-xs">
            <tr><th className="text-left p-3 font-medium">Date</th><th className="text-left p-3 font-medium">Amount</th><th className="text-left p-3 font-medium">Status</th><th /></tr>
          </thead>
          <tbody>
            {MOCK_INVOICES.map(inv => (
              <tr key={inv.id} className="border-t border-border">
                <td className="p-3">{inv.date}</td>
                <td className="p-3 tabular-nums">₹{inv.amount.toLocaleString("en-IN")}</td>
                <td className="p-3"><span className={cn("rounded-full border px-2 py-0.5 text-xs",
                  inv.status === "paid" ? "border-success/30 bg-success/15 text-success" :
                  inv.status === "failed" ? "border-destructive/30 bg-destructive/15 text-destructive" :
                  "border-warning/30 bg-warning/15 text-warning"
                )}>{inv.status}</span></td>
                <td className="p-3 text-right"><button className="text-xs text-brand hover:text-brand-hover inline-flex items-center gap-1"><Download className="h-3 w-3" /> PDF</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {nextPlan && (
        <section className="rounded-lg border border-brand/40 bg-gradient-to-br from-brand/10 to-transparent p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-md bg-brand grid place-items-center"><Sparkles className="h-5 w-5 text-primary-foreground" /></div>
            <div className="flex-1">
              <h2 className="font-semibold">Upgrade to {PLANS[nextPlan].name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{PLANS[nextPlan].description}</p>
              <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-muted-foreground">
                {PLANS[nextPlan].features.filter(f => f.included).map(f => <li key={f.label}>· {f.label}</li>)}
              </ul>
            </div>
            <button onClick={() => setShowCheckout(true)} className="inline-flex items-center gap-2 rounded-md bg-brand hover:bg-brand-hover text-primary-foreground px-4 py-2.5 text-sm font-medium active:scale-95 shrink-0">
              <CreditCard className="h-4 w-4" /> Upgrade with Razorpay
            </button>
          </div>
        </section>
      )}

      {showCheckout && nextPlan && <RazorpayMock plan={nextPlan} onClose={() => setShowCheckout(false)} />}
    </div>
  );
}

function Meter({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = limit === Infinity ? 0 : Math.min(100, (used / limit) * 100);
  const color = pct >= 100 ? "bg-destructive" : pct >= 80 ? "bg-warning" : "bg-brand";
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{used}<span className="text-muted-foreground">/{limit === Infinity ? "∞" : limit}</span></span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-elevated overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RazorpayMock({ plan, onClose }: { plan: PlanTier; onClose: () => void }) {
  const p = PLANS[plan];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-lg border border-border bg-card overflow-hidden">
        <div className="bg-[#0c1320] text-white p-5 flex items-center justify-between">
          <div className="font-bold tracking-tight">Razorpay</div>
          <button onClick={onClose} className="text-white/60 hover:text-white">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <div className="text-xs text-muted-foreground">Order summary</div>
            <div className="mt-1 font-semibold">{p.name} plan · monthly</div>
          </div>
          <div className="flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-muted-foreground text-sm">Total</span>
            <span className="text-2xl font-semibold tabular-nums">₹{p.priceMonthly.toLocaleString("en-IN")}</span>
          </div>
          <button onClick={() => { toast.success(`Subscription activated! Welcome to ${p.name}.`); onClose(); }} className="w-full rounded-md bg-brand hover:bg-brand-hover text-primary-foreground py-3 text-sm font-semibold active:scale-95">Pay ₹{p.priceMonthly.toLocaleString("en-IN")}</button>
          <p className="text-[11px] text-muted-foreground text-center">Demo checkout — no real payment processed. Connect your live Razorpay keys to enable real payments.</p>
        </div>
      </div>
    </div>
  );
}
