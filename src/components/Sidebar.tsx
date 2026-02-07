'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House,
  GearSix,
  Newspaper,
  CalendarDots,
  EnvelopeSimple,
  List,
  CaretLeft,
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: House },
  { href: '/setup', label: 'Setup', icon: GearSix },
  { href: '/outlets', label: 'Outlets', icon: Newspaper },
  { href: '/campaigns', label: 'Campaigns', icon: CalendarDots },
  { href: '/outbox', label: 'Outbox', icon: EnvelopeSimple },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useStore();

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden btn-ghost"
        aria-label="Toggle sidebar"
      >
        <List size={20} weight="bold" />
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'var(--bg-overlay)' }}
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
          background: 'var(--bg-surface-raised)',
          borderRight: '1px solid var(--border-subtle)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between"
          style={{ padding: 'var(--space-6) var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <Link href="/dashboard" className="flex items-center gap-3 no-underline">
            <div
              style={{
                width: 30,
                height: 30,
                background: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', fontWeight: 800, color: 'var(--text-inverse)', lineHeight: 1 }}>P</span>
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 700,
                  fontSize: 'var(--fs-2xl)',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.03em',
                  display: 'block',
                  lineHeight: 1,
                }}
              >
                PR Now
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                media outreach
              </span>
            </div>
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
        <nav className="flex-1 flex flex-col" style={{ padding: 'var(--space-4) var(--space-3)', gap: 2 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--text-tertiary)',
              padding: 'var(--space-3) var(--space-3) var(--space-2)',
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
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--fs-sm)',
                  fontWeight: isActive ? 600 : 450,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-surface-hover)' : 'transparent',
                  transition: 'all 150ms var(--ease-standard)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-surface-hover)';
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
                <Icon size={17} weight={isActive ? 'fill' : 'regular'} />
                {item.label}
                {item.href === '/outbox' && <PendingBadge />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            v0.1.0 &middot; AI outreach
          </span>
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
      style={{
        marginLeft: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        fontWeight: 700,
        background: 'var(--accent)',
        color: 'var(--text-inverse)',
        padding: '1px 8px',
        borderRadius: 'var(--radius-full)',
        lineHeight: '16px',
      }}
    >
      {pending}
    </span>
  );
}
