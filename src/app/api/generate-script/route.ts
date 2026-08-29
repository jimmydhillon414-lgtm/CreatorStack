import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY missing in .env.local' }, { status: 500 });
    }

    // Direct string match requested by Google API
    const targetModel = 'models/gemini-3.6-flash';

    const promptText = `Generate a video script JSON object for a short video about "${topic}".
    Return ONLY a JSON object with this exact structure (no markdown formatting, no code blocks):
    {
      "title": "Short Title",
      "voiceoverScript": "Full audio transcript for voiceover",
      "scenes": [
        {
          "sceneNumber": 1,
          "caption": "Short text caption for scene 1",
          "voiceover": "Sentence spoken in scene 1"
        }
      ]
    }`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${targetModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || `API Error ${response.status}` },
        { status: response.status }
      );
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return NextResponse.json({ error: 'Empty response returned' }, { status: 500 });
    }

    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const script = JSON.parse(cleanJson);

    return NextResponse.json({ script });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}