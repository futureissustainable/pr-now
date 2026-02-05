"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import {
  Plus,
  X,
  MagnifyingGlass,
  Newspaper,
  User,
  Globe,
  Star,
  StarHalf,
  Lightning,
  Sparkle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { useStore } from "@/store/useStore";
import type { TargetOutlet, Contact } from "@/lib/types";

const priorityVariant: Record<string, "positive" | "warning" | "default"> = {
  high: "positive",
  medium: "warning",
  low: "default",
};

export default function OutletsPage() {
  const {
    outlets,
    contacts,
    addOutlet,
    removeOutlet,
    addContact,
    removeContact,
    aiConfig,
    projectBrief,
  } = useStore();

  const [tab, setTab] = useState<"outlets" | "contacts">("outlets");
  const [search, setSearch] = useState("");
  const [discovering, setDiscovering] = useState(false);

  // Add outlet form
  const [showAddOutlet, setShowAddOutlet] = useState(false);
  const [newOutlet, setNewOutlet] = useState({
    name: "",
    url: "",
    category: "Tech",
    priority: "high" as "high" | "medium" | "low",
  });

  // Add contact form
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    role: "",
    outlet: "",
    beat: "",
  });

  const filteredOutlets = outlets.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.outlet.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddOutlet = () => {
    if (!newOutlet.name.trim()) return;
    addOutlet({
      id: uuid(),
      name: newOutlet.name,
      url: newOutlet.url || undefined,
      category: newOutlet.category,
      priority: newOutlet.priority,
      isUserPicked: true,
    });
    setNewOutlet({ name: "", url: "", category: "Tech", priority: "high" });
    setShowAddOutlet(false);
  };

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.email.trim()) return;
    addContact({
      id: uuid(),
      name: newContact.name,
      email: newContact.email,
      role: newContact.role,
      outlet: newContact.outlet,
      beat: newContact.beat || undefined,
    });
    setNewContact({ name: "", email: "", role: "", outlet: "", beat: "" });
    setShowAddContact(false);
  };

  const handleDiscover = async () => {
    if (!aiConfig || !projectBrief) return;
    setDiscovering(true);
    try {
      const res = await fetch("/api/outlets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiConfig, projectBrief, existingOutlets: outlets }),
      });
      if (res.ok) {
        const data = await res.json();
        data.outlets?.forEach((o: TargetOutlet) => addOutlet(o));
        data.contacts?.forEach((c: Contact) => addContact(c));
      }
    } catch {
      // Silently handle
    } finally {
      setDiscovering(false);
    }
  };

  return (
    <div className="max-w-[1200px] space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-headline tracking-tight mb-1">
            Outlets & Contacts
          </h1>
          <p className="text-[14px] text-ink-muted">
            Manage target publications and journalist contacts.
          </p>
        </div>
        <Button onClick={handleDiscover} loading={discovering}>
          <Sparkle size={16} weight="fill" />
          {discovering ? "Discovering..." : "AI Discover"}
        </Button>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-surface-overlay rounded-lg">
          <button
            onClick={() => setTab("outlets")}
            className={`flex items-center gap-2 h-8 px-3 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
              tab === "outlets"
                ? "bg-surface-raised text-ink shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                : "text-ink-muted hover:text-ink-secondary"
            }`}
          >
            <Newspaper size={14} />
            Outlets
            <span className="text-[11px] tabular-nums text-ink-muted">
              {outlets.length}
            </span>
          </button>
          <button
            onClick={() => setTab("contacts")}
            className={`flex items-center gap-2 h-8 px-3 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
              tab === "contacts"
                ? "bg-surface-raised text-ink shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                : "text-ink-muted hover:text-ink-secondary"
            }`}
          >
            <User size={14} />
            Contacts
            <span className="text-[11px] tabular-nums text-ink-muted">
              {contacts.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="text"
              placeholder={tab === "outlets" ? "Search outlets..." : "Search contacts..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 pr-3 rounded-lg border border-border bg-surface-raised text-[13px]
                placeholder:text-ink-muted focus:outline-none focus:border-ink transition-colors w-[200px]"
            />
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              tab === "outlets"
                ? setShowAddOutlet(true)
                : setShowAddContact(true)
            }
          >
            <Plus size={14} />
            Add
          </Button>
        </div>
      </div>

      {/* Outlets Tab */}
      {tab === "outlets" && (
        <div className="space-y-2">
          {showAddOutlet && (
            <Card padding="md" className="animate-fade-in-up border-ink">
              <div className="flex items-start gap-4">
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Input
                    placeholder="Outlet name"
                    value={newOutlet.name}
                    onChange={(e) =>
                      setNewOutlet((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="URL (optional)"
                    value={newOutlet.url}
                    onChange={(e) =>
                      setNewOutlet((p) => ({ ...p, url: e.target.value }))
                    }
                  />
                  <Select
                    options={[
                      "Tech", "Business", "Startup", "Science", "Health",
                      "Finance", "AI/ML", "Crypto", "Design", "Gaming", "Media", "Other",
                    ].map((c) => ({ value: c, label: c }))}
                    value={newOutlet.category}
                    onChange={(e) =>
                      setNewOutlet((p) => ({ ...p, category: e.target.value }))
                    }
                  />
                  <Select
                    options={[
                      { value: "high", label: "High Priority" },
                      { value: "medium", label: "Medium" },
                      { value: "low", label: "Low" },
                    ]}
                    value={newOutlet.priority}
                    onChange={(e) =>
                      setNewOutlet((p) => ({
                        ...p,
                        priority: e.target.value as "high" | "medium" | "low",
                      }))
                    }
                  />
                </div>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <Button size="sm" onClick={handleAddOutlet}>
                    <Check size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAddOutlet(false)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {filteredOutlets.map((outlet, idx) => (
            <div
              key={outlet.id}
              className={`flex items-center gap-4 p-4 bg-surface-raised rounded-xl border border-border
                hover:border-border-strong transition-all animate-fade-in-up stagger-${Math.min(idx + 1, 8)}`}
            >
              <div className="w-10 h-10 rounded-lg bg-surface-overlay flex items-center justify-center shrink-0">
                <span className="text-[14px] font-bold text-ink-secondary">
                  {outlet.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold truncate">
                    {outlet.name}
                  </p>
                  {outlet.isUserPicked && (
                    <Star size={12} weight="fill" className="text-warning shrink-0" />
                  )}
                  {outlet.discovered && (
                    <Badge variant="info">discovered</Badge>
                  )}
                </div>
                <p className="text-[12px] text-ink-muted">
                  {outlet.category}
                  {outlet.url && ` · ${outlet.url}`}
                </p>
              </div>
              <Badge variant={priorityVariant[outlet.priority]}>
                {outlet.priority}
              </Badge>
              <button
                onClick={() => removeOutlet(outlet.id)}
                className="p-1.5 rounded-md text-ink-muted hover:text-negative hover:bg-surface-overlay transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {filteredOutlets.length === 0 && (
            <Card className="flex flex-col items-center py-12 text-center">
              <Globe size={32} weight="light" className="text-ink-muted mb-3" />
              <p className="text-[14px] text-ink-muted">
                {search ? "No outlets match your search." : "No outlets yet. Add some or let AI discover them."}
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Contacts Tab */}
      {tab === "contacts" && (
        <div className="space-y-2">
          {showAddContact && (
            <Card padding="md" className="animate-fade-in-up border-ink">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                <Input
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact((p) => ({ ...p, name: e.target.value }))
                  }
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact((p) => ({ ...p, email: e.target.value }))
                  }
                />
                <Input
                  placeholder="Role (e.g., Senior Reporter)"
                  value={newContact.role}
                  onChange={(e) =>
                    setNewContact((p) => ({ ...p, role: e.target.value }))
                  }
                />
                <Input
                  placeholder="Outlet"
                  value={newContact.outlet}
                  onChange={(e) =>
                    setNewContact((p) => ({ ...p, outlet: e.target.value }))
                  }
                />
                <Input
                  placeholder="Beat (optional)"
                  value={newContact.beat}
                  onChange={(e) =>
                    setNewContact((p) => ({ ...p, beat: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Button size="sm" onClick={handleAddContact}>
                  <Plus size={14} /> Add Contact
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAddContact(false)}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {filteredContacts.map((contact, idx) => (
            <div
              key={contact.id}
              className={`flex items-center gap-4 p-4 bg-surface-raised rounded-xl border border-border
                hover:border-border-strong transition-all animate-fade-in-up stagger-${Math.min(idx + 1, 8)}`}
            >
              <div className="w-10 h-10 rounded-full bg-surface-overlay flex items-center justify-center shrink-0">
                <span className="text-[13px] font-bold text-ink-secondary">
                  {contact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold truncate">
                  {contact.name}
                </p>
                <p className="text-[12px] text-ink-muted truncate">
                  {contact.role} at {contact.outlet}
                  {contact.beat && ` · ${contact.beat}`}
                </p>
              </div>
              <p className="text-[12px] text-ink-muted hidden sm:block">
                {contact.email}
              </p>
              <button
                onClick={() => removeContact(contact.id)}
                className="p-1.5 rounded-md text-ink-muted hover:text-negative hover:bg-surface-overlay transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {filteredContacts.length === 0 && (
            <Card className="flex flex-col items-center py-12 text-center">
              <User size={32} weight="light" className="text-ink-muted mb-3" />
              <p className="text-[14px] text-ink-muted">
                {search ? "No contacts match your search." : "No contacts yet. Add manually or let AI discover them."}
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function Check({ size, ...props }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
