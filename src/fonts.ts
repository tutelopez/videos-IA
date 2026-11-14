import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

// Carga las tipografías oficiales de Google Fonts
const antonFont = loadAnton();
const montserratFont = loadMontserrat("normal", {
  weights: ["400", "600", "700", "900"],
});

export const FONT_TITLE = antonFont.fontFamily;
export const FONT_BODY = montserratFont.fontFamily;
