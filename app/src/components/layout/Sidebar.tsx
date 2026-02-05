"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Gear,
  Newspaper,
  CalendarDots,
  Megaphone,
  List,
  X,
} from "@phosphor-icons/react";
import { useStore } from "@/store/useStore";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: House },
  { href: "/outlets", label: "Outlets & Contacts", icon: Newspaper },
  { href: "/campaigns", label: "Campaigns", icon: CalendarDots },
  { href: "/setup", label: "Settings", icon: Gear },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-ink/20 backdrop-blur-[2px] z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[260px]
          bg-surface-raised border-r border-border
          flex flex-col
          transition-transform duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
              <Megaphone size={16} weight="fill" className="text-surface" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-ink">
              PR Now
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md hover:bg-surface-overlay transition-colors cursor-pointer"
          >
            <X size={18} className="text-ink-muted" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 h-10 px-3 rounded-lg
                  text-[14px] font-medium
                  transition-all duration-[100ms]
                  ${
                    isActive
                      ? "bg-ink text-surface-raised"
                      : "text-ink-secondary hover:text-ink hover:bg-surface-overlay"
                  }
                `}
              >
                <Icon size={18} weight={isActive ? "fill" : "regular"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border">
          <p className="text-[11px] text-ink-muted uppercase tracking-wider font-medium">
            AI-Powered PR Outreach
          </p>
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton() {
  const { setSidebarOpen } = useStore();
  return (
    <button
      onClick={() => setSidebarOpen(true)}
      className="lg:hidden p-2 rounded-lg hover:bg-surface-overlay transition-colors cursor-pointer"
    >
      <List size={20} className="text-ink" />
    </button>
  );
}
