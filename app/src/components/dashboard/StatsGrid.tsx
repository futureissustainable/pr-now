"use client";

import {
  EnvelopeSimple,
  Clock,
  PaperPlaneTilt,
  ChatCircleDots,
  Lightning,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui/Card";
import type { DashboardStats } from "@/lib/types";

const statConfig = [
  {
    key: "totalEmails" as const,
    label: "Total Emails",
    icon: EnvelopeSimple,
    color: "text-ink",
  },
  {
    key: "pendingApproval" as const,
    label: "Pending Approval",
    icon: Clock,
    color: "text-warning",
  },
  {
    key: "sent" as const,
    label: "Sent",
    icon: PaperPlaneTilt,
    color: "text-positive",
  },
  {
    key: "replied" as const,
    label: "Replied",
    icon: ChatCircleDots,
    color: "text-info",
  },
  {
    key: "activeCampaigns" as const,
    label: "Active Campaigns",
    icon: Lightning,
    color: "text-ink",
  },
];

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {statConfig.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.key}
            padding="sm"
            hover
            className={`animate-fade-in-up stagger-${idx + 1}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={16} className={stat.color} weight="fill" />
              <span className="text-[12px] text-ink-muted font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <p className="text-[28px] font-headline tracking-tight">
              {stats[stat.key]}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
