'use client';

import { useState } from 'react';
import {
  Plus,
  MagnifyingGlass,
  Trash,
  Lightning,
  Globe,
  Users,
  Newspaper,
  Microphone,
  YoutubeLogo,
  EnvelopeSimple,
  Spinner,
  Star,
  UserPlus,
  DotOutline,
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { discoverOutlets, findContacts } from '@/lib/ai';
import type { Outlet } from '@/lib/types';

const typeIcons: Record<string, React.ElementType> = {
  publication: Newspaper,
  blog: Globe,
  podcast: Microphone,
  newsletter: EnvelopeSimple,
  youtube: YoutubeLogo,
};

export default function OutletsPage() {
  const {
    outlets, contacts, aiConfig, projectProfile,
    addOutlet, removeOutlet, addDiscoveredOutlets,
    addContact, removeContact,
  } = useStore();

  const [discovering, setDiscovering] = useState(false);
  const [findingContacts, setFindingContacts] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOutlet, setNewOutlet] = useState({ name: '', type: 'publication' as Outlet['type'], niche: '', url: '' });
  const [filter, setFilter] = useState<'all' | 'picked' | 'discovered'>('all');

  const filtered = outlets.filter((o) => {
    if (filter === 'picked') return o.isUserPicked;
    if (filter === 'discovered') return o.isDiscovered;
    return true;
  });

  const handleDiscover = async () => {
    if (!aiConfig || !projectProfile) return;
    setDiscovering(true);
    try {
      const niches = [...new Set(outlets.map((o) => o.niche))];
      const existing = outlets.map((o) => o.name);
      const discovered = await discoverOutlets(aiConfig, projectProfile, niches, existing);
      addDiscoveredOutlets(discovered);
    } catch (err) {
      console.error('Discovery failed:', err);
    } finally {
      setDiscovering(false);
    }
  };

  const handleFindContacts = async (outlet: Outlet) => {
    if (!aiConfig || !projectProfile) return;
    setFindingContacts(outlet.id);
    try {
      const found = await findContacts(aiConfig, projectProfile, outlet);
      found.forEach((c) => addContact(c));
    } catch (err) {
      console.error('Contact search failed:', err);
    } finally {
      setFindingContacts(null);
    }
  };

  const handleAddOutlet = () => {
    if (!newOutlet.name.trim()) return;
    addOutlet({
      ...newOutlet,
      isUserPicked: true,
      isDiscovered: false,
      relevanceScore: 80,
    });
    setNewOutlet({ name: '', type: 'publication', niche: '', url: '' });
    setShowAddModal(false);
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div className="flex items-start justify-between animate-in" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="section-bordered">
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
            Media Database
          </div>
          <h1 style={{ fontSize: 'var(--fs-h-lg)', fontWeight: 700, letterSpacing: '-0.03em' }}>
            Outlets & Contacts
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
            {outlets.length} outlets <DotOutline size={10} weight="fill" style={{ display: 'inline', verticalAlign: 'middle' }} /> {contacts.length} contacts
          </p>
        </div>
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <button
            className="btn-secondary"
            onClick={handleDiscover}
            disabled={discovering || !aiConfig}
          >
            {discovering ? (
              <><Spinner size={14} className="animate-spin" /> Discovering...</>
            ) : (
              <><Lightning size={14} weight="fill" /> AI Discover</>
            )}
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={14} weight="bold" /> Add Outlet
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className="animate-in stagger-1"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {(['all', 'picked', 'discovered'] as const).map((f) => (
          <button
            key={f}
            className={filter === f ? 'btn-primary' : 'btn-ghost'}
            onClick={() => setFilter(f)}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--fs-p-sm)',
              textTransform: 'capitalize',
            }}
          >
            {f === 'all' ? `All (${outlets.length})` :
             f === 'picked' ? `Your picks (${outlets.filter(o => o.isUserPicked).length})` :
             `Discovered (${outlets.filter(o => o.isDiscovered).length})`}
          </button>
        ))}
      </div>

      {/* Outlets grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-10)',
        }}
      >
        {filtered.map((outlet, i) => {
          const Icon = typeIcons[outlet.type] || Globe;
          const outletContacts = contacts.filter((c) => c.outletId === outlet.id);

          return (
            <div
              key={outlet.id}
              className="card animate-in"
              style={{
                padding: 'var(--space-5)',
                animationDelay: `${i * 30}ms`,
              }}
            >
              <div className="flex items-start justify-between" style={{ marginBottom: 'var(--space-4)' }}>
                <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-md)',
                      background: outlet.isDiscovered ? 'var(--info-muted)' : 'var(--accent-muted)',
                    }}
                  >
                    <Icon size={18} weight="duotone" style={{ color: outlet.isDiscovered ? 'var(--info)' : 'var(--accent)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--fs-p-md)' }}>{outlet.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      {outlet.niche} <DotOutline size={10} weight="fill" style={{ display: 'inline', verticalAlign: 'middle' }} /> {outlet.type}
                    </div>
                  </div>
                </div>
                <button
                  className="btn-ghost"
                  onClick={() => removeOutlet(outlet.id)}
                  style={{ padding: 'var(--space-1)', color: 'var(--text-tertiary)' }}
                >
                  <Trash size={14} />
                </button>
              </div>

              <div className="flex items-center" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                {outlet.audienceSize && (
                  <div className="flex items-center" style={{ gap: 'var(--space-1)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Users size={12} /> {outlet.audienceSize}
                  </div>
                )}
                {outlet.relevanceScore !== undefined && (
                  <div className="flex items-center" style={{ gap: 'var(--space-1)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Star size={12} weight="fill" style={{ color: 'var(--warning)' }} /> {outlet.relevanceScore}%
                  </div>
                )}
                {outlet.isDiscovered && (
                  <span className="badge badge-info">AI Found</span>
                )}
              </div>

              {/* Contacts for this outlet */}
              {outletContacts.length > 0 && (
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
                    Contacts
                  </div>
                  {outletContacts.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between"
                      style={{
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface-raised)',
                        marginBottom: 'var(--space-1)',
                        fontSize: 'var(--fs-p-sm)',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 500 }}>{c.name}</span>
                        <span style={{ color: 'var(--text-tertiary)', marginLeft: 'var(--space-2)' }}>{c.role}</span>
                      </div>
                      <button
                        className="btn-ghost"
                        onClick={() => removeContact(c.id)}
                        style={{ padding: 2, color: 'var(--text-tertiary)' }}
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="btn-ghost"
                onClick={() => handleFindContacts(outlet)}
                disabled={findingContacts === outlet.id}
                style={{ width: '100%', justifyContent: 'center', fontSize: 'var(--fs-p-sm)' }}
              >
                {findingContacts === outlet.id ? (
                  <><Spinner size={14} className="animate-spin" /> Finding contacts...</>
                ) : (
                  <><UserPlus size={14} /> Find Contacts</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add outlet modal */}
      {showAddModal && (
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
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="card animate-in"
            style={{
              padding: 'var(--space-8)',
              width: '100%',
              maxWidth: 480,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 'var(--fs-p-xl)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>
              Add Outlet
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Name *</label>
                <input className="input" placeholder="e.g. TechCrunch" value={newOutlet.name} onChange={(e) => setNewOutlet({ ...newOutlet, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Type</label>
                  <select
                    className="input"
                    value={newOutlet.type}
                    onChange={(e) => setNewOutlet({ ...newOutlet, type: e.target.value as Outlet['type'] })}
                  >
                    <option value="publication">Publication</option>
                    <option value="blog">Blog</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="podcast">Podcast</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Niche</label>
                  <input className="input" placeholder="e.g. AI, Dev Tools" value={newOutlet.niche} onChange={(e) => setNewOutlet({ ...newOutlet, niche: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-p-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>URL</label>
                <input className="input" placeholder="https://..." value={newOutlet.url} onChange={(e) => setNewOutlet({ ...newOutlet, url: e.target.value })} />
              </div>
              <div className="flex items-center justify-end" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleAddOutlet}>Add Outlet</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
