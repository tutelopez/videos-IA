#!/usr/bin/env python3
"""
generar_prompts.py
------------------
Lee src/data/imagePrompts.json y muestra los prompts formateados en la terminal
listos para copiar en Midjourney, DALL-E 3, Adobe Firefly o Gemini Image.
También verifica si los archivos PNG ya existen en public/scenes/.
"""

import json
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

PROMPTS_FILE = os.path.join(PROJECT_ROOT, "src", "data", "imagePrompts.json")
SCENES_DIR = os.path.join(PROJECT_ROOT, "public", "scenes")

# Colores ANSI
RESET  = "\033[0m"
BOLD   = "\033[1m"
GREEN  = "\033[92m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
RED    = "\033[91m"
GRAY   = "\033[90m"
BLUE   = "\033[94m"


def check_file(filename: str) -> tuple[bool, str]:
    """Retorna (existe, ruta_completa)."""
    path = os.path.join(SCENES_DIR, filename)
    return os.path.isfile(path), path


def separator(char="─", width=72, color=GRAY):
    print(f"{color}{char * width}{RESET}")


def main():
    if not os.path.isfile(PROMPTS_FILE):
        print(f"{RED}✗ No se encontró {PROMPTS_FILE}{RESET}")
        sys.exit(1)

    with open(PROMPTS_FILE, encoding="utf-8") as f:
        data = json.load(f)

    instructions = data.get("instructions", "")
    global_style = data.get("global_style_notes", {})
    scenes = data.get("scenes", {})

    print()
    separator("═", color=CYAN)
    print(f"{BOLD}{CYAN}  🎨 GENERADOR DE PROMPTS – Reels Bíblicos{RESET}")
    separator("═", color=CYAN)
    print(f"\n{GRAY}{instructions}{RESET}\n")

    print(f"{BOLD}Notas de estilo global:{RESET}")
    print(f"  • Relación de aspecto : {global_style.get('aspect_ratio', '')}")
    print(f"  • Resolución          : {global_style.get('resolution', '')}")
    print(f"  • Flags Midjourney    : {global_style.get('quality_flags_midjourney', '')}")
    print()

    all_found = True

    for scene_id, scene in scenes.items():
        filename = scene.get("filename", f"scene_{scene_id}.png")
        exists, full_path = check_file(filename)

        separator()
        status = f"{GREEN}✔ ENCONTRADO{RESET}" if exists else f"{YELLOW}✗ NO EXISTE AÚN{RESET}"
        print(f"{BOLD}ESCENA {scene_id}: {scene.get('title', '')}{RESET}  [{status}]")
        print(f"{GRAY}{scene.get('scene_description', '')}{RESET}")
        print(f"  Archivo esperado : {BLUE}public/scenes/{filename}{RESET}")
        print(f"  Opacidad sugerida: {scene.get('suggested_imageOpacity', 0.85)}")
        print()

        print(f"{BOLD}▶ PROMPT EN INGLÉS (recomendado para Midjourney / DALL-E 3):{RESET}")
        print(f"{CYAN}{scene.get('prompt_en', '')}{RESET}")
        print()

        print(f"{BOLD}▶ PROMPT EN ESPAÑOL (para Gemini Image / Adobe Firefly):{RESET}")
        print(f"{YELLOW}{scene.get('prompt_es', '')}{RESET}")
        print()

        print(f"{BOLD}▶ NEGATIVE PROMPT:{RESET}")
        print(f"{GRAY}{scene.get('negative_prompt', '')}{RESET}")
        print()

        print(f"{BOLD}Estilo / Paleta:{RESET} {scene.get('style', '')}")
        print(f"{BOLD}Mood:          {RESET} {scene.get('mood', '')}")

        if not exists:
            all_found = False

    separator("═", color=CYAN)

    # Resumen de estado de archivos
    print(f"\n{BOLD}Estado de imágenes en public/scenes/:{RESET}")
    for scene_id, scene in scenes.items():
        filename = scene.get("filename", f"scene_{scene_id}.png")
        exists, _ = check_file(filename)
        icon = f"{GREEN}✔{RESET}" if exists else f"{RED}✗{RESET}"
        label = "listo" if exists else "pendiente"
        print(f"  {icon}  {filename:20s}  {label}")

    print()
    if all_found:
        print(f"{GREEN}{BOLD}✅ Todas las imágenes están listas. Agrega 'sceneImage' en story.json para activarlas.{RESET}")
    else:
        print(f"{YELLOW}{BOLD}⚠  Genera las imágenes con los prompts de arriba y colócalas en public/scenes/{RESET}")
        print(f"{GRAY}   Luego agrega en story.json, dentro de cada escena:{RESET}")
        print(f'{GRAY}   "sceneImage": "scene_N.png", "imageOpacity": 0.85{RESET}')

    print()


if __name__ == "__main__":
    main()
