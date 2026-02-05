'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  if (isLanding) return <>{children}</>;

  return (
    <div className="grain-overlay" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <main
        style={{
          marginLeft: 'var(--sidebar-width)',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ padding: 'var(--space-8) var(--space-8)' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
