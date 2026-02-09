import type { AIConfig, ProjectProfile, Outlet, Contact, OutreachEmail } from './types';

// AI provider API calls
async function callAI(config: AIConfig, systemPrompt: string, userPrompt: string, options?: { useSearch?: boolean }): Promise<string> {
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
        useSearch: options?.useSearch,
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

// Find contacts at a specific outlet using Claude's built-in web search
export async function findContacts(
  config: AIConfig,
  profile: ProjectProfile,
  outlet: Outlet
): Promise<Omit<Contact, 'id'>[]> {
  if (config.provider !== 'anthropic') {
    throw new Error('Contact search requires Anthropic (Claude) as your AI provider — Claude has built-in web search.');
  }

  const systemPrompt = `You are a PR research assistant. Use web search to find real journalists, editors, and writers at the specified media outlet. Search thoroughly — check the outlet's website, staff pages, LinkedIn, Twitter/X, and masthead. Only include contacts you find from real search results. Do NOT make up or hallucinate any names, emails, or roles. If you cannot find real contacts, return an empty JSON array.`;

  const userPrompt = `Search the web to find real journalists, editors, and writers at "${outlet.name}" who cover ${outlet.niche || profile.category}.

Look for:
- Staff/team pages on ${outlet.url || outlet.name + '.com'}
- Writer bios and bylines
- LinkedIn profiles of people who work at ${outlet.name}
- Twitter/X profiles

Return a JSON array of real contacts you found (can be empty if none found):
[{"name": "...", "email": "...", "role": "...", "outlet": "${outlet.name}", "outletId": "${outlet.id}", "beat": "...", "linkedIn": "..."}]

If you can't find an email, set it to an empty string. Do NOT invent details.
Only return the JSON array, no other text.`;

  const response = await callAI(config, systemPrompt, userPrompt, { useSearch: true });
  try {
    // Extract JSON from response (might have surrounding text from search)
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  } catch {
    return [];
  }
}

// Draft outreach email for an individual contact (uses web search to personalize)
export async function draftIndividualEmail(
  config: AIConfig,
  profile: ProjectProfile,
  contact: Contact,
  campaignId: string,
  emailSoul?: string
): Promise<Omit<OutreachEmail, 'id' | 'createdAt'>> {
  const soulBlock = emailSoul ? `\n\nIMPORTANT — Follow this style guide (the "Soul") for the email:\n${emailSoul}` : '';
  const useSearch = config.provider === 'anthropic';

  const systemPrompt = `You are a PR copywriter. Draft a personalized, compelling pitch email to a journalist.${useSearch ? ' First, search the web for their recent articles and coverage to understand what they write about. Reference their actual work naturally in the pitch — show you\'ve done your homework.' : ''} The email should feel like it was written specifically for this person, not a mass blast.${soulBlock}`;

  const userPrompt = `Project: ${profile.name}
Tagline: ${profile.tagline}
Brief: ${profile.brief}
Key achievements: ${profile.achievements.join('; ')}
Website: ${profile.website || 'N/A'}

Contact: ${contact.name}, ${contact.role} at ${contact.outlet}
Their beat: ${contact.beat || 'General'}
${contact.linkedIn ? `LinkedIn: ${contact.linkedIn}` : ''}

${useSearch ? `Search for recent articles by ${contact.name} at ${contact.outlet} to understand their coverage and personalize the pitch. Reference a specific piece of their work if you find one.` : ''}

Write the pitch email. Return JSON:
{"subject": "...", "body": "..."}

Only return the JSON, no other text.`;

  const response = await callAI(config, systemPrompt, userPrompt, { useSearch });
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
  campaignId: string,
  emailSoul?: string
): Promise<Omit<OutreachEmail, 'id' | 'createdAt'>> {
  const soulBlock = emailSoul ? `\n\nIMPORTANT — Follow this style guide (the "Soul") for the email:\n${emailSoul}` : '';
  const systemPrompt = `You are a PR copywriter. Draft a publication-level pitch email. This goes to an editorial team or tips inbox, so it should be more formal and newsworthy than an individual pitch. Focus on the story angle, not just the product. Include data points and a clear hook.${soulBlock}`;

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
