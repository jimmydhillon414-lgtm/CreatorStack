import React from 'react'
import { AbsoluteFill, Audio, interpolate, useCurrentFrame } from 'remotion'

export type Scene = {
  sceneNumber: number
  caption: string
  voiceover: string
  graphicType: string
  graphicData?: {
    label?: string
    value?: string
    trend?: string
  }
}

export type MainVideoProps = {
  title: string
  scenes: Scene[]
  audioUrl?: string
}

export const MainVideo: React.FC<MainVideoProps> = ({ title, scenes, audioUrl }) => {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const scale = interpolate(frame, [0, 15], [0.95, 1], { extrapolateRight: 'clamp' })

  const currentScene = scenes[0] || { caption: title, graphicData: {} }

  return (
    <AbsoluteFill className="bg-slate-950 text-white flex flex-col items-center justify-between p-12 font-sans">
      {audioUrl ? <Audio src={audioUrl} /> : null}

      <div className="mt-12 bg-indigo-600/30 border border-indigo-500/50 rounded-full px-6 py-2">
        <span className="text-indigo-400 font-bold uppercase tracking-wider text-xl">Finance AI Niche</span>
      </div>

      <div 
        style={{ opacity, transform: `scale(${scale})` }}
        className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-slate-100 leading-tight">
          {currentScene.caption}
        </h2>

        {currentScene.graphicData?.label && (
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50">
            <p className="text-slate-400 text-lg uppercase tracking-wide">{currentScene.graphicData.label}</p>
            <p className="text-5xl font-black text-emerald-400 mt-2">{currentScene.graphicData.value}</p>
          </div>
        )}
      </div>

      <div className="mb-16 text-center max-w-lg">
        <p className="text-4xl font-black tracking-tight text-amber-400 uppercase drop-shadow-md">
          {title}
        </p>
      </div>
    </AbsoluteFill>
  )
}