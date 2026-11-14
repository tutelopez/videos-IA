export type SfxName =
  | "whoosh"
  | "impacto"
  | "trueno"
  | "campana"
  | "suspenso"
  | "brillo"
  | "pop";

export interface SfxItem {
  id: SfxName;
  name: string;
  file: string; // Ruta relativa dentro de public/
  defaultVolume: number;
  description: string;
}

export const SFX_LIBRARY: Record<SfxName, SfxItem> = {
  whoosh: {
    id: "whoosh",
    name: "Whoosh Suave",
    file: "sfx/whoosh.mp3",
    defaultVolume: 0.45,
    description: "Efecto de viento para entradas de texto y transiciones",
  },
  impacto: {
    id: "impacto",
    name: "Impacto Cinematográfico",
    file: "sfx/impacto.mp3",
    defaultVolume: 0.55,
    description: "Golpe contundente para palabras clave y énfasis",
  },
  trueno: {
    id: "trueno",
    name: "Trueno Profundo",
    file: "sfx/trueno.mp3",
    defaultVolume: 0.5,
    description: "Retumbo solemne para momentos épicos o de advertencia",
  },
  campana: {
    id: "campana",
    name: "Campana / Chime Solemne",
    file: "sfx/campana.mp3",
    defaultVolume: 0.4,
    description: "Tono reverberante para reflexiones o versículos finales",
  },
  suspenso: {
    id: "suspenso",
    name: "Tensión / Suspenso",
    file: "sfx/suspenso.mp3",
    defaultVolume: 0.4,
    description: "Atmósfera de incertidumbre ante el gigante o peligro",
  },
  brillo: {
    id: "brillo",
    name: "Brillo Celestial",
    file: "sfx/brillo.mp3",
    defaultVolume: 0.45,
    description: "Destello mágico/divino para momentos de fe y victoria",
  },
  pop: {
    id: "pop",
    name: "Pop Suave",
    file: "sfx/pop.mp3",
    defaultVolume: 0.35,
    description: "Efecto ágil para aparición de etiquetas o datos breves",
  },
};

/**
 * Obtiene la ruta del archivo de audio para un nombre de efecto.
 * Si no se encuentra en el mapa, retorna null.
 */
export const getSfxPath = (name: string): string | null => {
  const key = name.toLowerCase().trim() as SfxName;
  return SFX_LIBRARY[key]?.file || null;
};
