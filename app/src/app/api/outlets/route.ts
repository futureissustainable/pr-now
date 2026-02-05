import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import type { AIConfig, ProjectBrief, TargetOutlet, Contact } from "@/lib/types";

interface DiscoverRequest {
  aiConfig: AIConfig;
  projectBrief: ProjectBrief;
  existingOutlets: TargetOutlet[];
}

const SYSTEM_PROMPT = `You are a PR research specialist. You discover relevant media outlets and journalist contacts for companies seeking press coverage.

Focus on:
- Niche outlets that are highly relevant but less competitive
- Individual journalists who cover this exact beat
- Both established and emerging publications
- Trade publications, industry blogs, newsletters, and podcasts

Return valid JSON only. No markdown, no code blocks.`;

function buildPrompt(brief: ProjectBrief, existing: TargetOutlet[]): string {
  const existingNames = existing.map((o) => o.name).join(", ");

  return `Discover new media outlets and journalist contacts for my project.

PROJECT:
Name: ${brief.name}
Description: ${brief.description}
Key Achievements: ${brief.achievements.join(", ")}

ALREADY TARGETING: ${existingNames || "None"}

Find 5-8 NEW outlets (not in the already targeting list) and 3-5 journalist contacts. Focus on niche, relevant outlets that would be genuinely interested in this story.

Return JSON with this structure:
{
  "outlets": [
    {
      "name": "Outlet Name",
      "url": "https://outlet.com",
      "category": "Tech|Business|Startup|Science|Health|Finance|AI/ML|Crypto|Design|Gaming|Media|Other",
      "priority": "high|medium|low",
      "reason": "Why this outlet is relevant"
    }
  ],
  "contacts": [
    {
      "name": "Journalist Name",
      "email": "journalist@outlet.com",
      "role": "Title/Role",
      "outlet": "Outlet Name",
      "beat": "What they cover"
    }
  ]
}`;
}

async function callAI(config: AIConfig, systemPrompt: string, userPrompt: string): Promise<string> {
  switch (config.provider) {
    case "claude": {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.content[0].text;
    }

    case "openai": {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 4096,
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.choices[0].message.content;
    }

    case "gemini": {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              maxOutputTokens: 4096,
            },
          }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.candidates[0].content.parts[0].text;
    }

    default:
      throw new Error("Invalid provider");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: DiscoverRequest = await request.json();
    const { aiConfig, projectBrief, existingOutlets } = body;

    if (!aiConfig?.apiKey || !projectBrief) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = buildPrompt(projectBrief, existingOutlets || []);
    const rawResponse = await callAI(aiConfig, SYSTEM_PROMPT, prompt);

    let jsonStr = rawResponse.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonStr);

    const outlets: TargetOutlet[] = (parsed.outlets || []).map(
      (o: { name?: string; url?: string; category?: string; priority?: string }) => ({
        id: uuid(),
        name: o.name || "Unknown",
        url: o.url,
        category: o.category || "Other",
        priority: (o.priority as "high" | "medium" | "low") || "medium",
        isUserPicked: false,
        discovered: true,
      })
    );

    const contacts: Contact[] = (parsed.contacts || []).map(
      (c: { name?: string; email?: string; role?: string; outlet?: string; beat?: string }) => ({
        id: uuid(),
        name: c.name || "Unknown",
        email: c.email || "",
        role: c.role || "",
        outlet: c.outlet || "",
        beat: c.beat,
      })
    );

    return NextResponse.json({ outlets, contacts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
