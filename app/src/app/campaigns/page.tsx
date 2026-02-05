'use client';

import { useState } from 'react';
import {
  Plus,
  Play,
  Pause,
  Stop,
  Lightning,
  CalendarDots,
  Clock,
  Repeat,
  ArrowsClockwise,
  Spinner,
  EnvelopeSimple,
  Newspaper,
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { draftIndividualEmail, draftPublicationEmail } from '@/lib/ai';
import type { CampaignFrequency } from '@/lib/types';

const frequencies: { id: CampaignFrequency; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'once', label: 'One-time', desc: 'Run once and stop', icon: Lightning },
  { id: 'daily', label: 'Daily', desc: 'New outreach every day', icon: CalendarDots },
  { id: 'weekly', label: 'Weekly', desc: 'Once per week', icon: Clock },
  { id: 'biweekly', label: 'Bi-weekly', desc: 'Every two weeks', icon: Repeat },
  { id: 'continuous', label: 'Continuous', desc: 'Always running, finds new outlets', icon: ArrowsClockwise },
];

export default function CampaignsPage() {
  const {
    campaigns, outlets, contacts, aiConfig, projectProfile,
    createCampaign, updateCampaignStatus, addEmail,
  } = useStore();

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<CampaignFrequency>('daily');
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>([]);
  const [niches, setNiches] = useState('');
  const [generating, setGenerating] = useState<string | null>(null);

  const handleCreate = () => {
    if (!name.trim()) return;
    createCampaign({
      name,
      frequency,
      targetOutlets: selectedOutlets,
      targetNiches: niches.split(',').map((n) => n.trim()).filter(Boolean),
    });
    setName('');
    setFrequency('daily');
    setSelectedOutlets([]);
    setNiches('');
    setShowCreate(false);
  };

  const handleGenerate = async (campaignId: string) => {
    if (!aiConfig || !projectProfile) return;
    setGenerating(campaignId);

    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;

    try {
      // Draft individual emails for contacts at target outlets
      const targetContacts = contacts.filter((c) =>
        campaign.targetOutlets.includes(c.outletId)
      );

      for (const contact of targetContacts.slice(0, 5)) {
        const email = await draftIndividualEmail(aiConfig, projectProfile, contact, campaignId);
        addEmail(email);
      }

      // Draft publication-level emails
      const targetOutlets = outlets.filter((o) =>
        campaign.targetOutlets.includes(o.id)
      );

      for (const outlet of targetOutlets.slice(0, 3)) {
        const email = await draftPublicationEmail(aiConfig, projectProfile, outlet, campaignId);
        addEmail(email);
      }

      updateCampaignStatus(campaignId, 'active');
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setGenerating(null);
    }
  };

  const toggleOutlet = (id: string) => {
    setSelectedOutlets((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div className="flex items-start justify-between animate-in" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--fs-h-lg)', fontWeight: 700, letterSpacing: '-0.03em' }}>
            Campaigns
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
            Schedule and manage your outreach campaigns
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={14} weight="bold" /> New Campaign
        </button>
      </div>

      {/* Campaigns list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {campaigns.length === 0 ? (
          <div
            className="card animate-in stagger-1"
            style={{
              padding: 'var(--space-12)',
              textAlign: 'center',
            }}
          >
            <CalendarDots size={48} weight="duotone" style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }} />
            <h3 style={{ fontSize: 'var(--fs-p-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              No campaigns yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-p-sm)', maxWidth: 400, margin: '0 auto var(--space-5)' }}>
              Create your first campaign to start generating AI-powered outreach emails.
            </p>
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={14} weight="bold" /> Create Campaign
            </button>
          </div>
        ) : (
          campaigns.map((campaign, i) => {
            const campaignEmails = useStore.getState().emails.filter((e) => e.campaignId === campaign.id);
            const pending = campaignEmails.filter((e) => e.status === 'pending_approval').length;
            const approved = campaignEmails.filter((e) => e.status === 'approved').length;
            const sent = campaignEmails.filter((e) => e.status === 'sent').length;

            return (
              <div
                key={campaign.id}
                className="card animate-in"
                style={{ padding: 'var(--space-6)', animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start justify-between" style={{ marginBottom: 'var(--space-4)' }}>
                  <div>
                    <div className="flex items-center" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
                      <h3 style={{ fontSize: 'var(--fs-p-lg)', fontWeight: 600 }}>{campaign.name}</h3>
                      <span className={`status-dot ${
                        campaign.status === 'active' ? 'status-dot-active' :
                        campaign.status === 'paused' ? 'status-dot-pending' :
                        campaign.status === 'draft' ? 'status-dot-pending' :
                        ''
                      }`} />
                      <span className="badge badge-accent" style={{ textTransform: 'capitalize' }}>
                        {campaign.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--fs-p-sm)', color: 'var(--text-secondary)' }}>
                      {frequencies.find((f) => f.id === campaign.frequency)?.label} &middot;{' '}
                      {campaign.targetOutlets.length} outlets &middot;{' '}
                      Created {new Date(campaign.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
                    {campaign.status === 'draft' && (
                      <button
                        className="btn-primary"
                        onClick={() => handleGenerate(campaign.id)}
                        disabled={generating === campaign.id}
                        style={{ fontSize: 'var(--fs-p-sm)' }}
                      >
                        {generating === campaign.id ? (
                          <><Spinner size={14} className="animate-spin" /> Generating...</>
                        ) : (
                          <><Lightning size={14} weight="fill" /> Generate Emails</>
                        )}
                      </button>
                    )}
                    {campaign.status === 'active' && (
                      <button
                        className="btn-secondary"
                        onClick={() => updateCampaignStatus(campaign.id, 'paused')}
                        style={{ fontSize: 'var(--fs-p-sm)' }}
                      >
                        <Pause size={14} /> Pause
                      </button>
                    )}
                    {campaign.status === 'paused' && (
                      <button
                        className="btn-secondary"
                        onClick={() => updateCampaignStatus(campaign.id, 'active')}
                        style={{ fontSize: 'var(--fs-p-sm)' }}
                      >
                        <Play size={14} weight="fill" /> Resume
                      </button>
                    )}
                  </div>
                </div>

                {/* Stats row */}
                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-6)',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-raised)',
                  }}
                >
                  {[
                    { label: 'Pending', count: pending, color: 'var(--warning)' },
                    { label: 'Approved', count: approved, color: 'var(--success)' },
                    { label: 'Sent', count: sent, color: 'var(--info)' },
                    { label: 'Total', count: campaignEmails.length, color: 'var(--text-secondary)' },
                  ].map((s) => (
                    <div key={s.label}>
                      <div style={{ fontSize: 'var(--fs-h-sm)', fontWeight: 700, color: s.color }}>{s.count}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {campaign.targetNiches.length > 0 && (
                  <div className="flex items-center" style={{ gap: 'var(--space-2)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
                    {campaign.targetNiches.map((n) => (
                      <span key={n} className="badge badge-info">{n}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create campaign modal */}
      {showCreate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-overlay)',
          }}
          onClick={() => setShowCreate(false)}
        >
          <div
            className="card animate-in"
            style={{
              padding: 'var(--space-8)',
              width: '100%',
              maxWidth: 600,
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 'var(--fs-p-xl)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>
              New Campaign
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                  Campaign Name
                </label>
                <input className="input" placeholder="e.g. Launch Week Blitz" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              {/* Frequency */}
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>
                  Schedule
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--space-2)' }}>
                  {frequencies.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFrequency(f.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 'var(--space-1)',
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${frequency === f.id ? 'var(--accent)' : 'var(--border-default)'}`,
                        background: frequency === f.id ? 'var(--accent-muted)' : 'var(--bg-surface-raised)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all var(--duration-fast) var(--ease-standard)',
                      }}
                    >
                      <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
                        <f.icon size={14} weight={frequency === f.id ? 'fill' : 'regular'} style={{ color: frequency === f.id ? 'var(--accent)' : 'var(--text-tertiary)' }} />
                        <span style={{ fontWeight: 600, fontSize: 'var(--fs-p-sm)', color: 'var(--text-primary)' }}>{f.label}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target outlets */}
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>
                  Target Outlets ({selectedOutlets.length} selected)
                </label>
                <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  {outlets.length === 0 ? (
                    <p style={{ fontSize: 'var(--fs-p-sm)', color: 'var(--text-tertiary)' }}>
                      No outlets yet. Add some in the Outlets page first.
                    </p>
                  ) : (
                    outlets.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => toggleOutlet(o.id)}
                        className="flex items-center"
                        style={{
                          gap: 'var(--space-3)',
                          padding: 'var(--space-2) var(--space-3)',
                          borderRadius: 'var(--radius-sm)',
                          background: selectedOutlets.includes(o.id) ? 'var(--accent-muted)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                          color: 'var(--text-primary)',
                          fontSize: 'var(--fs-p-sm)',
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 4,
                            border: `1.5px solid ${selectedOutlets.includes(o.id) ? 'var(--accent)' : 'var(--border-default)'}`,
                            background: selectedOutlets.includes(o.id) ? 'var(--accent)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {selectedOutlets.includes(o.id) && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5L4 7L8 3" stroke="var(--text-inverse)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span>{o.name}</span>
                        <span style={{ color: 'var(--text-tertiary)', marginLeft: 'auto', fontSize: '11px' }}>{o.niche}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Niches */}
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                  Target Niches (comma-separated)
                </label>
                <input className="input" placeholder="e.g. AI, Developer Tools, SaaS" value={niches} onChange={(e) => setNiches(e.target.value)} />
              </div>

              <div className="flex items-center justify-end" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <button className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleCreate} disabled={!name.trim()}>
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
