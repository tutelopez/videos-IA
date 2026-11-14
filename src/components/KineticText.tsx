import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_TITLE, FONT_BODY } from "../fonts";
import subtitlesData from "../data/subtitles.json";

interface KineticTextProps {
  sceneId: number;
  text: string;
  highlightWords: string[];
  badge?: string;
  durationInFrames: number;
}

interface SyncedWord {
  word: string;
  start: number;
  end: number;
  startFrame: number;
}

export const KineticText: React.FC<KineticTextProps> = ({
  sceneId,
  text,
  highlightWords,
  badge,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Obtener las marcas de tiempo sincronizadas con Edge-TTS para esta escena
  const sceneSubs = (subtitlesData.scenes as Record<string, any>)?.[String(sceneId)];
  const syncedWords: SyncedWord[] | undefined = sceneSubs?.words;

  // Normalizador de palabras para comparar resaltados sin importar signos
  const normalize = (w: string) =>
    w.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()¿?¡!]/g, "").trim();

  const normalizedHighlights = highlightWords.map(normalize);

  // Animación del Badge superior
  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Lista de palabras a renderizar (priorizamos las sincronizadas)
  const wordsToRender: Array<{
    word: string;
    startFrame: number;
    endFrame?: number;
  }> = syncedWords && syncedWords.length > 0
    ? syncedWords.map((sw) => ({
        word: sw.word,
        startFrame: sw.startFrame,
        endFrame: Math.round(sw.end * fps),
      }))
    : text.split(/\s+/).filter(Boolean).map((w, index, arr) => {
        // Fallback por intervalo si aún no se generó voz
        const animDuration = Math.max(20, Math.floor(durationInFrames * 0.7));
        const interval = animDuration / Math.max(arr.length, 1);
        return {
          word: w,
          startFrame: Math.round(index * interval),
        };
      });

  // Agrupar en páginas de ritmo rápido (máximo 5-6 palabras = 2 líneas por pantalla)
  const chunks: Array<Array<(typeof wordsToRender)[0]>> = [];
  let currentChunk: Array<(typeof wordsToRender)[0]> = [];

  for (let i = 0; i < wordsToRender.length; i++) {
    const item = wordsToRender[i];
    currentChunk.push(item);
    const hasPunctuation =
      item.word.endsWith(".") ||
      item.word.endsWith(";") ||
      item.word.endsWith(":") ||
      item.word.endsWith("!");

    // Cortar si llegamos a 6 palabras o si hay puntuación tras 3 o más palabras
    if (
      currentChunk.length >= 6 ||
      (hasPunctuation && currentChunk.length >= 3 && i < wordsToRender.length - 1)
    ) {
      chunks.push(currentChunk);
      currentChunk = [];
    }
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  // Identificar el fragmento activo en el fotograma actual
  let activeChunk = chunks[0] || [];
  for (let c = 0; c < chunks.length; c++) {
    const chunkStart = chunks[c][0].startFrame;
    if (frame >= chunkStart) {
      activeChunk = chunks[c];
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "0 60px",
        zIndex: 20,
        boxSizing: "border-box",
      }}
    >
      {badge && (
        <div
          style={{
            transform: `scale(${badgeSpring})`,
            opacity: badgeSpring,
            backgroundColor: "#FBBF24",
            color: "#0B132B",
            fontFamily: FONT_TITLE,
            fontSize: "32px",
            letterSpacing: "3px",
            padding: "8px 26px",
            borderRadius: "40px",
            fontWeight: "bold",
            marginBottom: "30px",
            boxShadow: "0 8px 24px rgba(251, 191, 36, 0.4)",
            textTransform: "uppercase",
          }}
        >
          {badge}
        </div>
      )}

      {/* Contenedor del texto cinético (máximo 2 líneas activas por pantalla) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "14px 20px",
          textAlign: "center",
          maxWidth: "960px",
        }}
      >
        {activeChunk.map((item, index) => {
          const wordFrame = frame - item.startFrame;

          // Si la voz aún no ha pronunciado esta palabra, se mantiene invisible
          if (wordFrame < 0) {
            return (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  opacity: 0,
                  fontSize: "72px",
                  lineHeight: "1.15",
                  userSelect: "none",
                }}
              >
                {item.word}
              </span>
            );
          }

          // Animación elástica (spring) en el instante exacto en que la voz dice la palabra
          const wordSpring = spring({
            frame: wordFrame,
            fps,
            config: {
              damping: 11,
              stiffness: 240,
              mass: 0.5,
            },
          });

          const scale = interpolate(wordSpring, [0, 1], [0.35, 1]);
          const opacity = interpolate(wordSpring, [0, 1], [0, 1]);

          const cleanWord = normalize(item.word);
          const isHighlighted = normalizedHighlights.includes(cleanWord);

          // Comprobar si la palabra está siendo dicha en este fotograma exacto
          const isCurrentlySpeaking =
            item.endFrame !== undefined &&
            frame >= item.startFrame &&
            frame <= item.endFrame;

          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                transform: `scale(${scale * (isCurrentlySpeaking ? 1.08 : 1)})`,
                opacity,
                fontFamily: isHighlighted ? FONT_TITLE : FONT_BODY,
                fontSize: isHighlighted ? "78px" : "72px",
                fontWeight: isHighlighted ? "900" : "800",
                color: isHighlighted
                  ? "#FCD34D"
                  : isCurrentlySpeaking
                  ? "#FEF08A"
                  : "#FFFFFF",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                lineHeight: "1.15",
                transition: "transform 0.05s ease-out",
                // Contorno oscuro nítido y sombra
                textShadow: isHighlighted
                  ? `0 0 25px rgba(252, 211, 77, 0.75),
                     -3px -3px 0 #000, 3px -3px 0 #000,
                     -3px 3px 0 #000, 3px 3px 0 #000,
                     0 6px 16px rgba(0,0,0,0.9)`
                  : isCurrentlySpeaking
                  ? `0 0 20px rgba(254, 240, 138, 0.8),
                     -3px -3px 0 #000, 3px -3px 0 #000,
                     -3px 3px 0 #000, 3px 3px 0 #000,
                     0 6px 16px rgba(0,0,0,0.95)`
                  : `-3px -3px 0 #000, 3px -3px 0 #000,
                     -3px 3px 0 #000, 3px 3px 0 #000,
                     0 6px 16px rgba(0,0,0,0.85)`,
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
