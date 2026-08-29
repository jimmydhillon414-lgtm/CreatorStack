import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence } from 'remotion';

export interface Scene {
  sceneNumber?: number;
  text?: string;
  caption?: string;
  voiceover?: string;
  mediaUrl?: string;
  graphicType?: string;
  graphicData?: {
    label: string;
    value: string;
    trend: string;
  };
}

export interface MainVideoProps {
  title?: string;
  script?: Scene[];
  scenes?: Scene[];
  audioUrl?: string;
}

export const MainVideo: React.FC<MainVideoProps> = ({ 
  title, 
  script, 
  scenes, 
  audioUrl 
}) => {
  const sceneDuration = 150; // 5 seconds per scene at 30 fps
  const activeScript = script || scenes || [];

  return (
    <AbsoluteFill className="bg-black text-white">
      {/* Audio Layer */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* Visual Scenes Layer */}
      {activeScript.map((scene, index) => {
        const displayText = scene.text || scene.caption || scene.voiceover;
        const isVideo = scene.mediaUrl?.endsWith('.mp4') || scene.mediaUrl?.includes('video');

        return (
          <Sequence
            key={index}
            from={index * sceneDuration}
            durationInFrames={sceneDuration}
          >
            <AbsoluteFill>
              {scene.mediaUrl && (
                isVideo ? (
                  <OffthreadVideo
                    src={scene.mediaUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Img
                    src={scene.mediaUrl}
                    className="w-full h-full object-cover"
                  />
                )
              )}

              {/* Subtitles / Text Overlay */}
              {displayText && (
                <div className="absolute bottom-12 left-0 right-0 text-center px-6">
                  <span className="bg-black/70 text-yellow-400 font-bold text-xl px-4 py-2 rounded-lg border border-yellow-400/30 uppercase tracking-wide inline-block">
                    {displayText}
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
