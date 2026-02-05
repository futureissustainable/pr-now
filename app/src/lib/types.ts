export type AIProvider = "claude" | "openai" | "gemini";

export type ScheduleFrequency = "daily" | "twice_daily" | "weekly" | "continuous";

export type OutreachStatus = "draft" | "ready" | "approved" | "rejected" | "sent" | "replied";

export type OutreachType = "individual" | "publication";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export interface ProjectBrief {
  name: string;
  tagline: string;
  description: string;
  achievements: string[];
  website?: string;
  founderName: string;
  founderEmail: string;
}

export interface TargetOutlet {
  id: string;
  name: string;
  url?: string;
  category: string;
  priority: "high" | "medium" | "low";
  isUserPicked: boolean;
  discovered?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  outlet: string;
  outletId?: string;
  beat?: string;
  linkedIn?: string;
}

export interface OutreachEmail {
  id: string;
  contactId?: string;
  outletId?: string;
  type: OutreachType;
  recipientName: string;
  recipientEmail: string;
  outlet: string;
  subject: string;
  body: string;
  status: OutreachStatus;
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  notes?: string;
}

export interface Campaign {
  id: string;
  name: string;
  frequency: ScheduleFrequency;
  targetNiches: string[];
  targetOutlets: string[];
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
  emailsGenerated: number;
  emailsSent: number;
  emailsReplied: number;
}

export interface DashboardStats {
  totalEmails: number;
  pendingApproval: number;
  sent: number;
  replied: number;
  activeCampaigns: number;
}
