'use client';

import Link from 'next/link';
import {
  EnvelopeSimple,
  MagnifyingGlass,
  CheckCircle,
  ArrowRight,
  CalendarDots,
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';

export default function LandingPage() {
  const seedDemoData = useStore((s) => s.seedDemoData);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--linen)' }}>
      {/* ─── Navigation ─── */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-5) var(--space-8)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-headline)', fontSize: '15px', fontWeight: 800, color: 'var(--text-inverse)', lineHeight: 1 }}>P</span>
          </div>
          <span style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--fs-lg)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>PR Now</span>
        </div>
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <button
            onClick={() => {
              seedDemoData();
              window.location.href = '/dashboard';
            }}
            className="btn-ghost"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}
          >
            Demo
          </button>
          <Link href="/setup" className="btn-primary" style={{ fontSize: 'var(--fs-sm)' }}>
            Get Started <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)',
          padding: 'var(--space-20) var(--space-6)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 800 }}>
          {/* Overline */}
          <div
            className="animate-in stagger-1"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--accent)',
              marginBottom: 'var(--space-8)',
            }}
          >
            AI-Powered PR Outreach
          </div>

          {/* Main headline */}
          <h1
            className="animate-in stagger-2"
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(2.75rem, 6.5vw, var(--fs-7xl))',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              marginBottom: 'var(--space-10)',
              color: 'var(--text-primary)',
            }}
          >
            Get press
            <br />
            coverage,
            <br />
            <span style={{ color: 'var(--accent)' }}>on autopilot</span>
          </h1>

          {/* Accent bar */}
          <div className="accent-bar animate-in stagger-3" style={{ margin: '0 auto var(--space-8)' }} />

          {/* Subheadline */}
          <p
            className="animate-in stagger-3"
            style={{
              fontSize: 'var(--fs-lg)',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              maxWidth: 520,
              margin: '0 auto var(--space-12)',
              fontWeight: 400,
            }}
          >
            Connect your AI provider, describe your project, and let PR Now
            discover outlets, draft personalized pitches, and manage your entire
            outreach pipeline.
          </p>

          {/* CTAs */}
          <div
            className="animate-in stagger-4"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}
          >
            <Link href="/setup" className="btn-primary" style={{ padding: '12px var(--space-8)', fontSize: 'var(--fs-md)' }}>
              Start Outreach <ArrowRight size={15} weight="bold" />
            </Link>
            <button
              onClick={() => {
                seedDemoData();
                window.location.href = '/dashboard';
              }}
              className="btn-secondary"
              style={{ padding: '12px var(--space-8)', fontSize: 'var(--fs-md)' }}
            >
              View Demo
            </button>
          </div>
        </div>
      </div>

      {/* ─── Features Grid ─── */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-raised)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          {[
            { icon: MagnifyingGlass, title: 'Smart Discovery', desc: 'AI finds relevant outlets and niche publications' },
            { icon: EnvelopeSimple, title: 'Drafted Pitches', desc: 'Personalized emails for journalists and editorial teams' },
            { icon: CalendarDots, title: 'Scheduling', desc: 'Daily, weekly, or continuous outreach campaigns' },
            { icon: CheckCircle, title: 'Approval Queue', desc: 'Approve or reject every email with one click' },
          ].map((f, i) => (
            <div
              key={f.title}
              className="animate-in"
              style={{
                padding: 'var(--space-10) var(--space-8)',
                borderLeft: i > 0 ? '1px solid var(--border-subtle)' : 'none',
                animationDelay: `${400 + i * 80}ms`,
              }}
            >
              <f.icon size={22} weight="regular" style={{ color: 'var(--accent)', marginBottom: 'var(--space-5)' }} />
              <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--fs-md)', fontWeight: 700, marginBottom: 'var(--space-2)', letterSpacing: '-0.01em' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Powered by Claude, GPT, or Gemini &middot; Your API key stays in your browser
        </span>
      </div>
    </div>
  );
}
