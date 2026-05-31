import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Sparkles, ArrowLeft } from "lucide-react";
import { PLANS, type PlanTier } from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — EnterpriseIQ" }, { name: "description", content: "Simple plans for solo developers, teams, and enterprises." }] }),
  component: Pricing,
});

function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 backdrop-blur bg-background/70 border-b border-border/50">
        <div className="max-w-[1280px] mx-auto h-14 flex items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-brand grid place-items-center"><Sparkles className="h-3.5 w-3.5 text-primary-foreground" /></div>
            <span className="font-semibold tracking-tight">EnterpriseIQ</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"><ArrowLeft className="h-4 w-4" /> Back home</Link>
        </div>
      </header>

      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Pricing that scales with your knowledge</h1>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you need more workspaces, sources, or queries.</p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-md border border-border bg-card p-1">
            <button onClick={() => setAnnual(false)} className={cn("rounded px-4 py-1.5 text-sm transition", !annual && "bg-brand text-primary-foreground")}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={cn("rounded px-4 py-1.5 text-sm transition flex items-center gap-2", annual && "bg-brand text-primary-foreground")}>
              Annual <span className="text-[10px] rounded bg-success/20 text-success px-1.5 py-0.5">2 months free</span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.keys(PLANS) as PlanTier[]).map((tier) => {
            const plan = PLANS[tier];
            const price = annual ? plan.priceAnnual : plan.priceMonthly;
            const isPopular = tier === "pro";
            return (
              <div key={tier} className={cn("relative rounded-lg border bg-card p-6", isPopular ? "border-brand" : "border-border")}>
                {isPopular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand text-primary-foreground text-[10px] font-semibold px-2.5 py-1">MOST POPULAR</span>
                )}
                <div className="text-sm text-muted-foreground">{plan.name}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-4xl font-semibold tracking-tight">₹{price.toLocaleString("en-IN")}</div>
                  <div className="text-sm text-muted-foreground">/{annual ? "year" : "month"}</div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <button
                  onClick={() => toast.success(`${plan.name} plan selected (demo)`)}
                  className={cn("mt-6 w-full rounded-md px-4 py-2.5 text-sm font-medium transition active:scale-95",
                    tier === "free" ? "border border-border hover:border-border-hover" :
                    isPopular ? "bg-brand hover:bg-brand-hover text-primary-foreground" :
                    "bg-elevated border border-border hover:border-border-hover"
                  )}>
                  {tier === "enterprise" ? "Contact Sales" : tier === "free" ? "Get Started" : "Upgrade"}
                </button>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {plan.features.map((f) => (
                    <li key={f.label} className={cn("flex items-start gap-2", !f.included && "text-muted-foreground")}>
                      {f.included ? <Check className="h-4 w-4 text-success mt-0.5 shrink-0" /> : <X className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />}
                      <span>{f.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <ComparisonTable />
        <FAQ />
      </section>
    </div>
  );
}

function ComparisonTable() {
  const rows = [
    { label: "Workspaces", values: ["1", "5", "Unlimited"] },
    { label: "Sources", values: ["3", "25", "Unlimited"] },
    { label: "Queries / month", values: ["50", "500", "Unlimited"] },
    { label: "Knowledge Graph", values: ["—", "✓", "✓"] },
    { label: "Mind Maps", values: ["—", "✓", "✓"] },
    { label: "API key access", values: ["—", "✓", "✓"] },
    { label: "Priority support", values: ["—", "—", "✓"] },
  ];
  return (
    <div className="mt-20">
      <h2 className="text-xl font-semibold mb-6">Feature comparison</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-elevated text-muted-foreground">
            <tr>
              <th className="text-left p-3 font-medium">Feature</th>
              {(["Free", "Pro", "Enterprise"]).map((n) => <th key={n} className="p-3 font-medium">{n}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-border">
                <td className="p-3 font-medium">{r.label}</td>
                {r.values.map((v, i) => <td key={i} className="p-3 text-center text-muted-foreground">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FAQ() {
  const items = [
    { q: "Can I change plans later?", a: "Yes. You can upgrade or downgrade at any time — billing prorates automatically." },
    { q: "What payment methods are accepted?", a: "All major credit/debit cards, UPI, net banking, and wallets via Razorpay." },
    { q: "Do unused queries roll over?", a: "No, query allowances reset at the start of each billing period." },
    { q: "Can I cancel anytime?", a: "Yes — your plan remains active until the end of the paid period." },
    { q: "Is there a free trial of Pro?", a: "You can request a 14-day Pro trial from the billing page after signing up." },
  ];
  return (
    <div className="mt-20 max-w-3xl">
      <h2 className="text-xl font-semibold mb-6">Frequently asked questions</h2>
      <div className="space-y-2">
        {items.map((it) => (
          <details key={it.q} className="group rounded-lg border border-border bg-card open:border-border-hover">
            <summary className="cursor-pointer list-none p-4 font-medium flex items-center justify-between">
              {it.q}
              <span className="text-muted-foreground group-open:rotate-45 transition">+</span>
            </summary>
            <div className="px-4 pb-4 text-sm text-muted-foreground">{it.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
