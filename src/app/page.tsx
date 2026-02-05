'use client';

import Link from 'next/link';
import {
  EnvelopeSimple,
  MagnifyingGlass,
  CheckCircle,
  ArrowRight,
  CalendarDots,
  DotOutline,
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';

export default function LandingPage() {
  const seedDemoData = useStore((s) => s.seedDemoData);

  return (
    <div className="grain-overlay" style={{ minHeight: '100vh', background: 'var(--linen)' }}>
      {/* Top bar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-5) var(--space-8)',
          borderBottom: '2px solid var(--border-strong)',
          background: 'var(--bg-surface-raised)',
          position: 'relative',
          zIndex: 2,
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
            <span style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', color: 'var(--text-inverse)', lineHeight: 1 }}>P</span>
          </div>
          <span style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--fs-p-lg)', color: 'var(--text-primary)' }}>PR Now</span>
        </div>
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <button
            onClick={() => {
              seedDemoData();
              window.location.href = '/dashboard';
            }}
            className="btn-ghost"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}
          >
            Demo
          </button>
          <Link href="/setup" className="btn-primary" style={{ fontSize: 'var(--fs-p-sm)' }}>
            Get Started <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 160px)',
          padding: 'var(--space-16) var(--space-4)',
          overflow: 'hidden',
        }}
      >
        <div
          className="animate-in"
          style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 720 }}
        >
          {/* Mono label with accent underline */}
          <div
            className="animate-in stagger-1"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              marginBottom: 'var(--space-6)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <span style={{ width: 24, height: 2, background: 'var(--accent)' }} />
            AI-Powered PR Outreach
            <span style={{ width: 24, height: 2, background: 'var(--accent)' }} />
          </div>

          <h1
            className="animate-in stagger-2"
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.0,
              marginBottom: 'var(--space-8)',
              color: 'var(--text-primary)',
            }}
          >
            Get press<br />
            coverage,{' '}
            <em style={{
              fontStyle: 'italic',
              color: 'var(--accent)',
              textDecorationLine: 'underline',
              textDecorationStyle: 'wavy',
              textDecorationColor: 'rgba(156, 74, 46, 0.3)',
              textUnderlineOffset: '6px',
            }}>on autopilot</em>
          </h1>

          <div className="accent-bar animate-in stagger-3" style={{ margin: '0 auto var(--space-8)' }} />

          <p
            className="animate-in stagger-3"
            style={{
              fontSize: 'var(--fs-p-lg)',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              maxWidth: 520,
              margin: '0 auto var(--space-10)',
            }}
          >
            Connect your AI provider, describe your project, and let PR Now
            discover outlets, draft personalized pitches, and manage your entire
            outreach pipeline. You approve every email before it sends.
          </p>

          <div
            className="animate-in stagger-4"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}
          >
            <Link href="/setup" className="btn-primary" style={{ padding: 'var(--space-4) var(--space-8)', fontSize: 'var(--fs-p-md)' }}>
              Start Outreach <ArrowRight size={16} weight="bold" />
            </Link>
            <button
              onClick={() => {
                seedDemoData();
                window.location.href = '/dashboard';
              }}
              className="btn-secondary"
              style={{ padding: 'var(--space-4) var(--space-8)', fontSize: 'var(--fs-p-md)' }}
            >
              View Demo
            </button>
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div
        style={{
          borderTop: '2px solid var(--border-strong)',
          borderBottom: '2px solid var(--border-strong)',
          background: 'var(--bg-surface-raised)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            maxWidth: 1000,
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
                padding: 'var(--space-8) var(--space-6)',
                borderLeft: i > 0 ? '2px solid var(--border-strong)' : 'none',
                animationDelay: `${400 + i * 100}ms`,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-muted)',
                  border: '1.5px solid var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <f.icon size={20} weight="bold" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 style={{ fontSize: 'var(--fs-p-md)', fontWeight: 700, marginBottom: 'var(--space-2)', letterSpacing: '-0.01em' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 'var(--fs-p-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ padding: 'var(--space-6)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Built with Claude, GPT, or Gemini <DotOutline size={10} weight="fill" style={{ display: 'inline', verticalAlign: 'middle' }} /> Your API key stays local
        </span>
      </div>
    </div>
  );
}
