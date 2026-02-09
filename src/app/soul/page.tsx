'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowCounterClockwise } from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';

const DEFAULT_SOUL = `Be concise and direct. No corporate jargon. Write like a real person, not a PR agency.
Lead with value — why should they care about this story?
Keep emails under 200 words. Respect their time.
Warm but professional tone. No exclamation marks. No "I hope this email finds you well".
When referencing their work, be specific and genuine — don't be generic or sycophantic.
End with a clear, low-pressure ask (e.g. "would you be open to a quick look?" not "please let me know at your earliest convenience").
No buzzwords. No "revolutionary", "game-changing", "excited to share". Just say what it does.`;

export default function SoulPage() {
  const router = useRouter();
  const { setupComplete, emailSoul, setEmailSoul } = useStore();

  useEffect(() => {
    if (!setupComplete) router.push('/setup');
  }, [setupComplete, router]);

  if (!setupComplete) return null;

  const [draft, setDraft] = useState(emailSoul);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setEmailSoul(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setDraft(DEFAULT_SOUL);
    setEmailSoul(DEFAULT_SOUL);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Header */}
      <div className="animate-in section-bordered" style={{ marginBottom: 'var(--space-10)' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--accent)',
            marginBottom: 'var(--space-3)',
          }}
        >
          Voice & Style
        </div>
        <h1
          style={{
            fontSize: 'var(--fs-4xl)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
          }}
        >
          Soul
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--fs-sm)',
            marginTop: 'var(--space-2)',
            lineHeight: 1.6,
          }}
        >
          Define how the AI writes your emails. This style guide is included in every email draft — individual and publication pitches.
        </p>
      </div>

      {/* Editor */}
      <div className="card animate-in stagger-1" style={{ padding: 'var(--space-8)' }}>
        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-4)',
          }}
        >
          Email Soul
        </label>
        <textarea
          className="input"
          rows={12}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Describe the tone, style, and rules for how your outreach emails should be written..."
          style={{
            lineHeight: 1.7,
            fontSize: 'var(--fs-sm)',
            fontFamily: 'var(--font-mono)',
            resize: 'vertical',
          }}
        />
        <p
          style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--text-tertiary)',
            marginTop: 'var(--space-3)',
            lineHeight: 1.5,
          }}
        >
          Write in plain language. The AI will follow these instructions when drafting every outreach email.
        </p>
      </div>

      {/* Actions */}
      <div
        className="flex items-center justify-between animate-in stagger-2"
        style={{ marginTop: 'var(--space-6)' }}
      >
        <button className="btn-ghost" onClick={handleReset} style={{ fontSize: 'var(--fs-sm)' }}>
          <ArrowCounterClockwise size={14} /> Reset to Default
        </button>
        <button className="btn-primary" onClick={handleSave}>
          {saved ? (
            <><Check size={14} weight="bold" /> Saved</>
          ) : (
            'Save Soul'
          )}
        </button>
      </div>
    </div>
  );
}
