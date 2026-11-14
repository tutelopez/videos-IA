# Biblical Reels Studio 🎬✨

Generador automatizado de reels animados verticales (1080×1920 a 30 fps) de historias bíblicas y contenido cristiano, con estilo de ilustración vectorial plana, tipografía cinética sincronizada palabra por palabra, efectos de sonido y voz en off con IA.

Desarrollado con **Remotion (React + TypeScript)**, **Edge-TTS (Microsoft Neural Voices)**, **FastAPI** y **Tailwind CSS**.

---

## 🌟 Características

- 📱 **Formato Vertical Viral**: Renderizado nativo en 1080×1920 a 30 fps, optimizado para TikTok, Instagram Reels y YouTube Shorts.
- 🎨 **Ilustración Vectorial Volumétrica**: Siluetas bíblicas detalladas en SVG con gradientes cálidos, sombras proyectadas y ribete de luz dorada celestial (David, Goliat, el pastor con cayado, guerrero, orante con túnica y multitudes).
- ✍️ **Tipografía Cinética Inteligente**: Texto palabra por palabra animado con físicas `spring`, resaltado dinámico de palabras clave en amarillo/dorado cálido, y paginación rápida de máximo 2 líneas por pantalla.
- 🎙️ **Voz en Off Automática (Edge-TTS)**: Síntesis de voz neuronal en español (Argentina, México, España, Colombia) con extracción precisa de marcas de tiempo (`WordBoundary`) a nivel de milisegundos.
- 🎵 **Diseño de Audio & SFX**:
  - Efectos automáticos (whoosh al entrar escena, impacto en palabras clave).
  - Efectos configurables por palabra (truenos, campanas, suspenso, brillo celestial, pop).
  - Música de fondo continua en bucle con **Audio Ducking** automático (baja el volumen suavemente mientras la voz habla y sube durante las pausas).
- 💻 **Estudio Web Interactivo (`Biblical Reels Studio`)**: Interfaz web local (`http://localhost:5000`) para escribir prompts, editar escenas, sintetizar voces y renderizar videos MP4 con un solo clic.
- 🛡️ **Respeto Bíblico**: Sin representación facial de Dios ni de Jesús, y fiel a los textos bíblicos.

---

## 🚀 Inicio Rápido

### Requisitos previos
- **Node.js** v20 o superior
- **Python** 3.9 o superior

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tutelopez/biblical-reels.git
   cd biblical-reels
   ```

2. Instala las dependencias de Node.js:
   ```bash
   npm install
   ```

3. Crea el entorno virtual de Python e instala dependencias:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install edge-tts mutagen lameenc fastapi uvicorn
   ```

---

## 🎬 Modos de Uso

### 1. Interfaz Web (Biblical Reels Studio) — La forma más fácil

Inicia el estudio web:
```bash
npm run studio
```
Abre en tu navegador: **`http://localhost:5000`**

Desde allí puedes:
1. Escribir un tema bíblico (ej: *"Moisés y el Mar Rojo"* o *"Daniel en el foso de los leones"*).
2. Generar el guión y estructurar escenas automáticamente con IA.
3. Ajustar los textos y personajes en el editor visual.
4. Generar la voz en off con Edge-TTS.
5. Renderizar y descargar el video final en MP4 directamente en tu navegador.

---

### 2. Desde la Línea de Comandos (CLI)

```bash
# 1. Sintetizar la voz y calcular los tiempos de las escenas
npm run voz

# 2. Ver la vista previa interactiva en Remotion Studio (localhost:3000)
npm run dev

# 3. Renderizar el video final en MP4 (out/reel.mp4)
npm run render

# 4. Ver los prompts para generar fondos con IA en Midjourney / Gemini
npm run prompts
```

---

## 📁 Estructura del Proyecto

```
.
├── public/
│   ├── audio/           # Audios de voz en off (scene_1.mp3, etc.) y subtítulos
│   ├── sfx/             # Efectos de sonido (whoosh, impacto, trueno, etc.)
│   ├── music/           # Música de fondo ambiental
│   ├── scenes/          # Fondos de escena generados con IA (opcional)
│   └── lottie/          # Animaciones Lottie (opcional)
├── scripts/
│   ├── ai_story_generator.py     # Generador de historias con IA / plantillas
│   ├── generar_voz.py            # Síntesis con Edge-TTS y extracción de tiempos
│   ├── generar_efectos_muestra.py # Sintetizador de efectos MP4
│   └── generar_prompts.py        # Generador de prompts para fondos
├── src/
│   ├── components/
│   │   ├── KineticText.tsx       # Texto palabra por palabra y resaltado
│   │   ├── Scene.tsx             # Fondo, atmósfera, audio y transiciones
│   │   ├── Silhouette.tsx        # Personajes bíblicos ilustrados en SVG
│   │   ├── SafeAudio.tsx         # Reproductor de audio tolerante a fallos
│   │   └── LottieCharacter.tsx   # Soporte para personajes Lottie
│   ├── data/
│   │   ├── story.json            # Historia actual como datos (texto, personajes, sfx)
│   │   ├── subtitles.json        # Tiempos de palabras y duración real
│   │   └── sfxLibrary.ts         # Mapeo de biblioteca de efectos de sonido
│   ├── fonts.ts                  # Carga de Anton y Montserrat
│   ├── Composition.tsx           # Composición general y Audio Ducking
│   └── Root.tsx                  # Entrada de Remotion
├── studio/
│   └── index.html                # Interfaz web del estudio interactivo
├── server.py                     # Servidor FastAPI para el estudio web
└── package.json
```

---

## 📜 Licencia

Código bajo licencia MIT. Las historias bíblicas pertenecen al dominio público.
