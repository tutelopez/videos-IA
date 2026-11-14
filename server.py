#!/usr/bin/env python3
"""
Servidor web FastAPI para el Estudio de Creación de Reels Bíblicos con IA.
Proporciona la API para generar historias con prompts, sintetizar voz con Edge-TTS,
editar escenas interactivamente y renderizar el MP4 con Remotion.
"""

import os
import sys
import json
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

PROJECT_ROOT = Path(__file__).resolve().parent
STORY_JSON = PROJECT_ROOT / "src" / "data" / "story.json"
SUBTITLES_JSON = PROJECT_ROOT / "src" / "data" / "subtitles.json"
OUT_DIR = PROJECT_ROOT / "out"
REEL_MP4 = OUT_DIR / "reel.mp4"
STUDIO_DIR = PROJECT_ROOT / "studio"

# Importar el generador de historias
sys.path.insert(0, str(PROJECT_ROOT / "scripts"))
from ai_story_generator import generate_story

app = FastAPI(title="Biblical Reels Studio API")

# Estado global de tareas
task_status = {
    "status": "idle",  # idle, generating_story, generating_voice, rendering, completed, error
    "message": "Listo para crear un nuevo reel bíblico",
    "progress": 0,
    "logs": []
}


def log(msg: str):
    print(f"[Studio] {msg}")
    task_status["logs"].append(msg)
    if len(task_status["logs"]) > 100:
        task_status["logs"].pop(0)


class GenerateStoryRequest(BaseModel):
    prompt: str
    voice: Optional[str] = "es-AR-TomasNeural"
    num_scenes: Optional[int] = 5
    api_key: Optional[str] = None


class SaveStoryRequest(BaseModel):
    story: Dict[str, Any]


@app.get("/api/status")
async def get_status():
    video_exists = REEL_MP4.exists()
    video_size_mb = round(REEL_MP4.stat().st_size / (1024 * 1024), 2) if video_exists else 0
    return {
        **task_status,
        "video_exists": video_exists,
        "video_size_mb": video_size_mb,
    }


@app.get("/api/story")
async def get_story():
    if not STORY_JSON.exists():
        raise HTTPException(status_code=404, detail="story.json no encontrado")
    with open(STORY_JSON, "r", encoding="utf-8") as f:
        return json.load(f)


@app.post("/api/generate-story")
async def api_generate_story(req: GenerateStoryRequest):
    global task_status
    task_status["status"] = "generating_story"
    task_status["message"] = f"Generando historia con IA para: '{req.prompt}'..."
    log(f"Generando historia con prompt: '{req.prompt}' ({req.num_scenes} escenas, voz: {req.voice})")

    try:
        story = generate_story(
            prompt=req.prompt,
            api_key=req.api_key,
            voice=req.voice or "es-AR-TomasNeural",
            num_scenes=req.num_scenes or 5
        )
        
        # Guardar automáticamente la nueva historia en story.json
        with open(STORY_JSON, "w", encoding="utf-8") as f:
            json.dump(story, f, indent=2, ensure_ascii=False)

        task_status["status"] = "idle"
        task_status["message"] = f"Historia '{story.get('title')}' generada exitosamente."
        log(f"Historia generada con {len(story.get('scenes', []))} escenas.")
        return {"success": True, "story": story}
    except Exception as e:
        task_status["status"] = "error"
        task_status["message"] = f"Error al generar historia: {str(e)}"
        log(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/save-story")
async def save_story(req: SaveStoryRequest):
    try:
        with open(STORY_JSON, "w", encoding="utf-8") as f:
            json.dump(req.story, f, indent=2, ensure_ascii=False)
        log("Historia guardada correctamente.")
        return {"success": True, "message": "Historia guardada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-voice")
async def api_generate_voice(background_tasks: BackgroundTasks):
    global task_status
    if task_status["status"] in ("generating_voice", "rendering"):
        return {"success": False, "message": "Ya hay una tarea en ejecución"}

    async def run_voice_task():
        global task_status
        task_status["status"] = "generating_voice"
        task_status["message"] = "Sintetizando voz en off y calculando tiempos de palabras con Edge-TTS..."
        task_status["progress"] = 25
        log("Iniciando generación de voz...")

        proc = await asyncio.create_subprocess_exec(
            str(PROJECT_ROOT / ".venv" / "bin" / "python"),
            str(PROJECT_ROOT / "scripts" / "generar_voz.py"),
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(PROJECT_ROOT)
        )

        stdout, stderr = await proc.communicate()
        if proc.returncode == 0:
            out_str = stdout.decode("utf-8")
            log(out_str.split("\n")[-3] if "\n" in out_str else "Voz completada.")
            task_status["status"] = "idle"
            task_status["progress"] = 50
            task_status["message"] = "Voz y tiempos generados exitosamente. Listo para renderizar."
        else:
            err_str = stderr.decode("utf-8")
            log(f"Error en voz: {err_str}")
            task_status["status"] = "error"
            task_status["message"] = "Error al sintetizar voz con Edge-TTS."

    background_tasks.add_task(run_voice_task)
    return {"success": True, "message": "Generación de voz iniciada"}


@app.post("/api/render-video")
async def api_render_video(background_tasks: BackgroundTasks):
    global task_status
    if task_status["status"] in ("generating_voice", "rendering"):
        return {"success": False, "message": "Ya hay una tarea en ejecución"}

    async def run_render_task():
        global task_status
        task_status["status"] = "rendering"
        task_status["message"] = "Renderizando reel final en MP4 (1080x1920 a 30 fps) con Remotion..."
        task_status["progress"] = 65
        log("Iniciando renderizado con Remotion...")

        OUT_DIR.mkdir(parents=True, exist_ok=True)

        proc = await asyncio.create_subprocess_exec(
            "npx", "remotion", "render", "BiblicalReel", "out/reel.mp4",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(PROJECT_ROOT)
        )

        stdout, stderr = await proc.communicate()
        if proc.returncode == 0:
            task_status["status"] = "completed"
            task_status["progress"] = 100
            task_status["message"] = "¡Video MP4 renderizado con éxito! Listo para reproducir y descargar."
            log("Render completado exitosamente: out/reel.mp4")
        else:
            err_str = stderr.decode("utf-8")
            log(f"Error en render: {err_str}")
            task_status["status"] = "error"
            task_status["message"] = "Error durante el renderizado con Remotion."

    background_tasks.add_task(run_render_task)
    return {"success": True, "message": "Renderizado iniciado"}


@app.get("/api/video")
async def get_video():
    if not REEL_MP4.exists():
        raise HTTPException(status_code=404, detail="El video aún no ha sido renderizado")
    return FileResponse(
        str(REEL_MP4),
        media_type="video/mp4",
        filename="reel_biblico.mp4"
    )


# Servir la interfaz web del Studio
@app.get("/", response_class=HTMLResponse)
async def serve_studio():
    index_file = STUDIO_DIR / "index.html"
    if not index_file.exists():
        return HTMLResponse("<h1>Studio no encontrado</h1>", status_code=404)
    with open(index_file, "r", encoding="utf-8") as f:
        return HTMLResponse(f.read())


if __name__ == "__main__":
    import uvicorn
    STUDIO_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print("\n" + "="*60)
    print("🎬 BIBLICAL REELS STUDIO INICIADO")
    print("👉 Abre en tu navegador: http://localhost:5000")
    print("="*60 + "\n")
    uvicorn.run("server:app", host="127.0.0.1", port=5000, reload=False)
