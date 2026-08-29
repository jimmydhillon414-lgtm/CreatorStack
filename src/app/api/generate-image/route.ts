import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Pass clean prompt directly without adding conflicting adjectives
    const cleanPrompt = prompt.trim();
    const encodedPrompt = encodeURIComponent(cleanPrompt);
    const randomSeed = Math.floor(Math.random() * 1000000);

    // Using model=flux-realism specifically for accurate human features
    const pollUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${randomSeed}&model=flux-realism&nologo=true`;

    const imageRes = await fetch(pollUrl);

    if (!imageRes.ok) {
      return NextResponse.json(
        { error: `Pollinations API returned status ${imageRes.status}` },
        { status: imageRes.status }
      );
    }

    const arrayBuffer = await imageRes.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = imageRes.headers.get('content-type') || 'image/jpeg';

    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    return NextResponse.json({ imageUrl: dataUrl });

  } catch (err: unknown) {
    const error = err as Error;
    console.error('Image Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}