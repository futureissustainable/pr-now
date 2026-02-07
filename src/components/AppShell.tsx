'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  if (isLanding) return <>{children}</>;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Sidebar />
      <main
        style={{
          marginLeft: 'var(--sidebar-width)',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        <div style={{ padding: 'var(--space-10) var(--space-10)' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
