'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Newspaper,
  EnvelopeSimple,
  MagnifyingGlass,
  CheckCircle,
  CalendarDots,
  Lightning,
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
          padding: 'var(--space-4) var(--space-8)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(245, 235, 224, 0.85)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <span
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'var(--fs-2xl)',
              fontWeight: 400,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              fontStyle: 'italic',
            }}
          >
            PR Now
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
          <button
            onClick={() => {
              seedDemoData();
              window.location.href = '/dashboard';
            }}
            className="btn-ghost"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Demo
          </button>
          <Link
            href="/setup"
            className="btn-primary"
            style={{ fontSize: 'var(--fs-sm)' }}
          >
            Get Started <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </nav>

      {/* ─── Hero — Editorial Spread ─── */}
      <section
        className="landing-hero"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: 'calc(100vh - 60px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {/* Left — Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'var(--space-16) var(--space-12)',
            borderRight: '1px solid var(--border-subtle)',
          }}
        >
          <div
            className="animate-in stagger-1"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--accent)',
              marginBottom: 'var(--space-6)',
            }}
          >
            Issue No. 01 &mdash; Media Outreach
          </div>

          <h1
            className="animate-in stagger-2"
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(3rem, 5.5vw, 5.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              marginBottom: 'var(--space-10)',
              color: 'var(--text-primary)',
            }}
          >
            The press
            <br />
            coverage you
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>deserve.</em>
          </h1>

          <div
            className="animate-in stagger-3"
            style={{
              width: 48,
              height: 1,
              background: 'var(--text-primary)',
              marginBottom: 'var(--space-8)',
            }}
          />

          <p
            className="animate-in stagger-3"
            style={{
              fontSize: 'var(--fs-lg)',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              maxWidth: 440,
              marginBottom: 'var(--space-10)',
              fontWeight: 400,
            }}
          >
            Connect your AI, describe your story, and let PR Now discover the
            right outlets, draft personalized pitches, and manage your entire
            media outreach&mdash;on autopilot.
          </p>

          <div
            className="animate-in stagger-4"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/setup"
              className="btn-primary"
              style={{
                padding: '12px var(--space-8)',
                fontSize: 'var(--fs-md)',
              }}
            >
              Start Outreach <ArrowRight size={15} weight="bold" />
            </Link>
            <button
              onClick={() => {
                seedDemoData();
                window.location.href = '/dashboard';
              }}
              className="btn-secondary"
              style={{
                padding: '12px var(--space-8)',
                fontSize: 'var(--fs-md)',
              }}
            >
              View Demo
            </button>
          </div>
        </div>

        {/* Right — Editorial Visual Panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'var(--space-16) var(--space-12)',
            background: 'var(--parchment)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Large decorative serif number */}
          <div
            className="animate-fade"
            style={{
              position: 'absolute',
              top: -40,
              right: -20,
              fontFamily: 'var(--font-headline)',
              fontSize: '20rem',
              fontWeight: 400,
              color: 'rgba(156, 74, 46, 0.04)',
              lineHeight: 1,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            PR
          </div>

          {/* Stats / Proof Points */}
          <div className="animate-in stagger-3" style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--text-tertiary)',
                marginBottom: 'var(--space-8)',
              }}
            >
              How It Works
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-6)',
              }}
            >
              {[
                {
                  num: '01',
                  title: 'Connect',
                  desc: 'Add your Claude, GPT, or Gemini API key. Your key never leaves your browser.',
                },
                {
                  num: '02',
                  title: 'Describe',
                  desc: 'Tell PR Now about your project, audience, and story angle.',
                },
                {
                  num: '03',
                  title: 'Discover',
                  desc: 'AI scans and surfaces relevant outlets, journalists, and editorial contacts.',
                },
                {
                  num: '04',
                  title: 'Pitch',
                  desc: 'Review AI-drafted pitches, approve with one click, and track responses.',
                },
              ].map((step, i) => (
                <div
                  key={step.num}
                  className="animate-in"
                  style={{
                    display: 'flex',
                    gap: 'var(--space-5)',
                    alignItems: 'flex-start',
                    paddingBottom: 'var(--space-6)',
                    borderBottom:
                      i < 3 ? '1px solid var(--border-subtle)' : 'none',
                    animationDelay: `${300 + i * 100}ms`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: 'var(--fs-3xl)',
                      fontWeight: 400,
                      color: 'var(--accent)',
                      lineHeight: 1,
                      minWidth: 36,
                      fontStyle: 'italic',
                    }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: 'var(--fs-xl)',
                        fontWeight: 400,
                        color: 'var(--text-primary)',
                        marginBottom: 'var(--space-1)',
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--fs-sm)',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.65,
                      }}
                    >
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Editorial Divider — Marquee Strip ─── */}
      <div
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          padding: 'var(--space-4) 0',
          overflow: 'hidden',
          background: 'var(--bg-surface-raised)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-10)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--text-tertiary)',
          }}
        >
          <span>Claude Opus 4.6</span>
          <span style={{ color: 'var(--border-default)' }}>&bull;</span>
          <span>GPT-4o</span>
          <span style={{ color: 'var(--border-default)' }}>&bull;</span>
          <span>Gemini 2.0</span>
          <span style={{ color: 'var(--border-default)' }}>&bull;</span>
          <span>100% Client-Side</span>
          <span style={{ color: 'var(--border-default)' }}>&bull;</span>
          <span>Your Keys, Your Data</span>
        </div>
      </div>

      {/* ─── Features — Editorial Grid ─── */}
      <section
        style={{
          background: 'var(--bg-surface-raised)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {/* Section Header */}
        <div
          style={{
            padding: 'var(--space-16) var(--space-12) var(--space-10)',
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 'var(--space-8)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
          className="landing-features-header"
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--accent)',
                marginBottom: 'var(--space-4)',
              }}
            >
              Capabilities
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: 'var(--text-primary)',
              }}
            >
              Everything you need
              <br />
              <em style={{ fontStyle: 'italic' }}>to get covered.</em>
            </h2>
          </div>
          <p
            style={{
              fontSize: 'var(--fs-md)',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: 340,
              textAlign: 'right',
            }}
          >
            From outlet discovery to pitch delivery&mdash;one intelligent
            pipeline, zero manual busywork.
          </p>
        </div>

        {/* Feature Cards — 2x2 Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            maxWidth: 1200,
            margin: '0 auto',
          }}
          className="landing-features-grid"
        >
          {[
            {
              icon: MagnifyingGlass,
              title: 'Smart Discovery',
              desc: 'AI surfaces relevant outlets, niche publications, and journalist contacts based on your story angle and industry.',
              detail: 'Powered by web-aware LLMs',
            },
            {
              icon: EnvelopeSimple,
              title: 'Drafted Pitches',
              desc: 'Personalized, contextual emails crafted for each journalist. No templates, no mail merge&mdash;genuine outreach at scale.',
              detail: 'Tone-matched per outlet',
            },
            {
              icon: CalendarDots,
              title: 'Campaign Scheduling',
              desc: 'Set your cadence&mdash;daily, weekly, or continuous. PR Now queues and sends on your schedule.',
              detail: 'Flexible timing controls',
            },
            {
              icon: CheckCircle,
              title: 'Approval Queue',
              desc: 'Every email passes through your review. Approve, edit, or reject with a single click before anything sends.',
              detail: 'Human-in-the-loop always',
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="animate-in"
              style={{
                padding: 'var(--space-10) var(--space-10)',
                borderRight: i % 2 === 0 ? '1px solid var(--border-subtle)' : 'none',
                borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none',
                animationDelay: `${200 + i * 100}ms`,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <f.icon
                  size={24}
                  weight="regular"
                  style={{ color: 'var(--accent)' }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  {f.detail}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: 'var(--fs-2xl)',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 'var(--fs-sm)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  maxWidth: 400,
                }}
                dangerouslySetInnerHTML={{ __html: f.desc }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ─── Pull Quote / Statement ─── */}
      <section
        style={{
          padding: 'var(--space-24) var(--space-12)',
          textAlign: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--linen)',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.35,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: 'var(--space-8)',
            }}
          >
            &ldquo;Stop cold-emailing into the void. Let AI research every outlet,
            personalize every pitch, and put a human approval gate on every message.&rdquo;
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--text-tertiary)',
            }}
          >
            Built for Founders, Marketers &amp; PR Teams
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA — Magazine Spread ─── */}
      <section
        className="landing-cta-split"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--text-primary)',
        }}
      >
        <div
          style={{
            padding: 'var(--space-20) var(--space-12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: '1px solid rgba(245, 235, 224, 0.1)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.05,
              color: 'var(--text-inverse)',
              letterSpacing: '-0.03em',
              marginBottom: 'var(--space-6)',
            }}
          >
            Ready to get
            <br />
            <em style={{ fontStyle: 'italic' }}>published?</em>
          </h2>
          <p
            style={{
              fontSize: 'var(--fs-md)',
              color: 'rgba(245, 235, 224, 0.6)',
              lineHeight: 1.7,
              maxWidth: 380,
              marginBottom: 'var(--space-8)',
            }}
          >
            Set up in under two minutes. Bring your own API key&mdash;no
            subscriptions, no vendor lock-in.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Link
              href="/setup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '12px var(--space-8)',
                background: 'var(--accent)',
                color: 'var(--text-inverse)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-md)',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                transition: 'opacity 200ms',
              }}
            >
              Get Started <ArrowUpRight size={15} weight="bold" />
            </Link>
            <button
              onClick={() => {
                seedDemoData();
                window.location.href = '/dashboard';
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '12px var(--space-8)',
                background: 'transparent',
                color: 'rgba(245, 235, 224, 0.7)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-md)',
                fontWeight: 500,
                border: '1px solid rgba(245, 235, 224, 0.2)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 200ms',
              }}
            >
              Try the Demo
            </button>
          </div>
        </div>
        <div
          style={{
            padding: 'var(--space-20) var(--space-12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 'var(--space-6)',
          }}
        >
          {[
            { icon: Lightning, label: 'Setup in 2 minutes', sub: 'Paste your API key and go' },
            { icon: Newspaper, label: 'AI-powered research', sub: 'Discovers outlets you\'d never find manually' },
            { icon: EnvelopeSimple, label: 'Human-approved sending', sub: 'Nothing leaves without your explicit OK' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                alignItems: 'flex-start',
              }}
            >
              <item.icon
                size={20}
                weight="regular"
                style={{
                  color: 'var(--accent)',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: 'var(--fs-lg)',
                    fontWeight: 400,
                    color: 'var(--text-inverse)',
                    marginBottom: 2,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 'var(--fs-sm)',
                    color: 'rgba(245, 235, 224, 0.5)',
                    lineHeight: 1.5,
                  }}
                >
                  {item.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-6) var(--space-8)',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--linen)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'var(--fs-lg)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--text-tertiary)',
          }}
        >
          PR Now
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Powered by Claude, GPT, or Gemini &middot; Your API key stays in your browser
        </span>
      </footer>
    </div>
  );
}
