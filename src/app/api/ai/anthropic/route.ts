import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { apiKey, authMethod, model, system, prompt, useSearch } = await req.json();

  if (!apiKey || !prompt) {
    return NextResponse.json({ error: 'Missing apiKey or prompt' }, { status: 400 });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
  };

  if (authMethod === 'oauthToken') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else {
    headers['x-api-key'] = apiKey;
  }

  const body: Record<string, unknown> = {
    model: model || 'claude-opus-4-6',
    max_tokens: 4096,
    system: system || '',
    messages: [{ role: 'user', content: prompt }],
  };

  // Add web search tool when requested
  if (useSearch) {
    body.tools = [
      {
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: 5,
      },
    ];
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();

  // Extract text from all content blocks (search responses have multiple blocks)
  const textParts: string[] = [];
  for (const block of data.content || []) {
    if (block.type === 'text') {
      textParts.push(block.text);
    }
  }
  const text = textParts.join('\n');

  return NextResponse.json({ text });
}
