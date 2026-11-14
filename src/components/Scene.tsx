import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SceneData, AudioVolumes } from "../data/story";
import { KineticText } from "./KineticText";
import { Silhouette } from "./Silhouette";
import { LottieCharacter } from "./LottieCharacter";
import { getLottieData } from "../data/lottieLoader";
import { SafeAudio } from "./SafeAudio";
import { getSfxPath } from "../data/sfxLibrary";
import subtitlesData from "../data/subtitles.json";
import { FONT_BODY } from "../fonts";

interface SceneProps {
  scene: SceneData;
  volumes?: AudioVolumes;
}

export const Scene: React.FC<SceneProps> = ({ scene, volumes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Configuración de volúmenes (voz 1.0, sfx 0.5 por defecto)
  const voiceVolume = volumes?.voice ?? 1.0;
  const sfxVolume = volumes?.sfx ?? 0.5;

  // Obtener datos de audio y duración sincronizados desde subtitles.json
  const sceneSubs = (subtitlesData.scenes as Record<string, any>)?.[
    String(scene.id)
  ];

  const durationInFrames =
    sceneSubs?.durationInFrames || Math.ceil(scene.durationInSeconds * fps);

  const audioPath = sceneSubs?.audioFile || `audio/scene_${scene.id}.mp3`;

  // 1. Efecto de sonido de entrada (whoosh por defecto si no se especifica)
  const entranceSfxName = scene.sfxEntrada ?? "whoosh";
  const entranceSfxPath = getSfxPath(entranceSfxName);

  // 2. Efectos de sonido activados por palabras (sfxEnPalabra o impacto automático en resaltadas)
  const normalize = (w: string) =>
    w.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()¿?¡!]/g, "").trim();

  const syncedWords = sceneSubs?.words as
    | Array<{ word: string; startFrame: number; end: number }>
    | undefined;

  const wordSfxTriggers: Array<{
    frame: number;
    sfxPath: string;
    word: string;
  }> = [];

  if (syncedWords && syncedWords.length > 0) {
    let lastTriggerFrame = -999;
    const explicitMap = new Map<string, string>();

    if (scene.sfxEnPalabra) {
      for (const item of scene.sfxEnPalabra) {
        explicitMap.set(normalize(item.palabra), item.efecto);
      }
    }

    const highlightSet = new Set(scene.highlightWords.map(normalize));

    for (const sw of syncedWords) {
      const clean = normalize(sw.word);
      let chosenEffect: string | null = null;

      if (explicitMap.has(clean)) {
        chosenEffect = explicitMap.get(clean)!;
      } else if (highlightSet.has(clean)) {
        // Efecto automático por defecto al aparecer una palabra resaltada
        chosenEffect = "impacto";
      }

      if (chosenEffect) {
        const sfxPath = getSfxPath(chosenEffect);
        // Evitar saturación acústica: espaciado mínimo de 12 fotogramas (~0.4s) salvo explícitos
        if (
          sfxPath &&
          (sw.startFrame - lastTriggerFrame >= 12 || explicitMap.has(clean))
        ) {
          wordSfxTriggers.push({
            frame: sw.startFrame,
            sfxPath,
            word: sw.word,
          });
          lastTriggerFrame = sw.startFrame;
        }
      }
    }
  }

  // Transición suave de entrada (fade-in) y salida (fade-out)
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  // Efecto Ken Burns suave
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.04], {
    extrapolateRight: "clamp",
  });

  const bgStyle: React.CSSProperties =
    scene.background.type === "gradient"
      ? {
          background: `linear-gradient(${
            scene.background.direction || "180deg"
          }, ${scene.background.colors.join(", ")})`,
        }
      : {
          backgroundColor: scene.background.colors[0] || "#0B132B",
        };

  return (
    <AbsoluteFill
      style={{
        ...bgStyle,
        opacity,
        overflow: "hidden",
        width: 1080,
        height: 1920,
      }}
    >
      {/* 1. Reproducción de la voz en off de la escena */}
      {audioPath && <SafeAudio src={audioPath} volume={voiceVolume} />}

      {/* 2. Efecto de sonido de entrada al inicio de la escena */}
      {entranceSfxPath && (
        <Sequence
          from={0}
          durationInFrames={Math.min(durationInFrames, fps * 2)}
          layout="none"
        >
          <SafeAudio src={entranceSfxPath} volume={sfxVolume} />
        </Sequence>
      )}

      {/* 3. Efectos disparados cuando la voz pronuncia palabras clave */}
      {wordSfxTriggers.map((trig, idx) => (
        <Sequence
          key={`sfx-${idx}-${trig.frame}`}
          from={trig.frame}
          durationInFrames={Math.min(durationInFrames - trig.frame, fps * 2)}
          layout="none"
        >
          <SafeAudio src={trig.sfxPath} volume={sfxVolume} />
        </Sequence>
      ))}

      {/* Imagen PNG de fondo (opcional, sustituye o superpone el degradado) */}
      {scene.sceneImage && (
        <Img
          src={staticFile(`scenes/${scene.sceneImage}`)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: scene.imageOpacity ?? 0.85,
          }}
        />
      )}

      {/* Contenedor visual con zoom suave */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {scene.visualAtmosphere === "stars" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "60%",
              backgroundImage: `radial-gradient(2px 2px at 150px 200px, #FFF, rgba(0,0,0,0)),
                radial-gradient(3px 3px at 300px 350px, #FCD34D, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 550px 180px, #FFF, rgba(0,0,0,0)),
                radial-gradient(3px 3px at 800px 280px, #FDE68A, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 950px 420px, #FFF, rgba(0,0,0,0)),
                radial-gradient(3px 3px at 450px 480px, #FCD34D, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 200px 550px, #FFF, rgba(0,0,0,0))`,
              opacity: 0.75,
            }}
          />
        )}

        {scene.visualAtmosphere === "sunbeam" && (
          <div
            style={{
              position: "absolute",
              top: -100,
              left: "50%",
              transform: "translateX(-50%)",
              width: 1200,
              height: 1200,
              background:
                "radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(251, 191, 36, 0.05) 50%, rgba(0,0,0,0) 75%)",
              pointerEvents: "none",
            }}
          />
        )}

        {scene.visualAtmosphere === "glow" && (
          <div
            style={{
              position: "absolute",
              bottom: 300,
              left: "50%",
              transform: "translateX(-50%)",
              width: 900,
              height: 700,
              background:
                "radial-gradient(ellipse at center, rgba(234, 179, 8, 0.22) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 80%)",
              pointerEvents: "none",
            }}
          />
        )}

        {scene.visualAtmosphere === "lightning" && (
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "#FFFFFF",
                opacity: interpolate(
                  frame,
                  [8, 10, 12, 14, 18, 22],
                  [0, 0.85, 0.1, 0.7, 0.15, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                ),
                pointerEvents: "none",
                zIndex: 5,
              }}
            />
            {frame >= 9 && frame <= 18 && (
              <svg
                style={{
                  position: "absolute",
                  top: 0,
                  left: "35%",
                  width: "350px",
                  height: "750px",
                  zIndex: 6,
                  filter: "drop-shadow(0 0 25px #FFF)",
                }}
                viewBox="0 0 300 700"
                fill="none"
              >
                <polyline
                  points="160,0 120,180 180,220 100,400 150,430 70,660"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="160,0 120,180 180,220 100,400 150,430 70,660"
                  stroke="#FDE047"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </>
        )}

        {scene.character && (
          scene.character.useLottie &&
          scene.character.lottieFile &&
          getLottieData(scene.character.lottieFile) ? (
            <LottieCharacter
              lottieFile={scene.character.lottieFile}
              animationData={getLottieData(scene.character.lottieFile) as any}
              position={scene.character.position}
              scale={scene.character.scale}
              flip={scene.character.flip}
            />
          ) : (
            <Silhouette
              type={scene.character.type}
              position={scene.character.position}
              scale={scene.character.scale}
              flip={scene.character.flip}
            />
          )
        )}
      </div>

      {/* Texto Cinético */}
      <div
        style={{
          position: "absolute",
          top: "240px",
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 30,
        }}
      >
        <KineticText
          sceneId={scene.id}
          text={scene.text}
          highlightWords={scene.highlightWords}
          badge={scene.badge}
          durationInFrames={durationInFrames}
        />
      </div>

      {/* Viñeta cinematográfica */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          boxShadow: "inset 0 0 140px rgba(0, 0, 0, 0.65)",
          pointerEvents: "none",
          zIndex: 40,
        }}
      />

      {/* Texto pequeño inferior (ej: cita bíblica "1 Samuel 17") */}
      {scene.footer && (
        <div
          style={{
            position: "absolute",
            bottom: "45px",
            width: "100%",
            textAlign: "center",
            fontFamily: FONT_BODY,
            fontSize: "26px",
            fontWeight: "700",
            letterSpacing: "4px",
            color: "#FCD34D",
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0,0,0,0.95), -2px -2px 0 #000, 2px 2px 0 #000",
            zIndex: 45,
          }}
        >
          {scene.footer}
        </div>
      )}
    </AbsoluteFill>
  );
};
