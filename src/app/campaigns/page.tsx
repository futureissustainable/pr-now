'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Play,
  Pause,
  Lightning,
  CalendarDots,
  Clock,
  Repeat,
  ArrowsClockwise,
  Spinner,
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
  const router = useRouter();
  const {
    setupComplete, campaigns, outlets, contacts, emails, aiConfig, projectProfile,
    createCampaign, updateCampaignStatus, addEmail,
  } = useStore();

  useEffect(() => {
    if (!setupComplete) router.push('/setup');
  }, [setupComplete, router]);

  if (!setupComplete) return null;

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
      <div
        className="flex items-start justify-between animate-in"
        style={{ marginBottom: 'var(--space-10)' }}
      >
        <div className="section-bordered">
          <div className="section-label" style={{ marginBottom: 'var(--space-2)' }}>
            Scheduling
          </div>
          <h1 style={{ fontSize: 'var(--fs-4xl)', fontWeight: 400, letterSpacing: '-0.03em' }}>
            Campaigns
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--fs-md)',
            marginTop: 'var(--space-3)',
            lineHeight: 1.5,
          }}>
            Schedule and manage your outreach campaigns
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={14} weight="bold" /> New Campaign
        </button>
      </div>

      {/* Campaigns list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {campaigns.length === 0 ? (
          <div
            className="card animate-in stagger-1"
            style={{
              padding: 'var(--space-16) var(--space-8)',
              textAlign: 'center',
            }}
          >
            <CalendarDots
              size={40}
              weight="duotone"
              style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' }}
            />
            <h3 style={{
              fontSize: 'var(--fs-xl)',
              fontWeight: 400,
              marginBottom: 'var(--space-3)',
            }}>
              No campaigns yet
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--fs-sm)',
              maxWidth: 380,
              margin: '0 auto var(--space-6)',
              lineHeight: 1.6,
            }}>
              Create your first campaign to start generating AI-powered outreach emails.
            </p>
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={14} weight="bold" /> Create Campaign
            </button>
          </div>
        ) : (
          campaigns.map((campaign, i) => {
            const campaignEmails = emails.filter((e) => e.campaignId === campaign.id);
            const pending = campaignEmails.filter((e) => e.status === 'pending_approval').length;
            const approved = campaignEmails.filter((e) => e.status === 'approved').length;
            const sent = campaignEmails.filter((e) => e.status === 'sent').length;

            return (
              <div
                key={campaign.id}
                className="card animate-in"
                style={{
                  padding: 'var(--space-8)',
                  animationDelay: `${i * 50}ms`,
                }}
              >
                {/* Campaign header */}
                <div
                  className="flex items-start justify-between"
                  style={{ marginBottom: 'var(--space-6)' }}
                >
                  <div>
                    <div
                      className="flex items-center"
                      style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}
                    >
                      <h3 style={{
                        fontSize: 'var(--fs-xl)',
                        fontWeight: 400,
                        letterSpacing: '-0.01em',
                      }}>
                        {campaign.name}
                      </h3>
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
                    <div style={{
                      fontSize: 'var(--fs-sm)',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                    }}>
                      {frequencies.find((f) => f.id === campaign.frequency)?.label}
                      <span style={{ margin: '0 6px', color: 'var(--text-tertiary)' }}>&middot;</span>
                      {campaign.targetOutlets.length} outlets
                      <span style={{ margin: '0 6px', color: 'var(--text-tertiary)' }}>&middot;</span>
                      Created {new Date(campaign.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
                    {campaign.status === 'draft' && (
                      <button
                        className="btn-primary"
                        onClick={() => handleGenerate(campaign.id)}
                        disabled={generating === campaign.id}
                        style={{ fontSize: 'var(--fs-sm)' }}
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
                        style={{ fontSize: 'var(--fs-sm)' }}
                      >
                        <Pause size={14} /> Pause
                      </button>
                    )}
                    {campaign.status === 'paused' && (
                      <button
                        className="btn-secondary"
                        onClick={() => updateCampaignStatus(campaign.id, 'active')}
                        style={{ fontSize: 'var(--fs-sm)' }}
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
                    gap: 'var(--space-10)',
                    padding: 'var(--space-5) var(--space-6)',
                    borderRadius: 'var(--radius-sm)',
                    borderTop: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  {[
                    { label: 'Pending', count: pending, color: 'var(--warning)' },
                    { label: 'Approved', count: approved, color: 'var(--success)' },
                    { label: 'Sent', count: sent, color: 'var(--info)' },
                    { label: 'Total', count: campaignEmails.length, color: 'var(--text-primary)' },
                  ].map((s) => (
                    <div key={s.label} style={{ minWidth: 56 }}>
                      <div style={{
                        fontSize: 'var(--fs-3xl)',
                        fontWeight: 400,
                        fontFamily: 'var(--font-headline)',
                        color: s.color,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                      }}>
                        {s.count}
                      </div>
                      <div style={{
                        fontSize: 'var(--fs-xs)',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-tertiary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginTop: 'var(--space-1)',
                      }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Target niches */}
                {campaign.targetNiches.length > 0 && (
                  <div
                    className="flex items-center"
                    style={{
                      gap: 'var(--space-2)',
                      marginTop: 'var(--space-5)',
                      flexWrap: 'wrap',
                    }}
                  >
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
            className="card animate-scale"
            style={{
              padding: 'var(--space-10)',
              width: '100%',
              maxWidth: 560,
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <div className="section-label" style={{ marginBottom: 'var(--space-2)' }}>
                Create
              </div>
              <h2 style={{
                fontSize: 'var(--fs-3xl)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
              }}>
                New Campaign
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {/* Campaign name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--fs-xs)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--text-tertiary)',
                }}>
                  Campaign Name
                </label>
                <input
                  className="input"
                  placeholder="e.g. Launch Week Blitz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Frequency */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--fs-xs)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--text-tertiary)',
                }}>
                  Schedule
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: 'var(--space-2)',
                }}>
                  {frequencies.map((f) => {
                    const isSelected = frequency === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFrequency(f.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: 'var(--space-1)',
                          padding: 'var(--space-4)',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${isSelected ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                          background: isSelected ? 'var(--bg-surface)' : 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all var(--duration-fast) var(--ease-standard)',
                        }}
                      >
                        <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
                          <f.icon
                            size={13}
                            weight={isSelected ? 'bold' : 'regular'}
                            style={{
                              color: isSelected ? 'var(--text-primary)' : 'var(--text-tertiary)',
                            }}
                          />
                          <span style={{
                            fontWeight: 600,
                            fontSize: 'var(--fs-sm)',
                            color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                          }}>
                            {f.label}
                          </span>
                        </div>
                        <span style={{
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--text-tertiary)',
                          lineHeight: 1.4,
                        }}>
                          {f.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target outlets */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--fs-xs)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--text-tertiary)',
                }}>
                  Target Outlets ({selectedOutlets.length} selected)
                </label>
                <div style={{
                  maxHeight: 200,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-1)',
                }}>
                  {outlets.length === 0 ? (
                    <p style={{
                      fontSize: 'var(--fs-sm)',
                      color: 'var(--text-tertiary)',
                      padding: 'var(--space-4) 0',
                    }}>
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
                          padding: 'var(--space-3) var(--space-3)',
                          borderRadius: 'var(--radius-sm)',
                          background: selectedOutlets.includes(o.id) ? 'var(--bg-surface)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                          color: 'var(--text-primary)',
                          fontSize: 'var(--fs-sm)',
                          transition: 'background var(--duration-instant) var(--ease-standard)',
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 3,
                            border: `1.5px solid ${selectedOutlets.includes(o.id) ? 'var(--text-primary)' : 'var(--border-default)'}`,
                            background: selectedOutlets.includes(o.id) ? 'var(--text-primary)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all var(--duration-instant) var(--ease-standard)',
                          }}
                        >
                          {selectedOutlets.includes(o.id) && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5L4 7L8 3" stroke="var(--text-inverse)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span>{o.name}</span>
                        <span style={{
                          color: 'var(--text-tertiary)',
                          marginLeft: 'auto',
                          fontSize: 'var(--fs-xs)',
                          fontFamily: 'var(--font-mono)',
                        }}>
                          {o.niche}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Niches */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--fs-xs)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--text-tertiary)',
                }}>
                  Target Niches (comma-separated)
                </label>
                <input
                  className="input"
                  placeholder="e.g. AI, Developer Tools, SaaS"
                  value={niches}
                  onChange={(e) => setNiches(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div
                className="flex items-center justify-end"
                style={{
                  gap: 'var(--space-3)',
                  marginTop: 'var(--space-4)',
                  paddingTop: 'var(--space-5)',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <button className="btn-secondary" onClick={() => setShowCreate(false)}>
                  Cancel
                </button>
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
