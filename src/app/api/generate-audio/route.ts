import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse Input Payload
    const body = await req.json()
    const { text } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text string is required for audio generation' }, { status: 400 })
    }

    // 3. Verify API Key
    const apiKey = process.env.DEEPGRAM_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Deepgram API key not configured' }, { status: 500 })
    }

    // 4. Call Deepgram TTS API via Direct Fetch
    const response = await fetch(
      'https://api.deepgram.com/v1/speak?model=aura-sterope-en&encoding=mp3',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Deepgram API error:', errorText)
      return NextResponse.json({ error: 'Failed to generate audio from Deepgram' }, { status: response.status })
    }

    // 5. Convert Audio ArrayBuffer to Base64
    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    const audioDataUrl = `data:audio/mp3;base64,${base64Audio}`

    return NextResponse.json({
      success: true,
      audioUrl: audioDataUrl,
    })

  } catch (error) {
    console.error('Error in /api/generate-audio:', error)
    return NextResponse.json(
      { error: 'Internal Server Error during audio generation' },
      { status: 500 }
    )
  }
}