import { useRouterState, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { MOCK_WORKSPACES } from "@/lib/mock/data";

function useCrumbs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const segs = path.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let acc = "";
  for (const s of segs) {
    acc += "/" + s;
    let label = s;
    if (s.startsWith("ws_")) {
      const ws = MOCK_WORKSPACES.find(w => w.id === s);
      label = ws?.name ?? s;
    } else {
      label = s.charAt(0).toUpperCase() + s.slice(1);
    }
    crumbs.push({ label, href: acc });
  }
  return crumbs;
}

export function TopBar({ title }: { title?: string }) {
  const crumbs = useCrumbs();
  return (
    <header className="h-14 shrink-0 border-b border-border flex items-center gap-2 px-4 md:px-6 bg-background/80 backdrop-blur">
      <div className="flex items-center gap-1.5 text-sm">
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            {i === crumbs.length - 1 ? (
              <span className="font-medium">{title ?? c.label}</span>
            ) : (
              <Link to={c.href} className="text-muted-foreground hover:text-foreground">{c.label}</Link>
            )}
          </span>
        ))}
      </div>
    </header>
  );
}
