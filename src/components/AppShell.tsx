'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { useStore } from '@/store/useStore';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const isLanding = pathname === '/';

  if (isLanding) return <>{children}</>;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Sidebar />
      <main
        style={{
          marginLeft: sidebarOpen ? 'var(--sidebar-width)' : '0',
          minHeight: '100vh',
          position: 'relative',
          transition: 'margin-left 300ms ease',
        }}
      >
        <div style={{ padding: 'var(--space-10) var(--space-10)' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
