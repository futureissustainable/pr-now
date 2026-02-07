'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Key,

  Trophy,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Robot,
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import type { AIProvider, AIAuthMethod } from '@/lib/types';

const steps = ['AI Provider', 'Project Details', 'Review'];

const providers: { id: AIProvider; name: string; desc: string; placeholder: string; supportsOAuth: boolean }[] = [
  { id: 'anthropic', name: 'Anthropic (Claude)', desc: 'Claude Opus 4.6, Sonnet 4, Haiku', placeholder: 'sk-ant-api03-...', supportsOAuth: false },
  { id: 'openai', name: 'OpenAI (GPT)', desc: 'GPT-4o, GPT-4, GPT-3.5', placeholder: 'sk-...', supportsOAuth: true },
  { id: 'google', name: 'Google (Gemini)', desc: 'Gemini 2.0, 1.5 Pro/Flash', placeholder: 'AIza...', supportsOAuth: true },
];

export default function SetupPage() {
  const router = useRouter();
  const { setAIConfig, setProjectProfile, completeSetup, aiConfig, projectProfile } = useStore();

  const [step, setStep] = useState(0);
  const [provider, setProvider] = useState<AIProvider>(aiConfig?.provider || 'anthropic');
  const [authMethod, setAuthMethod] = useState<AIAuthMethod>(aiConfig?.authMethod || 'apiKey');
  const [apiKey, setApiKey] = useState(aiConfig?.apiKey || '');
  const [name, setName] = useState(projectProfile?.name || '');
  const [tagline, setTagline] = useState(projectProfile?.tagline || '');
  const [brief, setBrief] = useState(projectProfile?.brief || '');
  const [achievements, setAchievements] = useState<string[]>(projectProfile?.achievements || ['']);
  const [website, setWebsite] = useState(projectProfile?.website || '');
  const [category, setCategory] = useState(projectProfile?.category || '');

  const canNext = () => {
    if (step === 0) return apiKey.length > 5;
    if (step === 1) return name && brief && achievements.some((a) => a.trim());
    return true;
  };

  const handleNext = () => {
    if (step === 0) {
      const effectiveAuthMethod = providers.find((p) => p.id === provider)?.supportsOAuth ? authMethod : 'apiKey';
      setAIConfig({ provider, apiKey, authMethod: effectiveAuthMethod });
    }
    if (step === 1) {
      setProjectProfile({
        name,
        tagline,
        brief,
        achievements: achievements.filter((a) => a.trim()),
        website,
        category,
      });
    }
    if (step === 2) {
      completeSetup();
      router.push('/dashboard');
      return;
    }
    setStep((s) => s + 1);
  };

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Header */}
      <div className="animate-in" style={{ marginBottom: 'var(--space-10)' }}>
        <span className="section-label" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>
          Configuration
        </span>
        <h1 style={{ fontSize: 'var(--fs-4xl)', fontWeight: 400, letterSpacing: '-0.03em', marginBottom: 'var(--space-2)' }}>
          Setup
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-md)', lineHeight: 1.6 }}>
          Configure your AI provider and project profile
        </p>
      </div>

      {/* Step indicator */}
      <div
        className="animate-in stagger-1"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-10)',
        }}
      >
        {steps.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--fs-xs)',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                background: i < step ? 'var(--accent)' : i === step ? 'var(--text-primary)' : 'transparent',
                color: i <= step ? 'var(--text-inverse)' : 'var(--text-tertiary)',
                border: i > step ? '1px solid var(--border-default)' : '1px solid transparent',
                transition: 'all var(--duration-fast) var(--ease-standard)',
              }}
            >
              {i < step ? <Check size={12} weight="bold" /> : i + 1}
            </div>
            <span
              style={{
                fontSize: 'var(--fs-sm)',
                color: i <= step ? 'var(--text-primary)' : 'var(--text-tertiary)',
                fontWeight: i === step ? 600 : 400,
                letterSpacing: '0.01em',
              }}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <div
                style={{
                  width: 32,
                  height: 1,
                  background: i < step ? 'var(--accent)' : 'var(--border-default)',
                  marginLeft: 'var(--space-2)',
                  marginRight: 'var(--space-2)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="card animate-in stagger-2" style={{ padding: 'var(--space-8)' }}>
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                Choose your AI provider
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>
                Your API key is stored locally and used to make AI calls for outlet discovery and email drafting.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-4) var(--space-5)',
                    borderRadius: 'var(--radius-sm)',
                    border: provider === p.id ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                    background: provider === p.id ? 'var(--accent-muted)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--duration-fast) var(--ease-standard)',
                  }}
                >
                  <Robot
                    size={20}
                    weight={provider === p.id ? 'fill' : 'regular'}
                    style={{ color: provider === p.id ? 'var(--accent)' : 'var(--text-tertiary)', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--fs-md)', color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>{p.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Auth method toggle -- only show for providers that support OAuth */}
            <div>
              {providers.find((p) => p.id === provider)?.supportsOAuth && (
                <>
                  <label
                    className="label-caps"
                    style={{ display: 'block', marginBottom: 'var(--space-3)' }}
                  >
                    Authentication Method
                  </label>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                    <button
                      onClick={() => { setAuthMethod('apiKey'); setApiKey(''); }}
                      style={{
                        flex: 1,
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-sm)',
                        border: authMethod === 'apiKey' ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                        background: authMethod === 'apiKey' ? 'var(--accent-muted)' : 'transparent',
                        color: authMethod === 'apiKey' ? 'var(--accent-text)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        transition: 'all var(--duration-fast) var(--ease-standard)',
                      }}
                    >
                      API Key
                    </button>
                    <button
                      onClick={() => { setAuthMethod('oauthToken'); setApiKey(''); }}
                      style={{
                        flex: 1,
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-sm)',
                        border: authMethod === 'oauthToken' ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                        background: authMethod === 'oauthToken' ? 'var(--accent-muted)' : 'transparent',
                        color: authMethod === 'oauthToken' ? 'var(--accent-text)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        transition: 'all var(--duration-fast) var(--ease-standard)',
                      }}
                    >
                      OAuth Token
                    </button>
                  </div>
                </>
              )}

              <label
                className="label-caps"
                style={{ display: 'block', marginBottom: 'var(--space-3)' }}
              >
                {!providers.find((p) => p.id === provider)?.supportsOAuth ? 'API Key' : authMethod === 'apiKey' ? 'API Key' : 'OAuth Bearer Token'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Key size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                <input
                  type="password"
                  className="input"
                  placeholder={!providers.find((p) => p.id === provider)?.supportsOAuth || authMethod === 'apiKey'
                    ? providers.find((p) => p.id === provider)?.placeholder
                    : 'Paste your OAuth access token...'
                  }
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-3)', lineHeight: 1.5 }}>
                Stored in your browser only. Never sent to our servers.
              </p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                Tell us about your project
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>
                The AI uses this to craft relevant pitches and find matching outlets.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
              <div>
                <label className="label-caps" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                  Project Name *
                </label>
                <input className="input" placeholder="e.g. PR Now" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="label-caps" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                  Category
                </label>
                <input className="input" placeholder="e.g. AI / SaaS / DevTools" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label-caps" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                Tagline
              </label>
              <input className="input" placeholder="One-line description" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>

            <div>
              <label className="label-caps" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                Project Brief *
              </label>
              <textarea
                className="input"
                rows={4}
                placeholder="Describe what your project does, who it's for, and why it matters..."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
              />
            </div>

            <div>
              <label className="label-caps" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                Website
              </label>
              <input className="input" placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <label className="label-caps" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                  <Trophy size={12} />
                  Key Achievements *
                </label>
                <button
                  className="btn-ghost"
                  onClick={() => setAchievements([...achievements, ''])}
                  style={{ fontSize: 'var(--fs-xs)' }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {achievements.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <input
                      className="input"
                      placeholder={`Achievement ${i + 1}, e.g. "500+ beta users in 2 months"`}
                      value={a}
                      onChange={(e) => {
                        const next = [...achievements];
                        next[i] = e.target.value;
                        setAchievements(next);
                      }}
                    />
                    {achievements.length > 1 && (
                      <button
                        className="btn-ghost"
                        onClick={() => setAchievements(achievements.filter((_, j) => j !== i))}
                        style={{ padding: 'var(--space-2)', color: 'var(--text-tertiary)' }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                Review & Launch
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>
                Confirm your configuration before proceeding.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="card-flat" style={{ padding: 'var(--space-5) var(--space-6)' }}>
                <span className="label-caps" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                  AI Provider
                </span>
                <div style={{ fontWeight: 600, fontSize: 'var(--fs-lg)' }}>
                  {providers.find((p) => p.id === provider)?.name}
                </div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
                  {authMethod === 'oauthToken' ? 'Token' : 'Key'}: {apiKey.slice(0, 8)}...{apiKey.slice(-4)}
                </div>
              </div>

              <div className="card-flat" style={{ padding: 'var(--space-5) var(--space-6)' }}>
                <span className="label-caps" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                  Project
                </span>
                <div style={{ fontWeight: 600, fontSize: 'var(--fs-lg)' }}>{name}</div>
                {tagline && (
                  <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
                    {tagline}
                  </div>
                )}
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-3)', lineHeight: 1.6 }}>
                  {brief.length > 200 ? brief.slice(0, 200) + '...' : brief}
                </div>
              </div>

              <div className="card-flat" style={{ padding: 'var(--space-5) var(--space-6)' }}>
                <span className="label-caps" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>
                  Achievements
                </span>
                <ul style={{ margin: 0, paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {achievements.filter((a) => a.trim()).map((a, i) => (
                    <li key={i} style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'var(--space-8)',
        }}
      >
        <button
          className="btn-secondary"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{ opacity: step === 0 ? 0.3 : 1 }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!canNext()}
          style={{ opacity: canNext() ? 1 : 0.4 }}
        >
          {step === 2 ? 'Launch Dashboard' : 'Continue'}
          <ArrowRight size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
}
