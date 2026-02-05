"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AIConfig,
  ProjectBrief,
  TargetOutlet,
  Contact,
  OutreachEmail,
  Campaign,
  OutreachStatus,
} from "@/lib/types";

interface AppState {
  // AI Config
  aiConfig: AIConfig | null;
  setAIConfig: (config: AIConfig) => void;

  // Project Brief
  projectBrief: ProjectBrief | null;
  setProjectBrief: (brief: ProjectBrief) => void;

  // Setup completed
  setupComplete: boolean;
  setSetupComplete: (complete: boolean) => void;

  // Outlets
  outlets: TargetOutlet[];
  addOutlet: (outlet: TargetOutlet) => void;
  removeOutlet: (id: string) => void;
  setOutlets: (outlets: TargetOutlet[]) => void;

  // Contacts
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  removeContact: (id: string) => void;
  setContacts: (contacts: Contact[]) => void;

  // Outreach Emails
  emails: OutreachEmail[];
  addEmail: (email: OutreachEmail) => void;
  addEmails: (emails: OutreachEmail[]) => void;
  updateEmailStatus: (id: string, status: OutreachStatus) => void;
  removeEmail: (id: string) => void;

  // Campaigns
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  removeCampaign: (id: string) => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // AI Config
      aiConfig: null,
      setAIConfig: (config) => set({ aiConfig: config }),

      // Project Brief
      projectBrief: null,
      setProjectBrief: (brief) => set({ projectBrief: brief }),

      // Setup
      setupComplete: false,
      setSetupComplete: (complete) => set({ setupComplete: complete }),

      // Outlets
      outlets: [],
      addOutlet: (outlet) =>
        set((state) => ({ outlets: [...state.outlets, outlet] })),
      removeOutlet: (id) =>
        set((state) => ({ outlets: state.outlets.filter((o) => o.id !== id) })),
      setOutlets: (outlets) => set({ outlets }),

      // Contacts
      contacts: [],
      addContact: (contact) =>
        set((state) => ({ contacts: [...state.contacts, contact] })),
      removeContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        })),
      setContacts: (contacts) => set({ contacts }),

      // Outreach Emails
      emails: [],
      addEmail: (email) =>
        set((state) => ({ emails: [email, ...state.emails] })),
      addEmails: (newEmails) =>
        set((state) => ({ emails: [...newEmails, ...state.emails] })),
      updateEmailStatus: (id, status) =>
        set((state) => ({
          emails: state.emails.map((e) =>
            e.id === id ? { ...e, status } : e
          ),
        })),
      removeEmail: (id) =>
        set((state) => ({ emails: state.emails.filter((e) => e.id !== id) })),

      // Campaigns
      campaigns: [],
      addCampaign: (campaign) =>
        set((state) => ({ campaigns: [...state.campaigns, campaign] })),
      updateCampaign: (id, updates) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      removeCampaign: (id) =>
        set((state) => ({
          campaigns: state.campaigns.filter((c) => c.id !== id),
        })),

      // UI
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "pr-now-storage",
      partialize: (state) => ({
        aiConfig: state.aiConfig,
        projectBrief: state.projectBrief,
        setupComplete: state.setupComplete,
        outlets: state.outlets,
        contacts: state.contacts,
        emails: state.emails,
        campaigns: state.campaigns,
      }),
    }
  )
);
