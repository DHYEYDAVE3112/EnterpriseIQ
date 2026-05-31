import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FolderKanban, Settings, CreditCard,
  ChevronsLeft, ChevronsRight, Sparkles, LogOut,
} from "lucide-react";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/utils";
import { MOCK_USER } from "@/lib/mock/data";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/workspaces", label: "Workspaces", icon: FolderKanban },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/settings/billing", label: "Billing", icon: CreditCard },
] as const;

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-[var(--sidebar)] transition-[width] duration-200",
        sidebarCollapsed ? "w-[60px]" : "w-[240px]",
      )}
    >
      <div className="flex h-14 items-center gap-2 px-3 border-b border-border">
        <div className="h-7 w-7 rounded-md bg-brand grid place-items-center shrink-0">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        {!sidebarCollapsed && <span className="font-semibold tracking-tight">EnterpriseIQ</span>}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="ml-auto rounded p-1 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          {sidebarCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = path === to || (to !== "/dashboard" && path.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                active ? "bg-brand/15 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent",
                sidebarCollapsed && "justify-center",
              )}
              title={sidebarCollapsed ? label : undefined}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active && "text-brand")} />
              {!sidebarCollapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={cn("border-t border-border p-2", sidebarCollapsed && "px-1")}>
        <div className={cn("flex items-center gap-3 p-2 rounded-md", !sidebarCollapsed && "hover:bg-accent")}>
          <div className="h-8 w-8 rounded-full bg-brand/20 grid place-items-center text-xs font-semibold text-brand shrink-0">
            {MOCK_USER.fullName.split(" ").map(n => n[0]).join("")}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{MOCK_USER.fullName}</div>
              <div className="text-xs text-muted-foreground truncate">{MOCK_USER.plan.toUpperCase()} plan</div>
            </div>
          )}
          {!sidebarCollapsed && (
            <Link to="/login" aria-label="Log out" className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
