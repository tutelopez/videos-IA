import React from "react";
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface LottieCharacterProps {
  lottieFile: string; // Nombre del archivo .json en public/lottie/
  animationData: LottieAnimationData | null; // Datos del JSON Lottie (cargados externamente)
  position?: "center" | "left" | "right";
  scale?: number;
  flip?: boolean;
}

/**
 * Componente para renderizar personajes animados con Lottie.
 * Si animationData es null, muestra un mensaje de advertencia en desarrollo.
 */
export const LottieCharacter: React.FC<LottieCharacterProps> = ({
  lottieFile,
  animationData,
  position = "center",
  scale = 1,
  flip = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!animationData) {
    // No rompe el render: solo emite un aviso en consola
    console.warn(
      `[LottieCharacter] No se encontró la animación: "${lottieFile}". ` +
        `Coloca el archivo .json en public/lottie/ y vuelve a ejecutar npm run dev.`
    );
    return null;
  }

  // Animación de entrada con spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const entryScale = scale * enterSpring;

  let alignStyle: React.CSSProperties = {
    left: "50%",
    transform: `translateX(-50%) scaleX(${flip ? -1 : 1}) scale(${entryScale})`,
  };

  if (position === "left") {
    alignStyle = {
      left: "5%",
      transform: `scaleX(${flip ? -1 : 1}) scale(${entryScale})`,
    };
  } else if (position === "right") {
    alignStyle = {
      right: "5%",
      transform: `scaleX(${flip ? -1 : 1}) scale(${entryScale})`,
    };
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        width: 480,
        height: 640,
        opacity,
        zIndex: 10,
        pointerEvents: "none",
        ...alignStyle,
      }}
    >
      <Lottie animationData={animationData as LottieAnimationData} loop playbackRate={1} />
    </div>
  );
};
