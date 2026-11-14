import storyData from "./story.json";

export type CharacterType = 'pastor' | 'guerrero' | 'tunica' | 'multitud' | 'duelo' | 'none';

export interface SfxTrigger {
  palabra: string;
  efecto: string; // ej: 'impacto', 'trueno', 'campana', 'brillo', 'pop', 'whoosh', 'suspenso'
}

export interface AudioVolumes {
  voice?: number; // volumen de la voz en off (default: 1.0)
  sfx?: number; // volumen de los efectos de sonido (default: 0.5)
  music?: number; // volumen base de la música de fondo (default: 0.12)
}

export interface SceneData {
  id: number;
  durationInSeconds: number;
  badge?: string;
  text: string;
  highlightWords: string[];
  background: {
    type: 'gradient' | 'solid';
    colors: string[];
    direction?: string;
  };
  character?: {
    type: CharacterType;
    position?: 'center' | 'left' | 'right';
    scale?: number;
    flip?: boolean;
    useLottie?: boolean; // Activar animación Lottie si está disponible
    lottieFile?: string; // Nombre del archivo .json en public/lottie/
  };
  visualAtmosphere?: 'stars' | 'sunbeam' | 'glow' | 'lightning' | 'none';
  sfxEntrada?: string; // Efecto de sonido al entrar la escena (default: 'whoosh')
  sfxEnPalabra?: SfxTrigger[]; // Disparar efectos cuando la voz diga ciertas palabras
  footer?: string; // Texto pequeño en la parte inferior (ej: "1 Samuel 17")
  sceneImage?: string; // Nombre del archivo PNG en public/scenes/ (ej: "scene_1.png")
  imageOpacity?: number; // Opacidad de la imagen sobre el fondo degradado (0-1, default: 0.85)
}

export interface Story {
  title: string;
  fps: number;
  voice?: string;
  backgroundMusic?: string; // Ruta de la música de fondo (default: 'music/background.mp3')
  volumes?: AudioVolumes;
  scenes: SceneData[];
}

export const defaultStory = storyData as Story;
