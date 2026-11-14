import React from "react";
import { Audio, staticFile } from "remotion";
import availableAudio from "../data/availableAudio.json";

interface SafeAudioProps {
  src: string; // Ruta relativa dentro de public/ (ej: "sfx/whoosh.mp3", "music/background.mp3")
  volume?: number | ((frame: number) => number);
  loop?: boolean;
}

/**
 * Componente de audio seguro.
 * Verifica si el archivo de sonido existe en la carpeta public/ antes de intentar cargarlo.
 * Si el archivo no existe, emite una advertencia en la consola y no rompe el render del video.
 */
export const SafeAudio: React.FC<SafeAudioProps> = ({ src, volume = 1, loop = false }) => {
  const cleanPath = src.replace(/^\//, "");
  const parts = cleanPath.split("/");
  const folder = parts[0] as keyof typeof availableAudio;
  const filename = parts.slice(1).join("/");

  const folderFiles = (availableAudio as Record<string, string[]>)[folder];
  const fileExists = folderFiles && folderFiles.includes(filename);

  if (!fileExists) {
    console.warn(
      `[Audio Advertencia] Archivo de sonido no encontrado: "${src}". Se omite la reproducción para evitar errores en el render.`
    );
    return null;
  }

  return <Audio src={staticFile(cleanPath)} volume={volume} loop={loop} />;
};
