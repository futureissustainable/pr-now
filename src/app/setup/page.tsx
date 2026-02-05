'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Key,
  Briefcase,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Robot,
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import type { AIProvider, AIAuthMethod, AIConfig, ProjectProfile } from '@/lib/types';

const steps = ['AI Provider', 'Project Details', 'Review'];

const providers: { id: AIProvider; name: string; desc: string; placeholder: string }[] = [
  { id: 'anthropic', name: 'Anthropic (Claude)', desc: 'Claude Sonnet, Opus, Haiku', placeholder: 'sk-ant-api03-...' },
  { id: 'openai', name: 'OpenAI (GPT)', desc: 'GPT-4o, GPT-4, GPT-3.5', placeholder: 'sk-...' },
  { id: 'google', name: 'Google (Gemini)', desc: 'Gemini 2.0, 1.5 Pro/Flash', placeholder: 'AIza...' },
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
      setAIConfig({ provider, apiKey, authMethod });
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
      <div className="animate-in section-bordered" style={{ marginBottom: 'var(--space-8)' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--accent)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Configuration
        </div>
        <h1 style={{ fontSize: 'var(--fs-h-lg)', fontWeight: 700, letterSpacing: '-0.03em' }}>
          Setup
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
          Configure your AI provider and project profile
        </p>
      </div>

      {/* Step indicator */}
      <div
        className="animate-in stagger-1"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-8)',
        }}
      >
        {steps.map((s, i) => (
          <div key={s} className="flex items-center" style={{ gap: 'var(--space-3)' }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 600,
                background: i <= step ? 'var(--accent)' : 'var(--bg-surface-raised)',
                color: i <= step ? 'var(--text-inverse)' : 'var(--text-tertiary)',
                transition: 'all var(--duration-fast) var(--ease-standard)',
              }}
            >
              {i < step ? <Check size={14} weight="bold" /> : i + 1}
            </div>
            <span
              style={{
                fontSize: 'var(--fs-p-sm)',
                color: i <= step ? 'var(--text-primary)' : 'var(--text-tertiary)',
                fontWeight: i === step ? 600 : 400,
              }}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: i < step ? 'var(--accent)' : 'var(--border-default)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="card animate-in stagger-2" style={{ padding: 'var(--space-8)' }}>
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--fs-p-xl)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                Choose your AI provider
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-p-sm)' }}>
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
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${provider === p.id ? 'var(--accent)' : 'var(--border-default)'}`,
                    background: provider === p.id ? 'var(--accent-muted)' : 'var(--bg-surface-raised)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--duration-fast) var(--ease-standard)',
                  }}
                >
                  <Robot size={22} weight={provider === p.id ? 'fill' : 'regular'} style={{ color: provider === p.id ? 'var(--accent)' : 'var(--text-tertiary)' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--fs-p-md)', color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: 'var(--fs-p-sm)', color: 'var(--text-secondary)' }}>{p.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Auth method toggle */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>
                Authentication Method
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <button
                  onClick={() => { setAuthMethod('apiKey'); setApiKey(''); }}
                  style={{
                    flex: 1,
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-sm)',
                    border: `1.5px solid ${authMethod === 'apiKey' ? 'var(--accent)' : 'var(--border-default)'}`,
                    background: authMethod === 'apiKey' ? 'var(--accent-muted)' : 'var(--bg-surface-raised)',
                    color: authMethod === 'apiKey' ? 'var(--accent-text)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
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
                    border: `1.5px solid ${authMethod === 'oauthToken' ? 'var(--accent)' : 'var(--border-default)'}`,
                    background: authMethod === 'oauthToken' ? 'var(--accent-muted)' : 'var(--bg-surface-raised)',
                    color: authMethod === 'oauthToken' ? 'var(--accent-text)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    transition: 'all var(--duration-fast) var(--ease-standard)',
                  }}
                >
                  OAuth Token
                </button>
              </div>

              <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                {authMethod === 'apiKey' ? 'API Key' : 'OAuth Bearer Token'}
              </label>
              <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
                <Key size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                <input
                  type="password"
                  className="input"
                  placeholder={authMethod === 'apiKey'
                    ? providers.find((p) => p.id === provider)?.placeholder
                    : 'Paste your OAuth access token...'
                  }
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: 'var(--space-2)' }}>
                {authMethod === 'apiKey'
                  ? 'Stored in your browser only. Never sent to our servers.'
                  : 'OAuth token from your provider\'s console or CLI. Stored locally in your browser.'
                }
              </p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--fs-p-xl)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                Tell us about your project
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-p-sm)' }}>
                The AI uses this to craft relevant pitches and find matching outlets.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                  Project Name *
                </label>
                <input className="input" placeholder="e.g. PR Now" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                  Category
                </label>
                <input className="input" placeholder="e.g. AI / SaaS / DevTools" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                Tagline
              </label>
              <input className="input" placeholder="One-line description" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
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
              <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                Website
              </label>
              <input className="input" placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>

            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-2)' }}>
                <label style={{ fontSize: 'var(--fs-p-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  <Trophy size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Key Achievements *
                </label>
                <button
                  className="btn-ghost"
                  onClick={() => setAchievements([...achievements, ''])}
                  style={{ fontSize: '12px' }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {achievements.map((a, i) => (
                  <div key={i} className="flex items-center" style={{ gap: 'var(--space-2)' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--fs-p-xl)', fontWeight: 600 }}>Review & Launch</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div
                style={{
                  padding: 'var(--space-4) var(--space-5)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
                  AI Provider
                </div>
                <div style={{ fontWeight: 600 }}>
                  {providers.find((p) => p.id === provider)?.name}
                </div>
                <div style={{ fontSize: 'var(--fs-p-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>
                  {authMethod === 'oauthToken' ? 'Token' : 'Key'}: {apiKey.slice(0, 8)}...{apiKey.slice(-4)}
                </div>
              </div>

              <div
                style={{
                  padding: 'var(--space-4) var(--space-5)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
                  Project
                </div>
                <div style={{ fontWeight: 600 }}>{name}</div>
                {tagline && <div style={{ fontSize: 'var(--fs-p-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>{tagline}</div>}
                <div style={{ fontSize: 'var(--fs-p-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-2)', lineHeight: 1.6 }}>
                  {brief.length > 200 ? brief.slice(0, 200) + '...' : brief}
                </div>
              </div>

              <div
                style={{
                  padding: 'var(--space-4) var(--space-5)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
                  Achievements
                </div>
                <ul style={{ margin: 0, paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  {achievements.filter((a) => a.trim()).map((a, i) => (
                    <li key={i} style={{ fontSize: 'var(--fs-p-sm)', color: 'var(--text-secondary)' }}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div
        className="flex items-center justify-between"
        style={{ marginTop: 'var(--space-6)' }}
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
