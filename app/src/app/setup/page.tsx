"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import {
  Key,
  Megaphone,
  Target,
  CalendarDots,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Robot,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import type {
  AIProvider,
  ScheduleFrequency,
  TargetOutlet,
} from "@/lib/types";

const steps = [
  { id: "ai", label: "AI Provider", icon: Key },
  { id: "brief", label: "Your Project", icon: Megaphone },
  { id: "outlets", label: "Target Outlets", icon: Target },
  { id: "schedule", label: "Schedule", icon: CalendarDots },
];

const providerOptions = [
  {
    value: "claude",
    label: "Claude (Anthropic)",
    description: "Best for nuanced, long-form outreach",
  },
  {
    value: "openai",
    label: "GPT (OpenAI)",
    description: "Versatile, widely used",
  },
  {
    value: "gemini",
    label: "Gemini (Google)",
    description: "Strong research capabilities",
  },
];

const frequencyOptions = [
  { value: "daily", label: "Daily — one batch per day" },
  { value: "twice_daily", label: "Twice daily — morning & evening" },
  { value: "weekly", label: "Weekly — one batch per week" },
  { value: "continuous", label: "Continuous — always searching & drafting" },
];

const outletCategories = [
  "Tech",
  "Business",
  "Startup",
  "Science",
  "Health",
  "Finance",
  "AI/ML",
  "Crypto",
  "Design",
  "Gaming",
  "Media",
  "Other",
];

export default function SetupPage() {
  const router = useRouter();
  const {
    setAIConfig,
    setProjectBrief,
    setOutlets,
    addCampaign,
    setSetupComplete,
    setupComplete,
  } = useStore();

  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: AI Config
  const [provider, setProvider] = useState<AIProvider>("claude");
  const [apiKey, setApiKey] = useState("");

  // Step 2: Project Brief
  const [projectName, setProjectName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [achievements, setAchievements] = useState<string[]>([""]);
  const [website, setWebsite] = useState("");
  const [founderName, setFounderName] = useState("");
  const [founderEmail, setFounderEmail] = useState("");

  // Step 3: Outlets
  const [targetOutlets, setTargetOutlets] = useState<TargetOutlet[]>([]);
  const [newOutletName, setNewOutletName] = useState("");
  const [newOutletCategory, setNewOutletCategory] = useState("Tech");

  // Step 4: Schedule
  const [frequency, setFrequency] = useState<ScheduleFrequency>("daily");
  const [niches, setNiches] = useState<string[]>([""]);

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return apiKey.length > 10;
      case 1:
        return projectName && description && founderName && founderEmail;
      case 2:
        return targetOutlets.length > 0;
      case 3:
        return niches.filter((n) => n.trim()).length > 0;
      default:
        return false;
    }
  };

  const handleAddOutlet = () => {
    if (!newOutletName.trim()) return;
    setTargetOutlets((prev) => [
      ...prev,
      {
        id: uuid(),
        name: newOutletName.trim(),
        category: newOutletCategory,
        priority: "high",
        isUserPicked: true,
      },
    ]);
    setNewOutletName("");
  };

  const handleRemoveOutlet = (id: string) => {
    setTargetOutlets((prev) => prev.filter((o) => o.id !== id));
  };

  const handleFinish = () => {
    setAIConfig({ provider, apiKey });
    setProjectBrief({
      name: projectName,
      tagline,
      description,
      achievements: achievements.filter((a) => a.trim()),
      website,
      founderName,
      founderEmail,
    });
    setOutlets(targetOutlets);
    addCampaign({
      id: uuid(),
      name: "Initial Campaign",
      frequency,
      targetNiches: niches.filter((n) => n.trim()),
      targetOutlets: targetOutlets.map((o) => o.id),
      isActive: true,
      emailsGenerated: 0,
      emailsSent: 0,
      emailsReplied: 0,
    });
    setSetupComplete(true);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left: Steps indicator */}
      <div className="hidden md:flex w-[300px] bg-surface-raised border-r border-border flex-col justify-between p-8">
        <div>
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center">
              <Megaphone size={16} weight="fill" className="text-surface" />
            </div>
            <span className="text-[16px] font-semibold tracking-tight">
              PR Now
            </span>
          </div>

          <nav className="space-y-1">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStep;
              const isDone = idx < currentStep;
              return (
                <button
                  key={step.id}
                  onClick={() => idx < currentStep && setCurrentStep(idx)}
                  className={`
                    w-full flex items-center gap-3 h-11 px-3 rounded-lg text-left
                    text-[14px] font-medium transition-all duration-[200ms] cursor-pointer
                    ${
                      isActive
                        ? "bg-ink text-surface-raised"
                        : isDone
                          ? "text-ink hover:bg-surface-overlay"
                          : "text-ink-muted"
                    }
                  `}
                >
                  <div
                    className={`
                    w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold
                    ${
                      isActive
                        ? "bg-surface-raised/20 text-surface-raised"
                        : isDone
                          ? "bg-positive-bg text-positive"
                          : "bg-surface-overlay text-ink-muted"
                    }
                  `}
                  >
                    {isDone ? <Check size={12} weight="bold" /> : idx + 1}
                  </div>
                  {step.label}
                </button>
              );
            })}
          </nav>
        </div>

        <p className="text-[12px] text-ink-muted leading-relaxed">
          Set up your AI-powered PR outreach pipeline. Your API key is stored
          locally and never sent to our servers.
        </p>
      </div>

      {/* Right: Step content */}
      <div className="flex-1 flex items-start justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-[560px] animate-fade-in-up" key={currentStep}>
          {/* Mobile step indicator */}
          <div className="flex md:hidden items-center gap-2 mb-6">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  idx <= currentStep ? "bg-ink" : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Step 0: AI Provider */}
          {currentStep === 0 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[32px] font-headline tracking-tight mb-2">
                  Connect your AI
                </h1>
                <p className="text-[15px] text-ink-secondary leading-relaxed">
                  Choose your preferred AI provider and enter your API key. This
                  powers the outreach email generation.
                </p>
              </div>

              <div className="space-y-3">
                {providerOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setProvider(opt.value as AIProvider)}
                    className={`
                      w-full flex items-center gap-4 p-4 rounded-xl border text-left
                      transition-all duration-[200ms] cursor-pointer
                      ${
                        provider === opt.value
                          ? "border-ink bg-surface-raised shadow-[0_1px_8px_rgba(0,0,0,0.06)]"
                          : "border-border hover:border-border-strong bg-surface-raised"
                      }
                    `}
                  >
                    <div
                      className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${provider === opt.value ? "bg-ink" : "bg-surface-overlay"}
                    `}
                    >
                      <Robot
                        size={20}
                        weight={provider === opt.value ? "fill" : "regular"}
                        className={
                          provider === opt.value
                            ? "text-surface-raised"
                            : "text-ink-muted"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold">{opt.label}</p>
                      <p className="text-[13px] text-ink-muted">
                        {opt.description}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <div
                        className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        transition-colors
                        ${
                          provider === opt.value
                            ? "border-ink bg-ink"
                            : "border-border"
                        }
                      `}
                      >
                        {provider === opt.value && (
                          <Check
                            size={10}
                            weight="bold"
                            className="text-surface-raised"
                          />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <Input
                label="API Key"
                type="password"
                placeholder={
                  provider === "claude"
                    ? "sk-ant-api03-..."
                    : provider === "openai"
                      ? "sk-..."
                      : "AIza..."
                }
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                hint="Stored locally in your browser. Never sent to our servers."
              />
            </div>
          )}

          {/* Step 1: Project Brief */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[32px] font-headline tracking-tight mb-2">
                  Tell us about your project
                </h1>
                <p className="text-[15px] text-ink-secondary leading-relaxed">
                  The AI uses this to craft personalized, compelling pitches
                  tailored to each outlet.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Project Name"
                  placeholder="My Startup"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <Input
                  label="Website"
                  placeholder="https://..."
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <Input
                label="Tagline"
                placeholder="One-liner that captures what you do"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />

              <TextArea
                label="Description"
                placeholder="What does your project do? What problem does it solve? Who is it for? Be specific — the AI uses this heavily."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="space-y-3">
                <label className="text-[13px] font-medium text-ink-secondary">
                  Key Achievements
                </label>
                {achievements.map((ach, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder={
                        idx === 0
                          ? "e.g., Raised $2M seed round"
                          : "e.g., 10k users in first month"
                      }
                      value={ach}
                      onChange={(e) => {
                        const next = [...achievements];
                        next[idx] = e.target.value;
                        setAchievements(next);
                      }}
                      className="flex-1"
                    />
                    {achievements.length > 1 && (
                      <button
                        onClick={() =>
                          setAchievements((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
                        className="p-2 text-ink-muted hover:text-negative transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setAchievements((prev) => [...prev, ""])}
                  className="flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink transition-colors cursor-pointer"
                >
                  <Plus size={14} /> Add achievement
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  placeholder="Jane Doe"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                />
                <Input
                  label="Your Email"
                  type="email"
                  placeholder="jane@startup.com"
                  value={founderEmail}
                  onChange={(e) => setFounderEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Outlets */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[32px] font-headline tracking-tight mb-2">
                  Where do you want coverage?
                </h1>
                <p className="text-[15px] text-ink-secondary leading-relaxed">
                  Add the publications you most want to appear in. The AI will
                  also discover smaller, niche outlets related to your picks.
                </p>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="e.g., TechCrunch, Wired, The Verge..."
                  value={newOutletName}
                  onChange={(e) => setNewOutletName(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleAddOutlet()}
                />
                <Select
                  options={outletCategories.map((c) => ({
                    value: c,
                    label: c,
                  }))}
                  value={newOutletCategory}
                  onChange={(e) => setNewOutletCategory(e.target.value)}
                  className="w-[130px]"
                />
                <Button
                  onClick={handleAddOutlet}
                  disabled={!newOutletName.trim()}
                  size="md"
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>

              {targetOutlets.length > 0 && (
                <div className="space-y-2">
                  {targetOutlets.map((outlet) => (
                    <div
                      key={outlet.id}
                      className="flex items-center justify-between p-3 bg-surface-raised rounded-lg border border-border animate-fade-in-up"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-surface-overlay flex items-center justify-center">
                          <span className="text-[12px] font-bold text-ink-secondary">
                            {outlet.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-[14px] font-medium">
                            {outlet.name}
                          </p>
                          <p className="text-[12px] text-ink-muted">
                            {outlet.category}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveOutlet(outlet.id)}
                        className="p-1.5 rounded-md hover:bg-surface-overlay text-ink-muted hover:text-negative transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {targetOutlets.length === 0 && (
                <Card className="border-dashed flex flex-col items-center py-12 text-center">
                  <Target
                    size={32}
                    weight="light"
                    className="text-ink-muted mb-3"
                  />
                  <p className="text-[14px] text-ink-secondary font-medium">
                    No outlets added yet
                  </p>
                  <p className="text-[13px] text-ink-muted mt-1">
                    Add the publications where you want to be featured
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Schedule */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[32px] font-headline tracking-tight mb-2">
                  Set your cadence
                </h1>
                <p className="text-[15px] text-ink-secondary leading-relaxed">
                  How often should the AI search for opportunities and draft
                  outreach emails?
                </p>
              </div>

              <div className="space-y-3">
                {frequencyOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setFrequency(opt.value as ScheduleFrequency)
                    }
                    className={`
                      w-full flex items-center gap-4 p-4 rounded-xl border text-left
                      transition-all duration-[200ms] cursor-pointer
                      ${
                        frequency === opt.value
                          ? "border-ink bg-surface-raised shadow-[0_1px_8px_rgba(0,0,0,0.06)]"
                          : "border-border hover:border-border-strong bg-surface-raised"
                      }
                    `}
                  >
                    <div
                      className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${
                        frequency === opt.value
                          ? "border-ink bg-ink"
                          : "border-border"
                      }
                    `}
                    >
                      {frequency === opt.value && (
                        <Check
                          size={10}
                          weight="bold"
                          className="text-surface-raised"
                        />
                      )}
                    </div>
                    <span className="text-[14px] font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <label className="text-[13px] font-medium text-ink-secondary">
                  Target Niches & Keywords
                </label>
                <p className="text-[12px] text-ink-muted">
                  The AI searches these niches for relevant outlets and writers.
                </p>
                {niches.map((niche, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder={
                        idx === 0
                          ? "e.g., AI startups"
                          : "e.g., developer tools, SaaS"
                      }
                      value={niche}
                      onChange={(e) => {
                        const next = [...niches];
                        next[idx] = e.target.value;
                        setNiches(next);
                      }}
                      className="flex-1"
                    />
                    {niches.length > 1 && (
                      <button
                        onClick={() =>
                          setNiches((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="p-2 text-ink-muted hover:text-negative transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setNiches((prev) => [...prev, ""])}
                  className="flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink transition-colors cursor-pointer"
                >
                  <Plus size={14} /> Add niche
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            {currentStep > 0 ? (
              <Button
                variant="ghost"
                onClick={() => setCurrentStep((s) => s - 1)}
              >
                <ArrowLeft size={16} />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={!canProceed()}
              >
                Continue
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={!canProceed()}>
                <Check size={16} weight="bold" />
                Launch PR Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
