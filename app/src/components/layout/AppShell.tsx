"use client";

import { Sidebar, MobileMenuButton } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center h-14 px-4 border-b border-border bg-surface-raised sticky top-0 z-30">
          <MobileMenuButton />
          <span className="ml-3 text-[14px] font-semibold text-ink">PR Now</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
