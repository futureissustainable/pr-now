"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import {
  Plus,
  X,
  Play,
  Pause,
  Trash,
  CalendarDots,
  Lightning,
  EnvelopeSimple,
  PaperPlaneTilt,
  ChatCircleDots,
  Clock,
  Gear,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useStore } from "@/store/useStore";
import type { ScheduleFrequency } from "@/lib/types";

const frequencyLabels: Record<ScheduleFrequency, string> = {
  daily: "Daily",
  twice_daily: "Twice Daily",
  weekly: "Weekly",
  continuous: "Continuous",
};

export default function CampaignsPage() {
  const { campaigns, addCampaign, updateCampaign, removeCampaign, outlets } =
    useStore();
  const [showCreate, setShowCreate] = useState(false);

  // Create form
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<ScheduleFrequency>("daily");
  const [niches, setNiches] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    addCampaign({
      id: uuid(),
      name: name.trim(),
      frequency,
      targetNiches: niches
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean),
      targetOutlets: outlets.map((o) => o.id),
      isActive: true,
      emailsGenerated: 0,
      emailsSent: 0,
      emailsReplied: 0,
    });
    setName("");
    setNiches("");
    setShowCreate(false);
  };

  return (
    <div className="max-w-[1200px] space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-headline tracking-tight mb-1">
            Campaigns
          </h1>
          <p className="text-[14px] text-ink-muted">
            Manage automated outreach schedules and track their performance.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          New Campaign
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card padding="md" className="animate-fade-in-up border-ink">
          <h3 className="text-[16px] font-headline mb-4">New Campaign</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Input
              label="Campaign Name"
              placeholder="e.g., Q1 Tech Press Push"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Select
              label="Frequency"
              options={[
                { value: "daily", label: "Daily" },
                { value: "twice_daily", label: "Twice Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "continuous", label: "Continuous" },
              ]}
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as ScheduleFrequency)
              }
            />
            <Input
              label="Target Niches"
              placeholder="AI, SaaS, developer tools"
              hint="Comma-separated"
              value={niches}
              onChange={(e) => setNiches(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleCreate}>
              <Lightning size={14} weight="fill" />
              Create & Activate
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Campaign List */}
      <div className="space-y-3">
        {campaigns.map((campaign, idx) => (
          <Card
            key={campaign.id}
            padding="none"
            hover
            className={`animate-fade-in-up stagger-${Math.min(idx + 1, 8)}`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      campaign.isActive
                        ? "bg-positive animate-pulse"
                        : "bg-border-strong"
                    }`}
                  />
                  <div>
                    <h3 className="text-[16px] font-semibold">
                      {campaign.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant={campaign.isActive ? "positive" : "default"}
                      >
                        {campaign.isActive ? "Active" : "Paused"}
                      </Badge>
                      <span className="text-[12px] text-ink-muted">
                        {frequencyLabels[campaign.frequency]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      updateCampaign(campaign.id, {
                        isActive: !campaign.isActive,
                      })
                    }
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer
                      ${
                        campaign.isActive
                          ? "bg-surface-overlay text-ink-secondary hover:text-ink"
                          : "bg-positive-bg text-positive hover:bg-positive hover:text-white"
                      }
                    `}
                    title={campaign.isActive ? "Pause" : "Resume"}
                  >
                    {campaign.isActive ? (
                      <Pause size={14} weight="fill" />
                    ) : (
                      <Play size={14} weight="fill" />
                    )}
                  </button>
                  <button
                    onClick={() => removeCampaign(campaign.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-overlay text-ink-muted hover:bg-negative-bg hover:text-negative transition-colors cursor-pointer"
                    title="Delete campaign"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-overlay">
                  <EnvelopeSimple
                    size={16}
                    className="text-ink-muted"
                    weight="fill"
                  />
                  <div>
                    <p className="text-[18px] font-headline">
                      {campaign.emailsGenerated}
                    </p>
                    <p className="text-[11px] text-ink-muted uppercase tracking-wider">
                      Generated
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-overlay">
                  <PaperPlaneTilt
                    size={16}
                    className="text-positive"
                    weight="fill"
                  />
                  <div>
                    <p className="text-[18px] font-headline">
                      {campaign.emailsSent}
                    </p>
                    <p className="text-[11px] text-ink-muted uppercase tracking-wider">
                      Sent
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-overlay">
                  <ChatCircleDots
                    size={16}
                    className="text-info"
                    weight="fill"
                  />
                  <div>
                    <p className="text-[18px] font-headline">
                      {campaign.emailsReplied}
                    </p>
                    <p className="text-[11px] text-ink-muted uppercase tracking-wider">
                      Replied
                    </p>
                  </div>
                </div>
              </div>

              {/* Niches */}
              {campaign.targetNiches.length > 0 && (
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <span className="text-[12px] text-ink-muted">Niches:</span>
                  {campaign.targetNiches.map((niche) => (
                    <span
                      key={niche}
                      className="inline-flex h-6 items-center px-2.5 rounded-full bg-surface-overlay text-[12px] text-ink-secondary font-medium"
                    >
                      {niche}
                    </span>
                  ))}
                </div>
              )}

              {/* Schedule info */}
              {(campaign.lastRun || campaign.nextRun) && (
                <div className="flex items-center gap-4 mt-3 text-[12px] text-ink-muted">
                  {campaign.lastRun && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> Last run: {campaign.lastRun}
                    </span>
                  )}
                  {campaign.nextRun && (
                    <span className="flex items-center gap-1">
                      <CalendarDots size={12} /> Next: {campaign.nextRun}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}

        {campaigns.length === 0 && (
          <Card className="flex flex-col items-center py-16 text-center">
            <CalendarDots
              size={32}
              weight="light"
              className="text-ink-muted mb-3"
            />
            <h3 className="text-[16px] font-headline mb-1">No campaigns</h3>
            <p className="text-[14px] text-ink-muted max-w-[340px]">
              Create a campaign to automate outlet discovery and email
              generation on a schedule.
            </p>
            <Button className="mt-4" onClick={() => setShowCreate(true)}>
              <Plus size={16} />
              Create First Campaign
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
