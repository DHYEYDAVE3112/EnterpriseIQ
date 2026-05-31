import { createFileRoute, useParams } from "@tanstack/react-router";
import { MOCK_SOURCES, MOCK_QUERIES, MOCK_FOLLOWUPS, type QueryRecord, type QueryType } from "@/lib/mock/data";
import { SourceTypeIcon } from "@/components/shared/SourceTypeIcon";
import { ConfidenceBadge } from "@/components/shared/StatusBadge";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, ChevronDown, ChevronRight, Copy, ThumbsUp, ThumbsDown, Share2, AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/workspaces/$id/query")({
  head: () => ({ meta: [{ title: "Query — EnterpriseIQ" }] }),
  component: QueryPage,
});

interface Message {
  role: "user" | "ai";
  text: string;
  record?: QueryRecord;
  streaming?: boolean;
  streamPhase?: "routing" | "retrieving" | "reranking" | "generating";
}

function QueryPage() {
  const { id } = useParams({ from: "/_app/workspaces/$id/query" });
  const sources = MOCK_SOURCES.filter((s) => s.workspaceId === id);
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set(sources.filter(s => s.status === "indexed").map(s => s.id)));
  const [queryType, setQueryType] = useState<QueryType | "auto">("auto");
  const [showGraph, setShowGraph] = useState(true);
  const [showSnippets, setShowSnippets] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const ask = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text };
    const aiMsg: Message = { role: "ai", text: "", streaming: true, streamPhase: "routing" };
    setMessages((m) => [...m, userMsg, aiMsg]);
    setInput("");

    const seed = MOCK_QUERIES[messages.length % MOCK_QUERIES.length];

    // Fake streaming phases
    setTimeout(() => setMessages((m) => m.map((msg, i) => i === m.length - 1 ? { ...msg, streamPhase: "retrieving" } : msg)), 500);
    setTimeout(() => setMessages((m) => m.map((msg, i) => i === m.length - 1 ? { ...msg, streamPhase: "reranking" } : msg)), 1100);
    setTimeout(() => setMessages((m) => m.map((msg, i) => i === m.length - 1 ? { ...msg, streamPhase: "generating" } : msg)), 1600);

    // Token stream
    const words = seed.answer.split(/(\s+)/);
    let acc = "";
    words.forEach((w, idx) => {
      setTimeout(() => {
        acc += w;
        setMessages((m) => m.map((msg, i) => i === m.length - 1 ? { ...msg, text: acc, streaming: idx < words.length - 1 } : msg));
        if (idx === words.length - 1) {
          setMessages((m) => m.map((msg, i) => i === m.length - 1 ? { ...msg, record: seed, streaming: false } : msg));
        }
      }, 1800 + idx * 25);
    });
  };

  const hasNoIndexed = sources.filter(s => s.status === "indexed").length === 0;

  return (
    <div className="flex h-[calc(100vh-10rem)]">
      <aside className="hidden md:flex w-[320px] border-r border-border flex-col overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Query settings</h3>
        </div>

        <div className="p-4 border-b border-border">
          <div className="text-xs font-medium mb-3">Sources</div>
          <div className="space-y-1.5">
            {sources.map((s) => {
              const disabled = s.status !== "indexed";
              const checked = selectedSources.has(s.id);
              return (
                <label key={s.id} title={disabled ? "Still indexing — available soon." : undefined} className={cn("flex items-center gap-2 text-sm cursor-pointer rounded p-1.5 hover:bg-accent", disabled && "opacity-50 cursor-not-allowed")}>
                  <input type="checkbox" disabled={disabled} checked={checked} onChange={() => {
                    const ns = new Set(selectedSources);
                    if (checked) ns.delete(s.id); else ns.add(s.id);
                    setSelectedSources(ns);
                  }} className="accent-brand" />
                  <SourceTypeIcon type={s.type} size="sm" />
                  <span className="truncate flex-1">{s.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-b border-border">
          <div className="text-xs font-medium mb-3">Query type</div>
          <div className="grid grid-cols-3 gap-1">
            {(["auto", "code", "document", "graph", "sql", "api", "hybrid"] as const).map((t) => (
              <button key={t} onClick={() => setQueryType(t)} className={cn("rounded px-2 py-1 text-xs border transition capitalize",
                queryType === t ? "border-brand bg-brand/15" : "border-border text-muted-foreground hover:text-foreground"
              )}>{t}</button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b border-border space-y-3">
          <Toggle label="Show knowledge graph" checked={showGraph} onChange={setShowGraph} />
          <Toggle label="Show source snippets" checked={showSnippets} onChange={setShowSnippets} />
        </div>

        <div className="p-4">
          <button onClick={() => { setMessages([]); toast.success("Conversation cleared"); }} className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-border hover:border-destructive/50 hover:text-destructive py-2 text-sm active:scale-95">
            <Trash2 className="h-3.5 w-3.5" /> Clear History
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full grid place-items-center p-8">
              <div className="max-w-md text-center">
                <Sparkles className="h-8 w-8 text-brand mx-auto" />
                <h3 className="mt-4 font-semibold text-lg">Ask anything about your sources</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try: "How is authentication implemented?" or "What services depend on the payment module?"</p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {MOCK_FOLLOWUPS.map((q) => (
                    <button key={q} onClick={() => ask(q)} className="rounded-full border border-border bg-card hover:border-border-hover px-3 py-1.5 text-xs">{q}</button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-6 space-y-6">
              {messages.map((m, i) => m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="rounded-lg bg-brand text-primary-foreground px-4 py-2 text-sm max-w-[80%]">{m.text}</div>
                </div>
              ) : (
                <AIResponse key={i} msg={m} showGraph={showGraph} showSnippets={showSnippets} onFollowup={ask} />
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>

        <div className="border-t border-border p-4 bg-background">
          <div className="max-w-3xl mx-auto">
            {hasNoIndexed && (
              <div className="mb-3 rounded-md border border-warning/30 bg-warning/10 text-warning text-xs px-3 py-2">
                No indexed sources yet. Add a source in the Sources tab to start querying.
              </div>
            )}
            <div className="rounded-lg border border-border bg-card focus-within:border-border-hover">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) ask(input); }}
                placeholder="Ask anything about your sources..."
                rows={2}
                maxLength={2000}
                disabled={hasNoIndexed}
                className="w-full bg-transparent resize-none px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-between px-3 py-2 border-t border-border">
                <div className="text-xs text-muted-foreground">{input.length}/2000 · <kbd className="rounded border border-border bg-elevated px-1 py-0.5 text-[10px]">⌘↵</kbd></div>
                <button onClick={() => ask(input)} disabled={!input.trim() || hasNoIndexed} className="inline-flex items-center gap-1.5 rounded-md bg-brand hover:bg-brand-hover disabled:opacity-50 text-primary-foreground px-3 py-1.5 text-sm font-medium active:scale-95">
                  <Send className="h-3.5 w-3.5" /> Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
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

function AIResponse({ msg, showGraph, showSnippets, onFollowup }: { msg: Message; showGraph: boolean; showSnippets: boolean; onFollowup: (q: string) => void }) {
  const [traceOpen, setTraceOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const rec = msg.record;

  const phaseLabel = msg.streamPhase === "routing" ? "Detecting query type..."
    : msg.streamPhase === "retrieving" ? "Running retrievers..."
    : msg.streamPhase === "reranking" ? "Reranking candidates..."
    : "Generating answer...";

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-md bg-brand/15 grid place-items-center"><Sparkles className="h-4 w-4 text-brand" /></div>
        <span className="font-semibold text-sm">EnterpriseIQ</span>
        <span className="text-xs text-muted-foreground">just now</span>
        {rec && <div className="ml-auto"><ConfidenceBadge level={rec.confidence} /></div>}
      </div>

      {msg.streaming && !msg.text && (
        <div className="space-y-2">
          <div className="h-1 bg-elevated rounded-full overflow-hidden"><div className="h-full bg-brand animate-pulse" style={{ width: "60%" }} /></div>
          <div className="text-sm text-muted-foreground">{phaseLabel}</div>
        </div>
      )}

      {msg.text && (
        <div className="prose-styles">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}
            components={{
              p: ({ children }) => <p className="text-sm leading-7 mb-3">{children}</p>,
              h3: ({ children }) => <h3 className="font-semibold mt-4 mb-2">{children}</h3>,
              code: ({ children, className }) => className ? <code className={className}>{children}</code> : <code className="rounded bg-elevated px-1 py-0.5 text-[12px] font-mono">{children}</code>,
              pre: ({ children }) => <pre className="rounded-md border border-border bg-[#161616] p-3 text-xs font-mono leading-relaxed overflow-x-auto my-3">{children}</pre>,
              ul: ({ children }) => <ul className="list-disc pl-5 text-sm space-y-1 mb-3">{children}</ul>,
            }}
          >{msg.text}</ReactMarkdown>
        </div>
      )}

      {rec && rec.confidence === "low" && (
        <div className="mt-3 rounded-md border border-warning/30 bg-warning/10 text-warning text-xs p-3 flex gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div><strong>Low evidence:</strong> The system found limited supporting context. This answer may be incomplete. Consider adding more relevant sources.</div>
        </div>
      )}

      {rec && (
        <div className="mt-4 space-y-3 text-sm">
          <Collapse open={traceOpen} onToggle={() => setTraceOpen(!traceOpen)} label="Retrieval trace">
            <div className="space-y-2 text-xs">
              <div>Detected type: <span className="rounded bg-elevated px-1.5 py-0.5 ml-1 capitalize">{rec.type}</span></div>
              <div className="flex flex-wrap gap-1.5">Retrievers: {rec.retrievers.map((r) => <span key={r} className="rounded bg-elevated px-1.5 py-0.5">{r}</span>)}</div>
              <div>Candidates before reranking: <strong>{rec.candidatesBefore}</strong></div>
              <div>Candidates after dedup + rerank: <strong>{rec.candidatesAfter}</strong></div>
            </div>
          </Collapse>

          <Collapse open={sourcesOpen} onToggle={() => setSourcesOpen(!sourcesOpen)} label={`Sources used (${rec.sources.length})`}>
            <div className="space-y-3">
              {rec.sources.map((s) => (
                <div key={s.id} className="rounded-md border border-border bg-elevated/40 p-3">
                  <div className="flex items-center gap-2">
                    <SourceTypeIcon type={s.sourceType} size="sm" />
                    <div className="text-sm font-medium truncate flex-1">{s.sourceName}</div>
                    <div className="text-xs text-muted-foreground font-mono">{s.ref}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-elevated overflow-hidden">
                      <div className="h-full bg-brand" style={{ width: `${Math.round(s.relevance * 100)}%` }} />
                    </div>
                    <div className="text-xs text-muted-foreground tabular-nums">{Math.round(s.relevance * 100)}%</div>
                  </div>
                  {showSnippets && (
                    <pre className="mt-3 text-[11px] font-mono text-muted-foreground bg-[#161616] border border-border rounded p-2 overflow-x-auto">{s.snippet}</pre>
                  )}
                </div>
              ))}
            </div>
          </Collapse>

          {showGraph && (
            <div className="rounded-md border border-border bg-elevated/30 p-4">
              <div className="text-xs font-semibold mb-2">Inline knowledge graph</div>
              <div className="h-40 grid place-items-center text-xs text-muted-foreground">[mini-graph of cited entities]</div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {MOCK_FOLLOWUPS.map((q) => (
              <button key={q} onClick={() => onFollowup(q)} className="rounded-full border border-border bg-elevated hover:border-border-hover px-3 py-1 text-xs">{q}</button>
            ))}
          </div>

          <div className="flex items-center gap-1 pt-2 border-t border-border">
            <IconBtn onClick={() => toast.success("Thanks for the feedback")}><ThumbsUp className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn onClick={() => toast.success("Thanks for the feedback")}><ThumbsDown className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn onClick={() => { navigator.clipboard.writeText(rec.answer); toast.success("Answer copied"); }}><Copy className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn onClick={() => toast.success("Link copied")}><Share2 className="h-3.5 w-3.5" /></IconBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function Collapse({ open, onToggle, label, children }: { open: boolean; onToggle: () => void; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-elevated/40">
        <span className="flex items-center gap-2">{open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />} {label}</span>
      </button>
      {open && <div className="p-3 pt-0">{children}</div>}
    </div>
  );
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button onClick={onClick} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition">{children}</button>;
}
