export type AIProvider = 'anthropic' | 'openai' | 'google';
export type AIAuthMethod = 'apiKey' | 'oauthToken';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  authMethod?: AIAuthMethod;
  model?: string;
  searchApiKey?: string;
}

export interface ProjectProfile {
  name: string;
  tagline: string;
  brief: string;
  achievements: string[];
  website?: string;
  category: string;
}

export interface Outlet {
  id: string;
  name: string;
  type: 'publication' | 'blog' | 'podcast' | 'newsletter' | 'youtube';
  niche: string;
  url?: string;
  audienceSize?: string;
  relevanceScore?: number;
  isUserPicked: boolean;
  isDiscovered: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  outlet: string;
  outletId: string;
  beat?: string;
  linkedIn?: string;
}

export type CampaignFrequency = 'once' | 'daily' | 'weekly' | 'biweekly' | 'continuous';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

export interface Campaign {
  id: string;
  name: string;
  frequency: CampaignFrequency;
  status: CampaignStatus;
  targetOutlets: string[];
  targetNiches: string[];
  createdAt: string;
  nextRunAt?: string;
  totalSent: number;
  totalApproved: number;
  totalPending: number;
}

export type OutreachStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'sent' | 'replied';
export type OutreachType = 'individual' | 'publication';

export interface OutreachEmail {
  id: string;
  campaignId: string;
  contactId?: string;
  contactName: string;
  contactEmail: string;
  outletName: string;
  type: OutreachType;
  subject: string;
  body: string;
  status: OutreachStatus;
  createdAt: string;
  approvedAt?: string;
  sentAt?: string;
  notes?: string;
}

export interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  emailsPending: number;
  emailsApproved: number;
  emailsSent: number;
  emailsReplied: number;
  outletsTargeted: number;
  contactsReached: number;
}
