import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // High Quality Pollinations AI Image Endpoint
    const cleanPrompt = encodeURIComponent(prompt.trim());
    const randomSeed = Math.floor(Math.random() * 1000000);
    const aiImageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=720&height=1280&nologo=true&seed=${randomSeed}`;

    return NextResponse.json({ 
      videoUrl: aiImageUrl, 
      url: aiImageUrl,
      type: 'image'
    });

  } catch (err: unknown) {
    const error = err as Error;
    console.error('Pollinations AI Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}