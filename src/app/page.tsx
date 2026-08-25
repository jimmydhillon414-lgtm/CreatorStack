'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import type { MainVideoProps } from '@/remotion/MainVideo'

const VideoPlayer = dynamic(
  () => import('@/components/VideoPlayer').then((mod) => mod.VideoPlayer),
  { ssr: false }
)

export default function Home() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [videoProps, setVideoProps] = useState<MainVideoProps>({
    title: 'Your AI Short Preview',
    scenes: [
      {
        sceneNumber: 1,
        caption: 'Enter a topic to generate your short video!',
        voiceover: '',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-playful-kitten-sitting-on-a-floor-41527-large.mp4',
      },
    ],
    audioUrl: '',
  })

  const handleGenerate = async () => {
    console.log('--> Generate button clicked! Topic value:', `"${topic}"`)

    if (!topic || !topic.trim()) {
      setErrorMsg('Please enter a topic before generating.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      console.log('--> Fetching script for topic:', topic)
      const scriptRes = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      })

      const scriptData = await scriptRes.json()

      // Gracefully handle Gemini 429 Rate Limit/Quota errors with a local fallback
      if (!scriptRes.ok) {
        if (scriptData.error?.includes('429') || scriptData.error?.includes('quota') || scriptData.error?.includes('RESOURCE_EXHAUSTED')) {
          console.warn('Gemini API quota reached. Triggering fallback video structure...')
          setVideoProps({
            title: topic.trim(),
            scenes: [
              {
                sceneNumber: 1,
                caption: topic.trim().toUpperCase(),
                voiceover: `Here is a quick overview about ${topic}.`,
                videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-playful-kitten-sitting-on-a-floor-41527-large.mp4',
              },
            ],
            audioUrl: '',
          })
          setErrorMsg('Rate limit hit on AI API. Previewing fallback video template.')
          return
        }
        throw new Error(scriptData.error || `Script generation failed (${scriptRes.status})`)
      }

      console.log('--> Script generated successfully:', scriptData)

      console.log('--> Fetching audio...')
      const audioRes = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: scriptData.script.voiceoverScript }),
      })

      if (!audioRes.ok) {
        const err = await audioRes.json()
        throw new Error(err.error || `Audio generation failed (${audioRes.status})`)
      }

      const audioData = await audioRes.json()
      console.log('--> Audio generated successfully!')

      setVideoProps({
        title: scriptData.script.title,
        scenes: scriptData.script.scenes,
        audioUrl: audioData.audioUrl,
      })
    } catch (err: unknown) {
      const error = err as Error
      console.error('Generation Pipeline Error:', error)
      setErrorMsg(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col md:flex-row gap-8 items-center justify-center">
      <div className="w-full max-w-lg space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-3xl font-black text-indigo-400">CreatorStack AI</h1>
        <p className="text-slate-400">Programmatic Short Video Generation</p>

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-500/50 p-4 rounded-xl text-red-200 text-sm">
            <strong>Notice:</strong> {errorMsg}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Video Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. cute running puppies"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-slate-100"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-bold rounded-xl transition duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? 'Generating Script & Audio...' : 'Generate Short Video'}
        </button>
      </div>

      <div className="flex flex-col items-center">
        {/* Forces player component update whenever video props or audio change */}
        <VideoPlayer key={videoProps.audioUrl || videoProps.title + (videoProps.scenes[0]?.videoUrl || '')} props={videoProps} />
      </div>
    </main>
  )
}