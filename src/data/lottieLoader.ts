/**
 * Cargador de animaciones Lottie para personajes bíblicos.
 * Importa los JSON de animación de forma segura.
 * Para agregar una nueva animación:
 * 1. Coloca el .json en public/lottie/
 * 2. Importa aquí con try/catch o import dinámico
 * 3. Agrega al mapa LOTTIE_ANIMATIONS
 */

// Mapa de animaciones disponibles (nombre -> datos JSON importados)
// Cuando descargues un archivo Lottie, descomenta la línea correspondiente
// y agrega la importación estática arriba.
export const LOTTIE_ANIMATIONS: Record<string, object | null> = {
  // Descomenta cuando tengas los archivos:
  // "pastor_anim.json": pastorData,
  // "guerrero_anim.json": guerreroData,
  // "tunica_anim.json": tunicaData,
  // "multitud_anim.json": multitudData,
};

/**
 * Obtiene los datos de una animación Lottie por nombre de archivo.
 * Retorna null si el archivo no está cargado (no rompe el render).
 */
export const getLottieData = (filename: string): object | null => {
  return LOTTIE_ANIMATIONS[filename] ?? null;
};
