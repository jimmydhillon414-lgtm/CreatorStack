'use client'

import React from 'react'
import { Player } from '@remotion/player'
import { MainVideo, type MainVideoProps } from '@/remotion/MainVideo'

interface VideoPlayerProps {
  props: MainVideoProps
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ props }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-black">
        <Player
          component={MainVideo}
          durationInFrames={450}
          compositionWidth={1080}
          compositionHeight={1920}
          fps={30}
          style={{
            width: '360px',
            height: '640px',
          }}
          controls
          acknowledgeRemotionLicense
          inputProps={props}
        />
      </div>
    </div>
  )
}