import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type {
  AIConfig,
  ProjectProfile,
  Outlet,
  Contact,
  Campaign,
  OutreachEmail,
  CampaignFrequency,
  OutreachStatus,
} from '@/lib/types';

interface AppState {
  // Setup
  aiConfig: AIConfig | null;
  projectProfile: ProjectProfile | null;
  setupComplete: boolean;

  // Data
  outlets: Outlet[];
  contacts: Contact[];
  campaigns: Campaign[];
  emails: OutreachEmail[];

  // UI
  sidebarOpen: boolean;

  // Actions — Setup
  setAIConfig: (config: AIConfig) => void;
  setProjectProfile: (profile: ProjectProfile) => void;
  completeSetup: () => void;

  // Actions — Outlets
  addOutlet: (outlet: Omit<Outlet, 'id'>) => void;
  removeOutlet: (id: string) => void;
  addDiscoveredOutlets: (outlets: Omit<Outlet, 'id'>[]) => void;

  // Actions — Contacts
  addContact: (contact: Omit<Contact, 'id'>) => void;
  removeContact: (id: string) => void;

  // Actions — Campaigns
  createCampaign: (data: { name: string; frequency: CampaignFrequency; targetOutlets: string[]; targetNiches: string[] }) => string;
  updateCampaignStatus: (id: string, status: Campaign['status']) => void;

  // Actions — Emails
  addEmail: (email: Omit<OutreachEmail, 'id' | 'createdAt'>) => void;
  updateEmailStatus: (id: string, status: OutreachStatus) => void;
  approveEmail: (id: string) => void;
  rejectEmail: (id: string) => void;
  bulkApproveEmails: (ids: string[]) => void;
  bulkRejectEmails: (ids: string[]) => void;

  // Actions — UI
  toggleSidebar: () => void;

  // Seed demo data
  seedDemoData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      aiConfig: null,
      projectProfile: null,
      setupComplete: false,
      outlets: [],
      contacts: [],
      campaigns: [],
      emails: [],
      sidebarOpen: true,

      // Setup
      setAIConfig: (config) => set({ aiConfig: config }),
      setProjectProfile: (profile) => set({ projectProfile: profile }),
      completeSetup: () => set({ setupComplete: true }),

      // Outlets
      addOutlet: (outlet) =>
        set((s) => ({ outlets: [...s.outlets, { ...outlet, id: uuid() }] })),
      removeOutlet: (id) =>
        set((s) => ({ outlets: s.outlets.filter((o) => o.id !== id) })),
      addDiscoveredOutlets: (outlets) =>
        set((s) => ({
          outlets: [
            ...s.outlets,
            ...outlets.map((o) => ({ ...o, id: uuid() })),
          ],
        })),

      // Contacts
      addContact: (contact) =>
        set((s) => ({ contacts: [...s.contacts, { ...contact, id: uuid() }] })),
      removeContact: (id) =>
        set((s) => ({ contacts: s.contacts.filter((c) => c.id !== id) })),

      // Campaigns
      createCampaign: (data) => {
        const id = uuid();
        set((s) => ({
          campaigns: [
            ...s.campaigns,
            {
              ...data,
              id,
              status: 'draft',
              createdAt: new Date().toISOString(),
              totalSent: 0,
              totalApproved: 0,
              totalPending: 0,
            },
          ],
        }));
        return id;
      },
      updateCampaignStatus: (id, status) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, status } : c)),
        })),

      // Emails
      addEmail: (email) =>
        set((s) => ({
          emails: [
            ...s.emails,
            { ...email, id: uuid(), createdAt: new Date().toISOString() },
          ],
        })),
      updateEmailStatus: (id, status) =>
        set((s) => ({
          emails: s.emails.map((e) => (e.id === id ? { ...e, status } : e)),
        })),
      approveEmail: (id) =>
        set((s) => ({
          emails: s.emails.map((e) =>
            e.id === id
              ? { ...e, status: 'approved' as OutreachStatus, approvedAt: new Date().toISOString() }
              : e
          ),
        })),
      rejectEmail: (id) =>
        set((s) => ({
          emails: s.emails.map((e) =>
            e.id === id ? { ...e, status: 'rejected' as OutreachStatus } : e
          ),
        })),
      bulkApproveEmails: (ids) =>
        set((s) => ({
          emails: s.emails.map((e) =>
            ids.includes(e.id)
              ? { ...e, status: 'approved' as OutreachStatus, approvedAt: new Date().toISOString() }
              : e
          ),
        })),
      bulkRejectEmails: (ids) =>
        set((s) => ({
          emails: s.emails.map((e) =>
            ids.includes(e.id) ? { ...e, status: 'rejected' as OutreachStatus } : e
          ),
        })),

      // UI
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      // Demo data
      seedDemoData: () => {
        const outlets: Outlet[] = [
          { id: uuid(), name: 'TechCrunch', type: 'publication', niche: 'Tech Startups', url: 'https://techcrunch.com', audienceSize: '12M+', relevanceScore: 95, isUserPicked: true, isDiscovered: false },
          { id: uuid(), name: 'The Verge', type: 'publication', niche: 'Technology', url: 'https://theverge.com', audienceSize: '8M+', relevanceScore: 88, isUserPicked: true, isDiscovered: false },
          { id: uuid(), name: 'Hacker News', type: 'blog', niche: 'Developer Community', url: 'https://news.ycombinator.com', audienceSize: '5M+', relevanceScore: 92, isUserPicked: true, isDiscovered: false },
          { id: uuid(), name: 'Product Hunt Daily', type: 'newsletter', niche: 'Product Launches', url: 'https://producthunt.com', audienceSize: '1M+', relevanceScore: 90, isUserPicked: false, isDiscovered: true },
          { id: uuid(), name: 'IndieHackers', type: 'blog', niche: 'Bootstrapped Startups', url: 'https://indiehackers.com', audienceSize: '500K+', relevanceScore: 85, isUserPicked: false, isDiscovered: true },
          { id: uuid(), name: 'TLDR Newsletter', type: 'newsletter', niche: 'Tech News', audienceSize: '1.2M+', relevanceScore: 82, isUserPicked: false, isDiscovered: true },
          { id: uuid(), name: 'Lenny\'s Newsletter', type: 'newsletter', niche: 'Product Management', audienceSize: '600K+', relevanceScore: 78, isUserPicked: false, isDiscovered: true },
          { id: uuid(), name: 'The Pragmatic Engineer', type: 'newsletter', niche: 'Engineering', audienceSize: '400K+', relevanceScore: 75, isUserPicked: false, isDiscovered: true },
        ];

        const contacts: Contact[] = [
          { id: uuid(), name: 'Sarah Chen', email: 'sarah.c@techcrunch.example.com', role: 'Senior Reporter', outlet: 'TechCrunch', outletId: outlets[0].id, beat: 'AI & Machine Learning' },
          { id: uuid(), name: 'Mike Roberts', email: 'mike.r@theverge.example.com', role: 'Staff Writer', outlet: 'The Verge', outletId: outlets[1].id, beat: 'Developer Tools' },
          { id: uuid(), name: 'Emily Park', email: 'emily.p@producthunt.example.com', role: 'Curator', outlet: 'Product Hunt Daily', outletId: outlets[3].id, beat: 'Product Launches' },
          { id: uuid(), name: 'Alex Novak', email: 'alex@indiehackers.example.com', role: 'Community Editor', outlet: 'IndieHackers', outletId: outlets[4].id, beat: 'Bootstrapped Products' },
          { id: uuid(), name: 'Jordan Liu', email: 'jordan@tldr.example.com', role: 'Editor', outlet: 'TLDR Newsletter', outletId: outlets[5].id, beat: 'Daily Tech Roundup' },
        ];

        const campaignId = uuid();
        const campaigns: Campaign[] = [
          {
            id: campaignId,
            name: 'Launch Week Blitz',
            frequency: 'daily',
            status: 'active',
            targetOutlets: outlets.map((o) => o.id),
            targetNiches: ['Tech Startups', 'Developer Tools', 'AI'],
            createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
            nextRunAt: new Date(Date.now() + 86400000).toISOString(),
            totalSent: 3,
            totalApproved: 5,
            totalPending: 4,
          },
        ];

        const emails: OutreachEmail[] = [
          {
            id: uuid(), campaignId, contactId: contacts[0].id,
            contactName: 'Sarah Chen', contactEmail: 'sarah.c@techcrunch.example.com',
            outletName: 'TechCrunch', type: 'individual',
            subject: 'Exclusive: AI-powered PR automation tool launching next week',
            body: `Hi Sarah,\n\nI've been following your excellent coverage of AI tools reshaping traditional workflows. I'm reaching out because we've built something I think aligns perfectly with your beat.\n\nPR Now is an AI-powered platform that automates media outreach for startups and indie makers. Instead of hiring expensive PR firms, founders can:\n\n- Auto-discover relevant journalists and publications\n- Generate personalized pitch emails using AI\n- Schedule and manage outreach campaigns from a single dashboard\n\nWe're launching publicly next week and already have 200+ beta users. Would love to give you an early look or share some data on how AI is disrupting the PR industry.\n\nBest,\nThe PR Now Team`,
            status: 'pending_approval', createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: uuid(), campaignId, contactId: contacts[1].id,
            contactName: 'Mike Roberts', contactEmail: 'mike.r@theverge.example.com',
            outletName: 'The Verge', type: 'individual',
            subject: 'New developer tool: AI that writes your PR pitches',
            body: `Hey Mike,\n\nYour recent piece on developer tools entering the mainstream really resonated with our team. We're building PR Now — think of it as the developer-friendly approach to media relations.\n\nThe tool uses Claude/GPT/Gemini APIs to:\n- Research publications and find the right contacts\n- Draft personalized outreach emails\n- Manage approval workflows before anything gets sent\n\nIt's built for technical founders who'd rather ship code than write press releases. We're launching next week and I think it could make a compelling story about how AI is eating yet another professional services category.\n\nHappy to share a demo or connect you with some beta users.\n\nCheers`,
            status: 'pending_approval', createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: uuid(), campaignId, contactId: contacts[2].id,
            contactName: 'Emily Park', contactEmail: 'emily.p@producthunt.example.com',
            outletName: 'Product Hunt Daily', type: 'individual',
            subject: 'PR Now — AI-powered media outreach for indie makers',
            body: `Hi Emily,\n\nWe're preparing to launch PR Now on Product Hunt next Tuesday and wanted to give you a heads up since it fits squarely in the product launch space.\n\nPR Now lets makers and startup founders automate their media outreach using AI. You plug in your API key, describe your project, and the AI handles finding outlets, drafting pitches, and managing the send queue.\n\nWould love to be considered for the daily newsletter feature. Happy to share early access.\n\nBest`,
            status: 'approved', createdAt: new Date(Date.now() - 86400000).toISOString(), approvedAt: new Date(Date.now() - 82800000).toISOString(),
          },
          {
            id: uuid(), campaignId, contactId: contacts[3].id,
            contactName: 'Alex Novak', contactEmail: 'alex@indiehackers.example.com',
            outletName: 'IndieHackers', type: 'individual',
            subject: 'Bootstrapping an AI PR tool — our story and early traction',
            body: `Hey Alex,\n\nI've been an IndieHackers reader for years and your community spotlight series is always inspiring. Thought I'd reach out because we have a bootstrapping story that might resonate.\n\nWe built PR Now — an AI tool that automates media outreach — as a side project while working full-time. In 3 months of beta, we've helped 200+ founders get coverage in outlets they never thought they could reach.\n\nKey metrics:\n- $4K MRR, fully bootstrapped\n- 40% of pitches get responses (vs 5% industry average)\n- Built by a 2-person team\n\nWould make a great community post or interview. Let me know if you're interested.\n\nCheers`,
            status: 'sent', createdAt: new Date(Date.now() - 172800000).toISOString(), approvedAt: new Date(Date.now() - 170000000).toISOString(), sentAt: new Date(Date.now() - 169000000).toISOString(),
          },
          {
            id: uuid(), campaignId,
            contactName: 'Editorial Team', contactEmail: 'editorial@tldr.example.com',
            outletName: 'TLDR Newsletter', type: 'publication',
            subject: 'Story pitch: AI is coming for the PR industry',
            body: `Hi TLDR team,\n\nQuick pitch for your daily roundup: PR Now is a new AI tool that automates media outreach for startups. It uses LLMs to research journalists, draft personalized pitches, and manage approval workflows.\n\nThe angle: AI is now sophisticated enough to replace one of the most relationship-driven industries. Our beta data shows AI-drafted pitches get 8x more responses than generic templates.\n\nLaunching next week. Happy to provide more details or an exclusive stat.\n\nBest`,
            status: 'pending_approval', createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
          {
            id: uuid(), campaignId,
            contactName: 'Submissions', contactEmail: 'tips@theverge.example.com',
            outletName: 'The Verge', type: 'publication',
            subject: 'PR Now: AI tool that automates startup media outreach',
            body: `To the editorial team,\n\nWe'd like to share a story about PR Now, a new AI-powered platform for automated media outreach.\n\nThe platform connects to Claude, GPT, or Gemini APIs to research relevant publications, identify the right journalists, and draft personalized pitch emails — all managed through an approval dashboard where founders review every email before it's sent.\n\nWe believe this represents an interesting shift in how startups approach PR, moving from expensive agencies to AI-assisted self-service.\n\nWe're launching next week and would welcome the opportunity to discuss this further.\n\nRegards,\nPR Now Team`,
            status: 'rejected', createdAt: new Date(Date.now() - 259200000).toISOString(), notes: 'Too generic for publication-level pitch. Need more specific angle.',
          },
        ];

        set({
          outlets,
          contacts,
          campaigns,
          emails,
          setupComplete: true,
          aiConfig: { provider: 'anthropic', apiKey: 'sk-ant-demo-key-xxxxx', model: 'claude-sonnet-4-20250514' },
          projectProfile: {
            name: 'PR Now',
            tagline: 'AI-powered media outreach for startups',
            brief: 'PR Now is an AI-powered platform that automates media outreach for startups and indie makers. Users connect their preferred AI provider (Claude, GPT, or Gemini), describe their project, and let the AI handle discovering relevant outlets, finding journalist contacts, and drafting personalized pitch emails. Every email goes through a human approval workflow before sending.',
            achievements: [
              '200+ beta users in 3 months',
              '40% pitch response rate (8x industry average)',
              '$4K MRR, fully bootstrapped',
              'Featured in 3 major tech newsletters',
            ],
            website: 'https://prnow.example.com',
            category: 'AI / SaaS / Developer Tools',
          },
        });
      },
    }),
    {
      name: 'pr-now-storage',
    }
  )
);
