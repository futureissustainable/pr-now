"use client";

import { useState, useMemo } from "react";
import {
  Lightning,
  Funnel,
  MagnifyingGlass,
  Sparkle,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmailCard } from "@/components/dashboard/EmailCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { useStore } from "@/store/useStore";
import type { OutreachStatus, DashboardStats } from "@/lib/types";

const filterTabs: { label: string; value: OutreachStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Ready", value: "ready" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Sent", value: "sent" },
  { label: "Replied", value: "replied" },
];

export default function DashboardPage() {
  const { emails, campaigns, updateEmailStatus, addEmails, aiConfig, projectBrief, outlets } = useStore();
  const [filter, setFilter] = useState<OutreachStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [generating, setGenerating] = useState(false);

  const filteredEmails = useMemo(() => {
    return emails.filter((e) => {
      if (filter !== "all" && e.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          e.recipientName.toLowerCase().includes(q) ||
          e.outlet.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [emails, filter, search]);

  const stats: DashboardStats = useMemo(
    () => ({
      totalEmails: emails.length,
      pendingApproval: emails.filter((e) => e.status === "ready").length,
      sent: emails.filter((e) => e.status === "sent" || e.status === "approved").length,
      replied: emails.filter((e) => e.status === "replied").length,
      activeCampaigns: campaigns.filter((c) => c.isActive).length,
    }),
    [emails, campaigns]
  );

  const handleApprove = (id: string) => {
    updateEmailStatus(id, "approved");
  };

  const handleReject = (id: string) => {
    updateEmailStatus(id, "rejected");
  };

  const handleGenerate = async () => {
    if (!aiConfig || !projectBrief) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiConfig,
          projectBrief,
          outlets: outlets.slice(0, 5),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.emails) {
          addEmails(data.emails);
        }
      }
    } catch {
      // Silently handle — user can retry
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-[1200px] space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-headline tracking-tight mb-1">
            Dashboard
          </h1>
          <p className="text-[14px] text-ink-muted">
            Review and approve AI-generated outreach emails before they&apos;re sent.
          </p>
        </div>
        <Button onClick={handleGenerate} loading={generating}>
          <Sparkle size={16} weight="fill" />
          {generating ? "Generating..." : "Generate Emails"}
        </Button>
      </div>

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Outreach Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-[20px] font-headline">Outreach Queue</h2>

          <div className="flex items-center gap-3">
            <div className="relative">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                type="text"
                placeholder="Search emails..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9 pr-3 rounded-lg border border-border bg-surface-raised text-[13px]
                  placeholder:text-ink-muted focus:outline-none focus:border-ink transition-colors w-[220px]"
              />
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-overlay rounded-lg w-fit">
          {filterTabs.map((tab) => {
            const count =
              tab.value === "all"
                ? emails.length
                : emails.filter((e) => e.status === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`
                  flex items-center gap-1.5 h-8 px-3 rounded-md text-[13px] font-medium
                  transition-all duration-[100ms] cursor-pointer
                  ${
                    filter === tab.value
                      ? "bg-surface-raised text-ink shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                      : "text-ink-muted hover:text-ink-secondary"
                  }
                `}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`
                    text-[11px] tabular-nums
                    ${filter === tab.value ? "text-ink-secondary" : "text-ink-muted"}
                  `}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Email list */}
        {filteredEmails.length > 0 ? (
          <div className="space-y-2">
            {filteredEmails.map((email, idx) => (
              <div
                key={email.id}
                className={`animate-fade-in-up stagger-${Math.min(idx + 1, 8)}`}
              >
                <EmailCard
                  email={email}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center py-16 text-center">
            {emails.length === 0 ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-surface-overlay flex items-center justify-center mb-4">
                  <Sparkle size={24} weight="light" className="text-ink-muted" />
                </div>
                <h3 className="text-[16px] font-headline mb-1">
                  No emails yet
                </h3>
                <p className="text-[14px] text-ink-muted max-w-[340px]">
                  Click &ldquo;Generate Emails&rdquo; to have AI craft personalized outreach for
                  your target outlets and contacts.
                </p>
                <Button
                  className="mt-5"
                  onClick={handleGenerate}
                  loading={generating}
                >
                  <Sparkle size={16} weight="fill" />
                  Generate First Batch
                </Button>
              </>
            ) : (
              <>
                <Funnel size={24} weight="light" className="text-ink-muted mb-3" />
                <p className="text-[14px] text-ink-muted">
                  No emails match your filter.
                </p>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
