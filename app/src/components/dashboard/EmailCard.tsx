"use client";

import { useState } from "react";
import {
  Check,
  X,
  EnvelopeSimple,
  User,
  Buildings,
  CaretDown,
  CaretUp,
  PaperPlaneTilt,
  PencilSimple,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { OutreachEmail } from "@/lib/types";

const statusVariant: Record<string, "default" | "positive" | "negative" | "warning" | "info"> = {
  draft: "default",
  ready: "info",
  approved: "positive",
  rejected: "negative",
  sent: "positive",
  replied: "warning",
};

interface EmailCardProps {
  email: OutreachEmail;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function EmailCard({ email, onApprove, onReject }: EmailCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`
        bg-surface-raised rounded-xl border border-border
        transition-all duration-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-border-strong
        ${expanded ? "shadow-[0_2px_16px_rgba(0,0,0,0.05)]" : ""}
      `}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="w-10 h-10 rounded-lg bg-surface-overlay flex items-center justify-center shrink-0">
          {email.type === "individual" ? (
            <User size={18} className="text-ink-secondary" />
          ) : (
            <Buildings size={18} className="text-ink-secondary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[14px] font-semibold truncate">
              {email.recipientName}
            </p>
            <Badge variant={statusVariant[email.status]}>{email.status}</Badge>
          </div>
          <p className="text-[13px] text-ink-muted truncate">
            {email.outlet} &middot; {email.subject}
          </p>
        </div>

        {email.status === "ready" && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApprove(email.id);
              }}
              className="w-9 h-9 rounded-lg bg-positive-bg text-positive hover:bg-positive hover:text-white flex items-center justify-center transition-all duration-[100ms] cursor-pointer"
              title="Approve & send"
            >
              <Check size={18} weight="bold" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReject(email.id);
              }}
              className="w-9 h-9 rounded-lg bg-negative-bg text-negative hover:bg-negative hover:text-white flex items-center justify-center transition-all duration-[100ms] cursor-pointer"
              title="Reject"
            >
              <X size={18} weight="bold" />
            </button>
          </div>
        )}

        <button className="p-1 text-ink-muted cursor-pointer">
          {expanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
        </button>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="px-4 pb-4 animate-fade-in-up">
          <div className="border-t border-border pt-4 space-y-4">
            <div className="grid grid-cols-[80px_1fr] gap-y-2 text-[13px]">
              <span className="text-ink-muted font-medium">To:</span>
              <span className="text-ink">
                {email.recipientName} &lt;{email.recipientEmail}&gt;
              </span>
              <span className="text-ink-muted font-medium">Subject:</span>
              <span className="text-ink font-medium">{email.subject}</span>
              <span className="text-ink-muted font-medium">Type:</span>
              <span className="text-ink capitalize">{email.type} outreach</span>
            </div>

            <div className="bg-surface-overlay rounded-lg p-4">
              <p className="text-[13px] text-ink-secondary leading-relaxed whitespace-pre-wrap">
                {email.body}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {email.status === "ready" && (
                <>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onApprove(email.id)}
                  >
                    <PaperPlaneTilt size={14} weight="fill" />
                    Approve & Queue
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onReject(email.id)}
                  >
                    <X size={14} weight="bold" />
                    Reject
                  </Button>
                </>
              )}
              <Button size="sm" variant="ghost">
                <PencilSimple size={14} />
                Edit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
