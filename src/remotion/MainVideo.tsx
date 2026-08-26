import React from 'react'
import { AbsoluteFill, Audio, Img, OffthreadVideo, useCurrentFrame } from 'remotion'

export type Scene = {
  sceneNumber: number
  caption: string
  voiceover: string
  videoUrl?: string
  imageUrl?: string
  graphicType?: string
  graphicData?: Record<string, unknown>
}

export type MainVideoProps = {
  title: string
  scenes: Scene[]
  audioUrl?: string
}

const getProxiedUrl = (originalUrl?: string) => {
  if (!originalUrl) return undefined
  return `/api/video-proxy?url=${encodeURIComponent(originalUrl)}`
}

export const MainVideo: React.FC<MainVideoProps> = ({ title, scenes, audioUrl }) => {
  const frame = useCurrentFrame()

  const sceneDuration = 90
  const currentSceneIndex = Math.min(
    Math.floor(frame / sceneDuration),
    Math.max(0, scenes.length - 1)
  )
  const currentScene = scenes[currentSceneIndex] || scenes[0] || { caption: title }

  const videoUrl = getProxiedUrl(currentScene?.videoUrl)
  const imageUrl = getProxiedUrl(currentScene?.imageUrl)
  const proxiedAudioUrl = getProxiedUrl(audioUrl)

  return (
    <AbsoluteFill className="bg-slate-950 text-white flex flex-col items-center justify-between p-10 font-sans relative overflow-hidden">
      {/* Visual Background Rendering */}
      {videoUrl ? (
        <OffthreadVideo
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-cover opacity-75"
          muted
          onError={(err) => console.error("Remotion OffthreadVideo error:", err)}
        />
      ) : imageUrl ? (
        <Img
          src={imageUrl}
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-black" />
      )}

      {/* Audio Layer */}
      {proxiedAudioUrl ? <Audio src={proxiedAudioUrl} /> : null}

      {/* Top Badge */}
      <div className="relative z-10 mt-6 bg-indigo-600/70 backdrop-blur-md rounded-full px-5 py-2 border border-indigo-400/40">
        <span className="text-white font-bold uppercase tracking-wider text-xs">
          CreatorStack AI
        </span>
      </div>

      {/* Caption Overlay */}
      <div className="relative z-10 w-full max-w-xs bg-slate-950/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-center">
        <h2 className="text-xl font-black text-amber-300 uppercase tracking-wide leading-tight">
          {currentScene.caption}
        </h2>
      </div>

      {/* Title Bar */}
      <div className="relative z-10 mb-10 text-center">
        <p className="text-lg font-bold text-slate-200 drop-shadow-md">
          {title}
        </p>
      </div>
    </AbsoluteFill>
  )
}