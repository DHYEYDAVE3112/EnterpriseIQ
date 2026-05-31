import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FolderKanban, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/workspaces", label: "Workspaces", icon: FolderKanban },
  { to: "/workspaces/ws_payments/query", label: "Query", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function MobileTabBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-4 border-t border-border bg-card">
      {TABS.map(({ to, label, icon: Icon }) => {
        const active = path === to || path.startsWith(to + "/");
        return (
          <Link key={to} to={to} className={cn(
            "flex flex-col items-center gap-1 py-2.5 text-[11px]",
            active ? "text-brand" : "text-muted-foreground"
          )}>
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
