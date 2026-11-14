import React from "react";
import { Series, interpolate } from "remotion";
import { Scene } from "./components/Scene";
import { Story, defaultStory } from "./data/story";
import { SafeAudio } from "./components/SafeAudio";
import subtitlesData from "./data/subtitles.json";

interface ReelCompositionProps {
  story?: Story;
}

export const ReelComposition: React.FC<ReelCompositionProps> = ({
  story = defaultStory,
}) => {
  const baseMusicVol = story.volumes?.music ?? 0.12;
  const musicPath = story.backgroundMusic ?? "music/background.mp3";

  // Precalculamos los rangos de fotogramas donde la voz está hablando
  const speechIntervals: Array<{ start: number; end: number }> = [];
  let currentStart = 0;

  for (const scene of story.scenes) {
    const sceneSubs = (subtitlesData.scenes as Record<string, any>)?.[
      String(scene.id)
    ];
    const totalSceneFrames =
      sceneSubs?.durationInFrames ||
      Math.ceil(scene.durationInSeconds * story.fps);

    const voiceDuration = sceneSubs?.audioDuration
      ? Math.round(sceneSubs.audioDuration * story.fps)
      : Math.max(0, totalSceneFrames - Math.round(story.fps * 0.5));

    speechIntervals.push({
      start: currentStart,
      end: currentStart + voiceDuration,
    });

    currentStart += totalSceneFrames;
  }

  // Función de Audio Ducking: baja el volumen de la música suavemente mientras la voz habla
  const computeDuckedVolume = (frame: number): number => {
    // Verificar si el fotograma actual coincide con voz activa
    let voiceActive = false;
    let minDistanceToTransition = 999;

    for (const interval of speechIntervals) {
      if (frame >= interval.start && frame < interval.end) {
        voiceActive = true;
        // Distancia hacia el inicio o fin del habla
        minDistanceToTransition = Math.min(
          frame - interval.start,
          interval.end - frame
        );
        break;
      }
    }

    const duckedVol = baseMusicVol * 0.45; // ~0.05 cuando habla la voz
    const fullVol = baseMusicVol * 1.25; // ~0.15 durante pausas

    // Suavizado en las transiciones de habla (fade in/out de 8 fotogramas)
    if (minDistanceToTransition < 8) {
      const progress = minDistanceToTransition / 8;
      return voiceActive
        ? interpolate(progress, [0, 1], [fullVol, duckedVol])
        : interpolate(progress, [0, 1], [duckedVol, fullVol]);
    }

    return voiceActive ? duckedVol : fullVol;
  };

  return (
    <div style={{ flex: 1, backgroundColor: "#000000" }}>
      {/* 1. Música de fondo continua en bucle con Audio Ducking automático */}
      {musicPath && (
        <SafeAudio src={musicPath} volume={computeDuckedVolume} loop={true} />
      )}

      {/* 2. Secuencia continua de escenas */}
      <Series>
        {story.scenes.map((scene) => {
          const sceneSubs = (subtitlesData.scenes as Record<string, any>)?.[
            String(scene.id)
          ];
          const durationInFrames =
            sceneSubs?.durationInFrames ||
            Math.ceil(scene.durationInSeconds * story.fps);

          return (
            <Series.Sequence
              key={scene.id}
              durationInFrames={durationInFrames}
            >
              <Scene scene={scene} volumes={story.volumes} />
            </Series.Sequence>
          );
        })}
      </Series>
    </div>
  );
};
