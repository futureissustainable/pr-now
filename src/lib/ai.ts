import type { AIConfig, ProjectProfile, Outlet, Contact, OutreachEmail } from './types';

// AI provider API calls
async function callAI(config: AIConfig, systemPrompt: string, userPrompt: string): Promise<string> {
  const authMethod = config.authMethod || 'apiKey';

  if (config.provider === 'anthropic') {
    const res = await fetch('/api/ai/anthropic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: config.apiKey,
        authMethod,
        model: config.model || 'claude-opus-4-6',
        system: systemPrompt,
        prompt: userPrompt,
      }),
    });
    if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
    const data = await res.json();
    return data.text;
  }

  if (config.provider === 'openai') {
    const res = await fetch('/api/ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: config.apiKey,
        authMethod,
        model: config.model || 'gpt-5.2',
        system: systemPrompt,
        prompt: userPrompt,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
    const data = await res.json();
    return data.text;
  }

  if (config.provider === 'google') {
    const res = await fetch('/api/ai/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: config.apiKey,
        authMethod,
        model: config.model || 'gemini-3.0-flash',
        prompt: `${systemPrompt}\n\n${userPrompt}`,
      }),
    });
    if (!res.ok) throw new Error(`Google API error: ${res.status}`);
    const data = await res.json();
    return data.text;
  }

  throw new Error(`Unknown provider: ${config.provider}`);
}

// Discover relevant outlets based on project profile and niches
export async function discoverOutlets(
  config: AIConfig,
  profile: ProjectProfile,
  targetNiches: string[],
  existingOutlets: string[]
): Promise<Omit<Outlet, 'id'>[]> {
  const systemPrompt = `You are a PR research assistant. Given a project profile and target niches, suggest relevant media outlets, blogs, newsletters, podcasts, and YouTube channels that might cover this project. Focus on a mix of large outlets and smaller niche ones. Return JSON array.`;

  const userPrompt = `Project: ${profile.name}
Description: ${profile.brief}
Category: ${profile.category}
Target niches: ${targetNiches.join(', ')}
Already targeting: ${existingOutlets.join(', ')}

Return a JSON array of 5-8 NEW outlets (not already listed) with this shape:
[{"name": "...", "type": "publication|blog|podcast|newsletter|youtube", "niche": "...", "url": "...", "audienceSize": "...", "relevanceScore": 0-100, "isUserPicked": false, "isDiscovered": true}]

Only return the JSON array, no other text.`;

  const response = await callAI(config, systemPrompt, userPrompt);
  try {
    const parsed = JSON.parse(response.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
    return parsed;
  } catch {
    return [];
  }
}

// Search the web using Serper API
async function searchWeb(searchApiKey: string, query: string): Promise<string> {
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: searchApiKey, query }),
  });
  if (!res.ok) throw new Error(`Search API error: ${res.status}`);
  const data = await res.json();
  const results = data.results;

  // Format search results into a readable string for the AI
  const organic = results.organic || [];
  const formatted = organic.map((r: { title?: string; snippet?: string; link?: string }, i: number) =>
    `[${i + 1}] ${r.title || ''}\n${r.snippet || ''}\nURL: ${r.link || ''}`
  ).join('\n\n');

  return formatted || 'No search results found.';
}

// Find contacts at a specific outlet using web search
export async function findContacts(
  config: AIConfig,
  profile: ProjectProfile,
  outlet: Outlet
): Promise<Omit<Contact, 'id'>[]> {
  if (!config.searchApiKey) {
    throw new Error('Search API key required. Add a Serper API key in Setup to find real contacts.');
  }

  // Search for journalists/editors at this outlet
  const queries = [
    `${outlet.name} journalist editor contact email ${outlet.niche}`,
    `${outlet.name} staff writers reporters ${profile.category}`,
  ];

  let searchContext = '';
  for (const q of queries) {
    const results = await searchWeb(config.searchApiKey, q);
    searchContext += results + '\n\n';
  }

  const systemPrompt = `You are a PR research assistant. Extract real journalist/editor contact information from web search results. Only include contacts you can verify from the search results — do NOT make up or hallucinate any names, emails, or roles. If you cannot find real contacts, return an empty array. For emails, only include ones that actually appeared in the search results.`;

  const userPrompt = `I need to find real journalists/editors at ${outlet.name} who cover ${outlet.niche || profile.category}.

Here are web search results:
---
${searchContext}
---

From ONLY the information in the search results above, extract real contacts. Do NOT invent any details.
If an email is not visible in the results, set email to an empty string.

Return a JSON array (can be empty if no real contacts found):
[{"name": "...", "email": "...", "role": "...", "outlet": "${outlet.name}", "outletId": "${outlet.id}", "beat": "...", "linkedIn": "..."}]

Only return the JSON array, no other text.`;

  const response = await callAI(config, systemPrompt, userPrompt);
  try {
    const parsed = JSON.parse(response.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
    return parsed;
  } catch {
    return [];
  }
}

// Draft outreach email for an individual contact
export async function draftIndividualEmail(
  config: AIConfig,
  profile: ProjectProfile,
  contact: Contact,
  campaignId: string
): Promise<Omit<OutreachEmail, 'id' | 'createdAt'>> {
  const systemPrompt = `You are a PR copywriter. Draft a personalized, compelling pitch email to a journalist. Be concise, relevant to their beat, and lead with value. Don't be salesy — be human and direct. The email should feel like it was written specifically for this person.`;

  const userPrompt = `Project: ${profile.name}
Tagline: ${profile.tagline}
Brief: ${profile.brief}
Key achievements: ${profile.achievements.join('; ')}
Website: ${profile.website || 'N/A'}

Contact: ${contact.name}, ${contact.role} at ${contact.outlet}
Their beat: ${contact.beat || 'General'}

Write the pitch email. Return JSON:
{"subject": "...", "body": "..."}

Only return the JSON, no other text.`;

  const response = await callAI(config, systemPrompt, userPrompt);
  try {
    const parsed = JSON.parse(response.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
    return {
      campaignId,
      contactId: contact.id,
      contactName: contact.name,
      contactEmail: contact.email,
      outletName: contact.outlet,
      type: 'individual',
      subject: parsed.subject,
      body: parsed.body,
      status: 'pending_approval',
    };
  } catch {
    return {
      campaignId,
      contactId: contact.id,
      contactName: contact.name,
      contactEmail: contact.email,
      outletName: contact.outlet,
      type: 'individual',
      subject: `Covering ${profile.name} — ${profile.tagline}`,
      body: `Hi ${contact.name},\n\nI'm reaching out about ${profile.name}. ${profile.brief}\n\nWould love to discuss further.\n\nBest regards`,
      status: 'pending_approval',
    };
  }
}

// Draft outreach email for a publication (general tips/editorial inbox)
export async function draftPublicationEmail(
  config: AIConfig,
  profile: ProjectProfile,
  outlet: Outlet,
  campaignId: string
): Promise<Omit<OutreachEmail, 'id' | 'createdAt'>> {
  const systemPrompt = `You are a PR copywriter. Draft a publication-level pitch email. This goes to an editorial team or tips inbox, so it should be more formal and newsworthy than an individual pitch. Focus on the story angle, not just the product. Include data points and a clear hook.`;

  const userPrompt = `Project: ${profile.name}
Tagline: ${profile.tagline}
Brief: ${profile.brief}
Key achievements: ${profile.achievements.join('; ')}
Website: ${profile.website || 'N/A'}

Publication: ${outlet.name} (${outlet.type}, niche: ${outlet.niche})

Write a formal pitch for the editorial team. Return JSON:
{"subject": "...", "body": "...", "contactName": "Editorial Team", "contactEmail": "tips@${outlet.name.toLowerCase().replace(/[^a-z]/g, '')}.example.com"}

Only return the JSON, no other text.`;

  const response = await callAI(config, systemPrompt, userPrompt);
  try {
    const parsed = JSON.parse(response.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
    return {
      campaignId,
      contactName: parsed.contactName || 'Editorial Team',
      contactEmail: parsed.contactEmail,
      outletName: outlet.name,
      type: 'publication',
      subject: parsed.subject,
      body: parsed.body,
      status: 'pending_approval',
    };
  } catch {
    return {
      campaignId,
      contactName: 'Editorial Team',
      contactEmail: `tips@${outlet.name.toLowerCase().replace(/[^a-z]/g, '')}.example.com`,
      outletName: outlet.name,
      type: 'publication',
      subject: `Story pitch: ${profile.name} — ${profile.tagline}`,
      body: `Dear Editorial Team,\n\nWe'd like to share a story about ${profile.name}. ${profile.brief}\n\nKey data points:\n${profile.achievements.map(a => `- ${a}`).join('\n')}\n\nWe'd welcome the opportunity to discuss this further.\n\nRegards`,
      status: 'pending_approval',
    };
  }
}
