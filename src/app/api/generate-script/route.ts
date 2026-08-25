import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

interface SceneItem {
  sceneNumber: number
  caption: string
  voiceover: string
  searchKeyword?: string
  videoUrl?: string
}

async function fetchPexelsVideo(query: string): Promise<string> {
  // Reliable vertical Pexels sample URL with open CORS permissions
  const fallbackVideo = 'https://images.pexels.com/videos/854002/free-video-854002.jpg'

  try {
    const pexelsKey = process.env.PEXELS_API_KEY
    if (!pexelsKey) return fallbackVideo

    const cleanQuery = query.replace(/[^a-zA-Z0-9 ]/g, '').trim().split(' ')[0] || 'nature'

    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(cleanQuery)}&orientation=portrait&per_page=1`,
      { headers: { Authorization: pexelsKey } }
    )

    if (!res.ok) return fallbackVideo
    const data = await res.json()

    if (data?.videos?.[0]?.video_files?.length > 0) {
      const file = data.videos[0].video_files.find(
        (f: { quality: string; link: string }) => f.quality === 'hd' || f.quality === 'sd'
      )
      return file ? file.link : data.videos[0].video_files[0].link
    }
  } catch (err) {
    console.error('Pexels Video Search Error:', err)
  }

  return fallbackVideo
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { topic, niche } = body

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const prompt = `Create a short-form video script for the topic: "${topic}" ${niche ? `in the niche: "${niche}"` : ''}.
    Return ONLY a valid JSON object matching this exact structure:
    {
      "title": "Catchy Short Title",
      "voiceoverScript": "Full continuous voiceover text for the video...",
      "scenes": [
        {
          "sceneNumber": 1,
          "caption": "Short on-screen hook caption",
          "voiceover": "Voiceover line for scene 1",
          "searchKeyword": "Single descriptive search word"
        }
      ]
    }`

    let response
    try {
      // Try primary fast model
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      })
    } catch {
      // Fallback model if primary quota is exhausted
      response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      })
    }

    const rawText = response.text || '{}'
    const scriptData = JSON.parse(rawText)

    if (scriptData.scenes && Array.isArray(scriptData.scenes)) {
      const updatedScenes = await Promise.all(
        scriptData.scenes.map(async (scene: SceneItem) => {
          const keyword = scene.searchKeyword || topic
          const videoUrl = await fetchPexelsVideo(keyword)
          return { ...scene, videoUrl }
        })
      )
      scriptData.scenes = updatedScenes
    }

    return NextResponse.json({ script: scriptData })
  } catch (err: unknown) {
    const error = err as Error
    console.error('Gemini Script Generation Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate script' },
      { status: 500 }
    )
  }
}