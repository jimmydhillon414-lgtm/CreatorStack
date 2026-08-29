import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence } from 'remotion';

export interface Scene {
  text: string;
  mediaUrl: string;
}

export interface MainVideoProps {
  script?: Scene[];
  audioUrl?: string;
}

export const MainVideo: React.FC<MainVideoProps> = ({ script = [], audioUrl }) => {
  const sceneDuration = 150; // 5 seconds per scene at 30 fps

  return (
    <AbsoluteFill className="bg-black text-white">
      {/* Audio Layer */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* Visual Scenes Layer */}
      {script.map((scene, index) => {
        const isVideo = scene.mediaUrl?.endsWith('.mp4') || scene.mediaUrl?.includes('video');

        return (
          <Sequence
            key={index}
            from={index * sceneDuration}
            durationInFrames={sceneDuration}
          >
            <AbsoluteFill>
              {isVideo ? (
                <OffthreadVideo
                  src={scene.mediaUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Img
                  src={scene.mediaUrl}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Subtitles Overlay */}
              {scene.text && (
                <div className="absolute bottom-12 left-0 right-0 text-center px-6">
                  <span className="bg-black/70 text-yellow-400 font-bold text-xl px-4 py-2 rounded-lg border border-yellow-400/30 uppercase tracking-wide inline-block">
                    {scene.text}
                  </span>
                </div>
              )}
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};