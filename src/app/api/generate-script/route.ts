import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// Initialize Google Gemini AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { topic, niche } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const prompt = `Create a short-form video script for the topic: "${topic}" in the niche: "${niche || 'finance'}".
    Return ONLY a valid JSON object matching this exact structure:
    {
      "title": "Catchy Short Title",
      "voiceoverScript": "Full continuous voiceover text for the video...",
      "scenes": [
        {
          "sceneNumber": 1,
          "caption": "Short on-screen hook caption",
          "voiceover": "Voiceover line for scene 1",
          "graphicType": "stock_chart",
          "graphicData": { "label": "METRIC", "value": "150%", "trend": "up" }
        }
      ]
    }`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    })

    const rawText = response.text || '{}'
    const scriptData = JSON.parse(rawText)

    return NextResponse.json({ script: scriptData })
  } catch (err: unknown) {
    const error = err as Error
    console.error('Gemini Script Generation Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate script' },
      { status: 500 }
    )
  }}