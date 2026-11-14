#!/usr/bin/env python3
"""
Script para generar la voz en off de cada escena usando Edge-TTS (Microsoft Neural Voices).
Guarda los audios en public/audio/scene_{id}.mp3 y los tiempos de cada palabra en src/data/subtitles.json.
"""

import os
import sys
import json
import re
import asyncio
from pathlib import Path

try:
    import edge_tts
    from mutagen.mp3 import MP3
except ImportError:
    print("Error: edge-tts o mutagen no están instalados en el entorno virtual.")
    print("Ejecuta: .venv/bin/pip install edge-tts mutagen")
    sys.exit(1)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
STORY_JSON = PROJECT_ROOT / "src" / "data" / "story.json"
STORY_TS = PROJECT_ROOT / "src" / "data" / "story.ts"
SUBTITLES_JSON = PROJECT_ROOT / "src" / "data" / "subtitles.json"
AUDIO_DIR = PROJECT_ROOT / "public" / "audio"
AUDIO_SUBTITLES_JSON = AUDIO_DIR / "subtitles.json"

DEFAULT_VOICE = "es-AR-TomasNeural"
DEFAULT_FPS = 30
PAUSE_AFTER_SCENE = 0.5  # Pausa adicional de 0.5s tras el audio


def clean_word(word: str) -> str:
    """Elimina signos de puntuación para comparar palabras de forma limpia."""
    return re.sub(r"[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]", "", word).lower()


def load_story() -> dict:
    """Carga los datos de la historia desde story.json o story.ts."""
    if STORY_JSON.exists():
        with open(STORY_JSON, "r", encoding="utf-8") as f:
            return json.load(f)

    if STORY_TS.exists():
        with open(STORY_TS, "r", encoding="utf-8") as f:
            content = f.read()
        # Intentar extraer el objeto defaultStory
        match = re.search(r"defaultStory\s*(?::\s*\w+)?\s*=\s*(\{.*?\});", content, re.DOTALL)
        if match:
            # Reemplazar comillas simples y claves no entrecomilladas básico si fuera necesario
            try:
                return json.loads(match.group(1))
            except Exception:
                pass

    raise FileNotFoundError("No se encontró src/data/story.json ni una historia válida en src/data/story.ts")


def align_words(story_text: str, tts_events: list, fps: int) -> list:
    """
    Alinea las palabras del texto de la historia con los eventos WordBoundary de edge-tts.
    Garantiza que cada palabra tenga un start, end y startFrame precisos.
    """
    story_words = story_text.split()
    aligned = []
    tts_idx = 0

    for sw in story_words:
        c_sw = clean_word(sw)
        matched = False

        for j in range(tts_idx, len(tts_events)):
            c_tts = clean_word(tts_events[j]["text"])
            if c_sw == c_tts or (c_tts and c_tts in c_sw) or (c_sw and c_sw in c_tts):
                start_sec = tts_events[j]["start"]
                end_sec = tts_events[j]["end"]
                aligned.append({
                    "word": sw,
                    "start": round(start_sec, 3),
                    "end": round(end_sec, 3),
                    "startFrame": int(round(start_sec * fps)),
                })
                tts_idx = j + 1
                matched = True
                break

        if not matched:
            # Fallback si no hubo coincidencia directa
            prev_start = aligned[-1]["start"] + 0.28 if aligned else 0.05
            aligned.append({
                "word": sw,
                "start": round(prev_start, 3),
                "end": round(prev_start + 0.25, 3),
                "startFrame": int(round(prev_start * fps)),
            })

    return aligned


async def process_scene(scene: dict, voice: str, fps: int) -> dict:
    """Genera el audio MP3 para una escena y extrae los word boundaries."""
    scene_id = scene["id"]
    text = scene["text"]
    audio_filename = f"scene_{scene_id}.mp3"
    audio_path = AUDIO_DIR / audio_filename

    print(f"🎙️  Generando audio para Escena {scene_id} con voz '{voice}'...")
    communicate = edge_tts.Communicate(text, voice, boundary="WordBoundary")

    tts_events = []
    audio_data = bytearray()

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            # offset y duration vienen en ticks (1 tick = 100 ns = 0.1 µs)
            start_sec = chunk["offset"] / 10_000_000
            dur_sec = chunk["duration"] / 10_000_000
            tts_events.append({
                "text": chunk["text"],
                "start": start_sec,
                "end": start_sec + dur_sec,
            })

    # Guardar el archivo MP3
    with open(audio_path, "wb") as f:
        f.write(audio_data)

    # Medir la duración real del archivo MP3
    try:
        audio = MP3(audio_path)
        actual_duration = float(audio.info.length)
    except Exception:
        # Fallback a la duración estimada por los eventos
        actual_duration = tts_events[-1]["end"] if tts_events else 3.0

    total_duration = actual_duration + PAUSE_AFTER_SCENE
    duration_frames = int(round(total_duration * fps))

    # Alinear palabras
    words_data = align_words(text, tts_events, fps)

    print(f"   ✓ Audio guardado: public/audio/{audio_filename}")
    print(f"   ✓ Duración de voz: {actual_duration:.2f}s (+ {PAUSE_AFTER_SCENE}s pausa) = {total_duration:.2f}s ({duration_frames} frames)")

    return {
        "id": scene_id,
        "audioFile": f"audio/{audio_filename}",
        "audioDuration": round(actual_duration, 3),
        "pauseDuration": PAUSE_AFTER_SCENE,
        "totalDuration": round(total_duration, 3),
        "durationInFrames": duration_frames,
        "words": words_data,
    }


async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    story = load_story()
    voice = story.get("voice", DEFAULT_VOICE)
    fps = story.get("fps", DEFAULT_FPS)
    scenes = story.get("scenes", [])

    print(f"=== Generador de Voz con Edge-TTS ===")
    print(f"Título: {story.get('title', 'Reel')}")
    print(f"Voz configurada: {voice}")
    print(f"FPS: {fps}")
    print(f"Total de escenas: {len(scenes)}\n")

    subtitles_data = {
        "voice": voice,
        "fps": fps,
        "scenes": {},
    }

    total_video_frames = 0
    total_video_seconds = 0.0

    for scene in scenes:
        scene_result = await process_scene(scene, voice, fps)
        subtitles_data["scenes"][str(scene["id"])] = scene_result
        total_video_frames += scene_result["durationInFrames"]
        total_video_seconds += scene_result["totalDuration"]

    # Guardar archivo de subtítulos y tiempos para Remotion
    with open(SUBTITLES_JSON, "w", encoding="utf-8") as f:
        json.dump(subtitles_data, f, ensure_ascii=False, indent=2)

    with open(AUDIO_SUBTITLES_JSON, "w", encoding="utf-8") as f:
        json.dump(subtitles_data, f, ensure_ascii=False, indent=2)

    # Actualizar el índice de archivos de audio disponibles (SafeAudio)
    sync_available_audio()

    print("\n✅ ¡Todos los audios y tiempos han sido generados exitosamente!")
    print(f"📄 Archivo de sincronización guardado en: src/data/subtitles.json")
    print(f"⏱️  Duración total del video ajustada: {total_video_seconds:.2f}s ({total_video_frames} frames)")


def sync_available_audio():
    """Escanea la carpeta public/ para actualizar availableAudio.json y evitar errores de render."""
    sfx_dir = PROJECT_ROOT / "public" / "sfx"
    music_dir = PROJECT_ROOT / "public" / "music"
    audio_dir = PROJECT_ROOT / "public" / "audio"
    avail_file = PROJECT_ROOT / "src" / "data" / "availableAudio.json"

    data = {
        "sfx": [f.name for f in sfx_dir.glob("*") if f.is_file()],
        "music": [f.name for f in music_dir.glob("*") if f.is_file()],
        "audio": [f.name for f in audio_dir.glob("*") if f.is_file() and f.suffix in (".mp3", ".wav")],
    }
    with open(avail_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print("📁 Índice de sonidos sincronizado en: src/data/availableAudio.json")


if __name__ == "__main__":
    asyncio.run(main())
