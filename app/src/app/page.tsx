'use client';

import Link from 'next/link';
import {
  Robot,
  Lightning,
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
    <div className="grain-overlay" style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Gradient bg */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(232, 131, 74, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div
          className="container-page animate-in"
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: 800,
            padding: 'var(--space-8) var(--space-4)',
          }}
        >
          {/* Badge */}
          <div
            className="animate-in stagger-1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-muted)',
              color: 'var(--accent-text)',
              fontSize: 'var(--fs-p-sm)',
              fontWeight: 600,
              marginBottom: 'var(--space-8)',
            }}
          >
            <Lightning size={14} weight="fill" />
            AI-Powered PR Outreach
          </div>

          <h1
            className="animate-in stagger-2"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, var(--fs-h-xxl))',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: 'var(--space-6)',
            }}
          >
            Get press coverage
            <br />
            <span style={{ color: 'var(--accent)' }}>on autopilot</span>
          </h1>

          <p
            className="animate-in stagger-3"
            style={{
              fontSize: 'var(--fs-p-xl)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto var(--space-10)',
            }}
          >
            Connect your AI provider, describe your project, and let PR Now
            discover outlets, draft personalized pitches, and manage your entire
            outreach pipeline. You approve every email before it sends.
          </p>

          {/* CTA */}
          <div
            className="animate-in stagger-4"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/setup" className="btn-primary" style={{ padding: 'var(--space-4) var(--space-8)', fontSize: 'var(--fs-p-md)' }}>
              Get Started
              <ArrowRight size={16} weight="bold" />
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

        {/* Features grid */}
        <div
          className="container-page animate-in stagger-5"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-4)',
            maxWidth: 900,
            marginTop: 'var(--space-16)',
            paddingBottom: 'var(--space-16)',
          }}
        >
          {[
            { icon: MagnifyingGlass, title: 'Smart Discovery', desc: 'AI finds relevant outlets and niche publications matching your project' },
            { icon: EnvelopeSimple, title: 'Drafted Pitches', desc: 'Personalized emails for journalists and editorial teams, ready for your review' },
            { icon: CalendarDots, title: 'Scheduled Campaigns', desc: 'Run outreach daily, weekly, or continuously with smart scheduling' },
            { icon: CheckCircle, title: 'Approval Queue', desc: 'Review every email with a simple approve or reject before anything sends' },
          ].map((f) => (
            <div
              key={f.title}
              className="card"
              style={{
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              <f.icon size={24} weight="duotone" style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: 'var(--fs-p-lg)', fontWeight: 600 }}>{f.title}</h3>
              <p style={{ fontSize: 'var(--fs-p-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
