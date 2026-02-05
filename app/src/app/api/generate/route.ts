import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import type { AIConfig, ProjectBrief, TargetOutlet, OutreachEmail } from "@/lib/types";

interface GenerateRequest {
  aiConfig: AIConfig;
  projectBrief: ProjectBrief;
  outlets: TargetOutlet[];
}

const SYSTEM_PROMPT = `You are a PR outreach specialist. You craft personalized, compelling pitch emails to journalists and publications.

Your emails should be:
- Concise (under 200 words)
- Personalized to the specific outlet/journalist
- Lead with what makes the story newsworthy
- Include a clear call to action
- Professional but not stiff — genuine and human

Return valid JSON only. No markdown, no code blocks.`;

function buildUserPrompt(brief: ProjectBrief, outlets: TargetOutlet[]): string {
  const outletList = outlets.map((o) => `- ${o.name} (${o.category})`).join("\n");

  return `Generate personalized outreach emails for my project.

PROJECT:
Name: ${brief.name}
Tagline: ${brief.tagline}
Description: ${brief.description}
Key Achievements: ${brief.achievements.join(", ")}
Website: ${brief.website || "N/A"}
Contact: ${brief.founderName} <${brief.founderEmail}>

TARGET OUTLETS:
${outletList}

For each outlet, generate:
1. An "individual" email (to a specific journalist — make up a plausible journalist name and email for that outlet)
2. A "publication" email (to the editorial/tips inbox — use tips@ or editorial@ with the outlet domain)

Return a JSON object with this exact structure:
{
  "emails": [
    {
      "type": "individual" or "publication",
      "recipientName": "Journalist Name",
      "recipientEmail": "journalist@outlet.com",
      "outlet": "Outlet Name",
      "subject": "Email subject line",
      "body": "Full email body"
    }
  ]
}`;
}

async function callClaude(apiKey: string, systemPrompt: string, userPrompt: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error: ${err}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

async function callOpenAI(apiKey: string, systemPrompt: string, userPrompt: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
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

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGemini(apiKey: string, systemPrompt: string, userPrompt: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { aiConfig, projectBrief, outlets } = body;

    if (!aiConfig?.apiKey || !projectBrief || !outlets?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userPrompt = buildUserPrompt(projectBrief, outlets);
    let rawResponse: string;

    switch (aiConfig.provider) {
      case "claude":
        rawResponse = await callClaude(aiConfig.apiKey, SYSTEM_PROMPT, userPrompt);
        break;
      case "openai":
        rawResponse = await callOpenAI(aiConfig.apiKey, SYSTEM_PROMPT, userPrompt);
        break;
      case "gemini":
        rawResponse = await callGemini(aiConfig.apiKey, SYSTEM_PROMPT, userPrompt);
        break;
      default:
        return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    // Parse JSON from the response (handle potential markdown wrapping)
    let jsonStr = rawResponse.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonStr);
    const emails: OutreachEmail[] = (parsed.emails || []).map(
      (e: {
        type?: string;
        recipientName?: string;
        recipientEmail?: string;
        outlet?: string;
        subject?: string;
        body?: string;
      }) => ({
        id: uuid(),
        type: e.type === "publication" ? "publication" : "individual",
        recipientName: e.recipientName || "Unknown",
        recipientEmail: e.recipientEmail || "",
        outlet: e.outlet || "Unknown",
        subject: e.subject || "PR Pitch",
        body: e.body || "",
        status: "ready" as const,
        createdAt: new Date().toISOString(),
      })
    );

    return NextResponse.json({ emails });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
