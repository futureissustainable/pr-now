'use client';

import { useState } from 'react';
import {
  Check,
  X,
  EnvelopeSimple,
  PaperPlaneTilt,
  Eye,

  CheckCircle,
  XCircle,
  Clock,
  Funnel,
  CheckSquare,
  User,
  Buildings,
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import type { OutreachEmail, OutreachStatus } from '@/lib/types';

type FilterStatus = 'all' | OutreachStatus;

export default function OutboxPage() {
  const {
    emails, campaigns,
    approveEmail, rejectEmail,
    bulkApproveEmails, bulkRejectEmails,
  } = useStore();

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('pending_approval');
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'publication'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = emails.filter((e) => {
    if (filterStatus !== 'all' && e.status !== filterStatus) return false;
    if (filterType !== 'all' && e.type !== filterType) return false;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((e) => e.id)));
    }
  };

  const handleBulkApprove = () => {
    bulkApproveEmails(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    bulkRejectEmails(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const statusCounts = {
    all: emails.length,
    pending_approval: emails.filter((e) => e.status === 'pending_approval').length,
    approved: emails.filter((e) => e.status === 'approved').length,
    rejected: emails.filter((e) => e.status === 'rejected').length,
    sent: emails.filter((e) => e.status === 'sent').length,
    replied: emails.filter((e) => e.status === 'replied').length,
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div
        className="flex items-start justify-between animate-in"
        style={{ marginBottom: 'var(--space-8)' }}
      >
        <div className="section-bordered">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fs-xs)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--accent)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Email Queue
          </div>
          <h1
            style={{
              fontSize: 'var(--fs-4xl)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
            }}
          >
            Outbox
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--fs-sm)',
              marginTop: 'var(--space-2)',
            }}
          >
            Review and approve emails before they send
          </p>
        </div>
        {selectedIds.size > 0 && (
          <div
            className="flex items-center animate-slide-right"
            style={{ gap: 'var(--space-3)' }}
          >
            <span
              style={{
                fontSize: 'var(--fs-sm)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {selectedIds.size} selected
            </span>
            <button
              className="btn-primary"
              onClick={handleBulkApprove}
              style={{
                background: 'var(--success)',
                borderColor: 'var(--success)',
                fontSize: 'var(--fs-sm)',
              }}
            >
              <Check size={14} weight="bold" /> Approve All
            </button>
            <button
              className="btn-secondary"
              onClick={handleBulkReject}
              style={{
                borderColor: 'var(--error)',
                color: 'var(--error)',
                fontSize: 'var(--fs-sm)',
              }}
            >
              <X size={14} weight="bold" /> Reject All
            </button>
          </div>
        )}
      </div>

      {/* Status filter tabs */}
      <div
        className="animate-in stagger-1"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-5)',
          flexWrap: 'wrap',
        }}
      >
        {([
          { id: 'pending_approval', label: 'Pending', icon: Clock, count: statusCounts.pending_approval },
          { id: 'approved', label: 'Approved', icon: CheckCircle, count: statusCounts.approved },
          { id: 'sent', label: 'Sent', icon: PaperPlaneTilt, count: statusCounts.sent },
          { id: 'rejected', label: 'Rejected', icon: XCircle, count: statusCounts.rejected },
          { id: 'all', label: 'All', icon: EnvelopeSimple, count: statusCounts.all },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            className={filterStatus === tab.id ? 'btn-primary' : 'btn-ghost'}
            onClick={() => setFilterStatus(tab.id)}
            style={{
              fontSize: 'var(--fs-sm)',
              padding: 'var(--space-2) var(--space-4)',
            }}
          >
            <tab.icon size={14} /> {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div
        className="flex items-center animate-in stagger-2"
        style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-8)' }}
      >
        <Funnel size={14} style={{ color: 'var(--text-tertiary)' }} />
        {(['all', 'individual', 'publication'] as const).map((t) => (
          <button
            key={t}
            className={filterType === t ? 'btn-secondary' : 'btn-ghost'}
            onClick={() => setFilterType(t)}
            style={{
              fontSize: 'var(--fs-xs)',
              padding: 'var(--space-1) var(--space-3)',
              textTransform: 'capitalize',
            }}
          >
            {t === 'individual' ? <><User size={12} /> Individual</> :
             t === 'publication' ? <><Buildings size={12} /> Publication</> :
             'All types'}
          </button>
        ))}
      </div>

      {/* Select all */}
      {filtered.length > 0 && (
        <div
          className="flex items-center animate-in stagger-2"
          style={{ marginBottom: 'var(--space-4)', gap: 'var(--space-3)' }}
        >
          <button
            className="btn-ghost"
            onClick={selectAll}
            style={{ fontSize: 'var(--fs-sm)' }}
          >
            <CheckSquare size={14} />
            {selectedIds.size === filtered.length ? 'Deselect all' : 'Select all'}
          </button>
          <span
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {filtered.length} email{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Email list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {filtered.length === 0 ? (
          <div
            className="card animate-in stagger-3"
            style={{
              padding: 'var(--space-16) var(--space-12)',
              textAlign: 'center',
            }}
          >
            <EnvelopeSimple
              size={48}
              weight="duotone"
              style={{
                color: 'var(--text-tertiary)',
                marginBottom: 'var(--space-4)',
              }}
            />
            <h3
              style={{
                fontSize: 'var(--fs-lg)',
                fontWeight: 600,
                marginBottom: 'var(--space-2)',
              }}
            >
              No emails here
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
              {filterStatus === 'pending_approval'
                ? 'All caught up! No emails pending your review.'
                : 'No emails match your current filters.'}
            </p>
          </div>
        ) : (
          filtered.map((email, i) => (
            <EmailCard
              key={email.id}
              email={email}
              index={i}
              isSelected={selectedIds.has(email.id)}
              isExpanded={expandedId === email.id}
              onToggleSelect={() => toggleSelect(email.id)}
              onToggleExpand={() => setExpandedId(expandedId === email.id ? null : email.id)}
              onApprove={() => approveEmail(email.id)}
              onReject={() => rejectEmail(email.id)}
              campaignName={campaigns.find((c) => c.id === email.campaignId)?.name}
            />
          ))
        )}
      </div>
    </div>
  );
}

function EmailCard({
  email,
  index,
  isSelected,
  isExpanded,
  onToggleSelect,
  onToggleExpand,
  onApprove,
  onReject,
  campaignName,
}: {
  email: OutreachEmail;
  index: number;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onApprove: () => void;
  onReject: () => void;
  campaignName?: string;
}) {
  const isPending = email.status === 'pending_approval';

  return (
    <div
      className="card animate-in"
      style={{
        animationDelay: `${index * 30}ms`,
        ...(isSelected ? { borderColor: 'var(--accent)' } : {}),
      }}
    >
      {/* Header row */}
      <div
        className="flex items-center"
        style={{
          padding: 'var(--space-5) var(--space-6)',
          gap: 'var(--space-4)',
          cursor: 'pointer',
        }}
        onClick={onToggleExpand}
      >
        {/* Checkbox */}
        <div
          onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
          style={{
            width: 18,
            height: 18,
            borderRadius: 3,
            border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border-default)'}`,
            background: isSelected ? 'var(--accent)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all var(--duration-instant) var(--ease-standard)',
          }}
        >
          {isSelected && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5L4 7L8 3" stroke="var(--text-inverse)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {/* Type badge */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-sm)',
            background: email.type === 'individual' ? 'var(--accent-muted)' : 'var(--info-muted)',
            flexShrink: 0,
          }}
        >
          {email.type === 'individual' ? (
            <User size={14} style={{ color: 'var(--accent)' }} />
          ) : (
            <Buildings size={14} style={{ color: 'var(--info)' }} />
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
            <span style={{ fontWeight: 600, fontSize: 'var(--fs-md)' }}>
              {email.contactName}
            </span>
            <span
              style={{
                color: 'var(--text-tertiary)',
                fontSize: 'var(--fs-xs)',
                userSelect: 'none',
              }}
            >
              &middot;
            </span>
            <span
              style={{
                color: 'var(--text-tertiary)',
                fontSize: 'var(--fs-xs)',
              }}
            >
              {email.outletName}
            </span>
          </div>
          <div
            style={{
              fontSize: 'var(--fs-sm)',
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: 2,
            }}
          >
            {email.subject}
          </div>
        </div>

        {/* Status + actions */}
        <div className="flex items-center" style={{ gap: 'var(--space-3)', flexShrink: 0 }}>
          {campaignName && (
            <span
              style={{
                fontSize: 'var(--fs-xs)',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {campaignName}
            </span>
          )}
          <StatusBadge status={email.status} />
          {isPending && (
            <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
              <button
                onClick={(e) => { e.stopPropagation(); onApprove(); }}
                title="Approve"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  background: 'transparent',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-standard)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--success)';
                  e.currentTarget.style.color = 'var(--text-inverse)';
                  e.currentTarget.style.borderColor = 'var(--success)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--success)';
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                }}
              >
                <Check size={16} weight="bold" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onReject(); }}
                title="Reject"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  background: 'transparent',
                  color: 'var(--error)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-standard)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--error)';
                  e.currentTarget.style.color = 'var(--text-inverse)';
                  e.currentTarget.style.borderColor = 'var(--error)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--error)';
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                }}
              >
                <X size={16} weight="bold" />
              </button>
            </div>
          )}
          <button className="btn-ghost" style={{ padding: 'var(--space-1)' }}>
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Expanded email body */}
      {isExpanded && (
        <div
          className="animate-fade"
          style={{
            padding: '0 var(--space-6) var(--space-6)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ paddingTop: 'var(--space-6)' }}>
            {/* Email metadata */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--fs-sm)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <span
                style={{
                  color: 'var(--text-tertiary)',
                  fontWeight: 500,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--fs-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                To
              </span>
              <span>{email.contactName} &lt;{email.contactEmail}&gt;</span>
              <span
                style={{
                  color: 'var(--text-tertiary)',
                  fontWeight: 500,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--fs-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Subject
              </span>
              <span style={{ fontWeight: 600 }}>{email.subject}</span>
              <span
                style={{
                  color: 'var(--text-tertiary)',
                  fontWeight: 500,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--fs-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Type
              </span>
              <span style={{ textTransform: 'capitalize' }}>{email.type} pitch</span>
              {email.sentAt && (
                <>
                  <span
                    style={{
                      color: 'var(--text-tertiary)',
                      fontWeight: 500,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--fs-xs)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Sent
                  </span>
                  <span>{new Date(email.sentAt).toLocaleString()}</span>
                </>
              )}
            </div>

            {/* Email body */}
            <div
              style={{
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                fontSize: 'var(--fs-sm)',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                color: 'var(--text-secondary)',
              }}
            >
              {email.body}
            </div>

            {/* Notes */}
            {email.notes && (
              <div
                style={{
                  marginTop: 'var(--space-4)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--warning-muted)',
                  border: '1px solid rgba(176, 125, 30, 0.15)',
                  fontSize: 'var(--fs-sm)',
                  color: 'var(--warning)',
                }}
              >
                Note: {email.notes}
              </div>
            )}

            {/* Approval actions (when expanded) */}
            {isPending && (
              <div
                className="flex items-center justify-end"
                style={{
                  gap: 'var(--space-3)',
                  marginTop: 'var(--space-6)',
                  paddingTop: 'var(--space-5)',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  className="btn-secondary"
                  onClick={onReject}
                  style={{
                    borderColor: 'var(--error)',
                    color: 'var(--error)',
                  }}
                >
                  <X size={14} weight="bold" /> Reject
                </button>
                <button
                  className="btn-primary"
                  onClick={onApprove}
                  style={{
                    background: 'var(--success)',
                    borderColor: 'var(--success)',
                  }}
                >
                  <Check size={14} weight="bold" /> Approve & Queue
                </button>
              </div>
            )}
          </div>
        </div>
      )}
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
      {status.replace('_', ' ')}
    </span>
  );
}
