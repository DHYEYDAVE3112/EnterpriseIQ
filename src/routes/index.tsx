import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Network, Boxes, BrainCircuit, ShieldCheck, Workflow, CreditCard, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EnterpriseIQ — One Intelligence Layer for All Your Enterprise Knowledge" },
      { name: "description", content: "Ingest code, docs, APIs, and databases. Ask questions. Get grounded answers with citations, knowledge graphs, and mind maps." },
      { property: "og:title", content: "EnterpriseIQ" },
      { property: "og:description", content: "One platform to search, understand, and reason across all your enterprise knowledge." },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Boxes, title: "Multi-Source Retrieval", body: "Ingest GitHub repos, PDFs, websites, APIs, and SQL databases into one unified index. Query all sources simultaneously." },
  { icon: Network, title: "GraphRAG Knowledge Intelligence", body: "Entities, functions, classes, and services become graph nodes. Answers are dependency-aware and relationship-informed." },
  { icon: BrainCircuit, title: "AI Mind Maps", body: "Every source automatically generates a visual knowledge map. Understand project architecture at a glance." },
  { icon: Workflow, title: "Intelligent Query Routing", body: "The system detects whether your question is about code, docs, architecture, or data — and routes to the right pipeline automatically." },
  { icon: ShieldCheck, title: "Hallucination-Free Answers", body: "Every answer shows exactly which source it came from, with confidence scores and retrieval traces. No invented context." },
  { icon: CreditCard, title: "Razorpay-Powered Plans", body: "Start free, upgrade when ready. Transparent usage limits with instant plan activation." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <PricingTeaser />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/70 border-b border-border/50">
      <div className="max-w-[1280px] mx-auto h-14 flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-brand" />
          <span className="font-semibold tracking-tight">EnterpriseIQ</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/pricing" className="px-3 py-1.5 text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link to="/login" className="px-3 py-1.5 text-muted-foreground hover:text-foreground">Login</Link>
          <Link to="/register" className="px-3 py-1.5 rounded-md bg-brand hover:bg-brand-hover text-primary-foreground font-medium transition active:scale-95">Get Started</Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 min-h-[90vh] flex flex-col justify-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" /> AI Enterprise Knowledge + Code Intelligence
        </span>
        <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
          One platform to search, understand, and reason across all your enterprise knowledge.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Ingest code, docs, APIs, and databases. Ask questions. Get grounded answers with citations, knowledge graphs, and mind maps.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/register" className="inline-flex items-center gap-2 rounded-md bg-brand hover:bg-brand-hover text-primary-foreground px-5 py-3 text-sm font-medium transition active:scale-95">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/pricing" className="rounded-md border border-border hover:border-border-hover px-5 py-3 text-sm font-medium transition active:scale-95">
            View Pricing
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Powered by GPT-4o</span>
          <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> GraphRAG + LangGraph</span>
          <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Zero hallucination design</span>
        </div>
      </motion.div>
    </section>
  );
}

function Features() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-24 border-t border-border">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight max-w-2xl">
        Everything your team needs to understand complex systems
      </h2>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-lg border border-border bg-card p-6 hover:border-border-hover transition">
            <Icon className="h-5 w-5 text-brand" />
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: 1, t: "Ingest", d: "Connect your GitHub repo, upload a PDF, or paste a website URL. The platform indexes, chunks, embeds, and graphs your content automatically." },
    { n: 2, t: "Route & Retrieve", d: "Ask a natural language question. LangGraph routes it to the right retriever combination. LangChain orchestrates multi-source retrieval with reranking and deduplication." },
    { n: 3, t: "Answer with Proof", d: "Receive a grounded answer with source citations, confidence score, retrieval trace, and an optional knowledge graph view." },
  ];
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-24 border-t border-border">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">How it works</h2>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div key={s.n} className="rounded-lg border border-border bg-card p-6">
            <div className="h-8 w-8 rounded-md bg-brand/15 text-brand grid place-items-center font-semibold text-sm">{s.n}</div>
            <h3 className="mt-4 font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingTeaser() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-24 border-t border-border">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Simple, usage-based pricing</h2>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { n: "Free", p: "₹0", d: "1 workspace · 50 queries / month" },
          { n: "Pro", p: "₹999", d: "5 workspaces · 500 queries · graph + mind map" },
          { n: "Enterprise", p: "₹4,999", d: "Unlimited everything · API access · priority support" },
        ].map((p) => (
          <div key={p.n} className="rounded-lg border border-border bg-card p-6">
            <div className="text-sm text-muted-foreground">{p.n}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">{p.p}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
            <div className="mt-3 text-sm text-muted-foreground">{p.d}</div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link to="/pricing" className="inline-flex items-center gap-2 text-sm text-brand hover:text-brand-hover">
          See full comparison <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-[1280px] mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>
          <div className="font-semibold text-foreground">EnterpriseIQ</div>
          <div className="mt-1">One intelligence layer for all your enterprise knowledge.</div>
        </div>
        <div className="flex gap-4">
          <Link to="/pricing">Pricing</Link>
          <Link to="/login">Login</Link>
        </div>
        <div>© {new Date().getFullYear()} EnterpriseIQ</div>
      </div>
    </footer>
  );
}
