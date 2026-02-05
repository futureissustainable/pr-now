import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { apiKey, authMethod, model, prompt } = await req.json();

  if (!apiKey || !prompt) {
    return NextResponse.json({ error: 'Missing apiKey or prompt' }, { status: 400 });
  }

  const modelName = model || 'gemini-2.0-flash';
  const useOAuth = authMethod === 'oauthToken';
  const url = useOAuth
    ? `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`
    : `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (useOAuth) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 2048 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return NextResponse.json({ text });
}
