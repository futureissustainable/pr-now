'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  PaperPlaneTilt,
  Newspaper,
  Users,
  Clock,
  ArrowRight,
  Lightning,
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';

export default function DashboardPage() {
  const router = useRouter();
  const { setupComplete, campaigns, emails, outlets, contacts } = useStore();

  useEffect(() => {
    if (!setupComplete) router.push('/setup');
  }, [setupComplete, router]);

  if (!setupComplete) return null;

  const stats = {
    activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
    totalCampaigns: campaigns.length,
    emailsPending: emails.filter((e) => e.status === 'pending_approval').length,
    emailsApproved: emails.filter((e) => e.status === 'approved').length,
    emailsSent: emails.filter((e) => e.status === 'sent').length,
    emailsReplied: emails.filter((e) => e.status === 'replied').length,
    outletsTargeted: outlets.length,
    contactsReached: contacts.length,
  };

  const recentEmails = [...emails]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Page header */}
      <div className="animate-in section-bordered" style={{ marginBottom: 'var(--space-12)' }}>
        <div className="section-label" style={{ marginBottom: 'var(--space-3)' }}>
          Overview
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'var(--fs-4xl)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            marginTop: 'var(--space-3)',
            fontSize: 'var(--fs-lg)',
            lineHeight: 1.5,
          }}
        >
          Your outreach pipeline at a glance
        </p>
      </div>

      {/* Stats grid */}
      <div
        className="animate-in stagger-1"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-12)',
        }}
      >
        {[
          { label: 'Pending Review', value: stats.emailsPending, icon: Clock, color: 'var(--warning)', bg: 'var(--warning-muted)' },
          { label: 'Approved', value: stats.emailsApproved, icon: CheckCircle, color: 'var(--success)', bg: 'var(--success-muted)' },
          { label: 'Sent', value: stats.emailsSent, icon: PaperPlaneTilt, color: 'var(--info)', bg: 'var(--info-muted)' },
          { label: 'Outlets', value: stats.outletsTargeted, icon: Newspaper, color: 'var(--accent)', bg: 'var(--accent-muted)' },
          { label: 'Contacts', value: stats.contactsReached, icon: Users, color: 'var(--text-secondary)', bg: 'var(--bg-surface-hover)' },
          { label: 'Active Campaigns', value: stats.activeCampaigns, icon: Lightning, color: 'var(--accent)', bg: 'var(--accent-muted)' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{ padding: 'var(--space-6)' }}
          >
            <div
              className="flex items-center"
              style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  background: stat.bg,
                }}
              >
                <stat.icon size={16} weight="duotone" style={{ color: stat.color }} />
              </div>
              <span
                style={{
                  fontSize: 'var(--fs-sm)',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 'var(--fs-3xl)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-6)',
        }}
      >
        {/* Recent emails */}
        <div
          className="card animate-in stagger-2"
          style={{ padding: 'var(--space-8)' }}
        >
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 'var(--fs-xl)',
                fontWeight: 400,
              }}
            >
              Recent Emails
            </h2>
            <button
              onClick={() => router.push('/outbox')}
              className="btn-ghost"
              style={{ fontSize: 'var(--fs-sm)' }}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {recentEmails.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>
                No emails yet. Start a campaign to generate outreach.
              </p>
            ) : (
              recentEmails.map((email) => (
                <div
                  key={email.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'background var(--duration-instant) var(--ease-standard)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 'var(--fs-md)',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: 2,
                      }}
                    >
                      {email.contactName}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--fs-xs)',
                        color: 'var(--text-tertiary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {email.subject}
                    </div>
                  </div>
                  <StatusBadge status={email.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active campaigns */}
        <div
          className="card animate-in stagger-3"
          style={{ padding: 'var(--space-8)' }}
        >
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 'var(--fs-xl)',
                fontWeight: 400,
              }}
            >
              Campaigns
            </h2>
            <button
              onClick={() => router.push('/campaigns')}
              className="btn-ghost"
              style={{ fontSize: 'var(--fs-sm)' }}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {campaigns.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>
                No campaigns yet. Create your first one.
              </p>
            ) : (
              campaigns.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'background var(--duration-instant) var(--ease-standard)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ fontSize: 'var(--fs-md)', fontWeight: 500 }}>
                      {c.name}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--fs-xs)',
                        color: 'var(--text-tertiary)',
                        marginTop: 2,
                      }}
                    >
                      {c.frequency} &middot; {c.targetOutlets.length} outlets
                    </div>
                  </div>
                  <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
                    <span
                      className={`status-dot ${
                        c.status === 'active' ? 'status-dot-active' :
                        c.status === 'paused' ? 'status-dot-pending' :
                        'status-dot-error'
                      }`}
                    />
                    <span
                      style={{
                        fontSize: 'var(--fs-xs)',
                        color: 'var(--text-secondary)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending_approval: 'badge-warning',
    approved: 'badge-success',
    sent: 'badge-info',
    rejected: 'badge-error',
    replied: 'badge-accent',
    draft: 'badge-info',
  };
  return (
    <span className={`badge ${map[status] || 'badge-info'}`}>
      {status.replaceAll('_', ' ')}
    </span>
  );
}
