import React from "react";
import { Composition } from "remotion";
import { ReelComposition } from "./Composition";
import { defaultStory, Story } from "./data/story";
import subtitlesData from "./data/subtitles.json";

// Función utilitaria para calcular la duración exacta de una escena
export const getSceneFrames = (
  sceneId: number,
  fallbackSeconds: number,
  fps: number
): number => {
  const sceneSubs = (subtitlesData.scenes as Record<string, any>)?.[
    String(sceneId)
  ];
  return sceneSubs?.durationInFrames || Math.ceil(fallbackSeconds * fps);
};

// Duración total del reel sumando los fotogramas reales de cada escena
export const calculateTotalFrames = (story: Story): number => {
  return story.scenes.reduce(
    (total, scene) =>
      total + getSceneFrames(scene.id, scene.durationInSeconds, story.fps),
    0
  );
};

export const RemotionRoot: React.FC = () => {
  const totalFrames = calculateTotalFrames(defaultStory);

  return (
    <>
      <Composition
        id="BiblicalReel"
        component={ReelComposition}
        durationInFrames={totalFrames}
        fps={defaultStory.fps}
        width={1080}
        height={1920}
        defaultProps={{
          story: defaultStory,
        }}
        calculateMetadata={({ props }) => {
          const currentStory =
            (props as { story?: Story }).story || defaultStory;
          const frames = calculateTotalFrames(currentStory);
          return {
            durationInFrames: frames,
            fps: currentStory.fps,
            width: 1080,
            height: 1920,
          };
        }}
      />
    </>
  );
};
