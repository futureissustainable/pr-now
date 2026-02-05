'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House,
  GearSix,
  Newspaper,
  CalendarDots,
  EnvelopeSimple,
  ChartBar,
  Robot,
  List,
  CaretLeft,
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: House },
  { href: '/setup', label: 'Setup', icon: GearSix },
  { href: '/outlets', label: 'Outlets & Contacts', icon: Newspaper },
  { href: '/campaigns', label: 'Campaigns', icon: CalendarDots },
  { href: '/outbox', label: 'Outbox', icon: EnvelopeSimple },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useStore();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden btn-ghost"
        aria-label="Toggle sidebar"
      >
        <List size={20} weight="bold" />
      </button>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          width: 'var(--sidebar-width)',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between"
          style={{ padding: 'var(--space-6) var(--space-5)', marginBottom: 'var(--space-2)' }}
        >
          <Link href="/dashboard" className="flex items-center gap-2 no-underline">
            <div
              className="flex items-center justify-center"
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent)',
              }}
            >
              <Robot size={18} weight="bold" color="var(--text-inverse)" />
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: 'var(--fs-p-lg)',
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
              }}
            >
              PR Now
            </span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="btn-ghost lg:hidden"
            style={{ padding: 'var(--space-1)' }}
          >
            <CaretLeft size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col" style={{ padding: '0 var(--space-3)', gap: 'var(--space-1)' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-tertiary)',
              padding: 'var(--space-2) var(--space-3)',
              marginBottom: 'var(--space-1)',
            }}
          >
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className="flex items-center no-underline"
                style={{
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--fs-p-sm)',
                  fontWeight: isActive ? 600 : 450,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-surface-hover)' : 'transparent',
                  transition: 'all 150ms var(--ease-standard)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-surface-raised)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
                {item.label}
                {item.href === '/outbox' && (
                  <PendingBadge />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-5)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div
            className="flex items-center"
            style={{ gap: 'var(--space-3)' }}
          >
            <ChartBar size={16} style={{ color: 'var(--text-tertiary)' }} />
            <span style={{ fontSize: 'var(--fs-p-sm)', color: 'var(--text-tertiary)' }}>
              AI-Powered PR Outreach
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

function PendingBadge() {
  const emails = useStore((s) => s.emails);
  const pending = emails.filter((e) => e.status === 'pending_approval').length;
  if (pending === 0) return null;
  return (
    <span
      className="badge badge-accent"
      style={{ marginLeft: 'auto', fontSize: '10px', padding: '1px 6px' }}
    >
      {pending}
    </span>
  );
}
