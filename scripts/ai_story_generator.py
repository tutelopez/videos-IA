#!/usr/bin/env python3
"""
Módulo de generación de historias bíblicas estructuradas para Reels.
Soporta:
1. Gemini API (si se provee una clave o está en el entorno).
2. Generador inteligente sin API key (con catálogo bíblico enriquecido y parser para cualquier tema).
"""

import os
import json
import re
import urllib.request
import urllib.error
from typing import Optional, Dict, Any

BUILTIN_STORIES = {
    "david": {
        "title": "David y Goliat (1 Samuel 17)",
        "badge": "1 SAMUEL 17",
        "scenes": [
            {
                "id": 1,
                "durationInSeconds": 4,
                "badge": "1 SAMUEL 17",
                "text": "Un adolescente. Sin armadura. Contra un gigante.",
                "highlightWords": ["gigante", "gigante."],
                "sfxEntrada": "trueno",
                "sfxEnPalabra": [{"palabra": "gigante", "efecto": "impacto"}],
                "background": {"type": "gradient", "colors": ["#050814", "#0C1527", "#152238"], "direction": "180deg"},
                "character": {"type": "duelo", "position": "center", "scale": 1},
                "visualAtmosphere": "lightning"
            },
            {
                "id": 2,
                "durationInSeconds": 5,
                "badge": "EL DESAFÍO",
                "text": "Durante cuarenta días, Goliat desafió al ejército de Israel. Nadie se atrevió a enfrentarlo.",
                "highlightWords": ["cuarenta", "días,", "cuarenta días"],
                "sfxEntrada": "suspenso",
                "sfxEnPalabra": [{"palabra": "Goliat", "efecto": "whoosh"}, {"palabra": "Nadie", "efecto": "whoosh"}],
                "background": {"type": "gradient", "colors": ["#1C1410", "#2E1E16", "#141824"], "direction": "180deg"},
                "character": {"type": "multitud", "position": "center", "scale": 0.95},
                "visualAtmosphere": "glow"
            },
            {
                "id": 3,
                "durationInSeconds": 5,
                "badge": "EL GIGANTE",
                "text": "Era un guerrero de Gat, de casi tres metros según el texto hebreo, cubierto de bronce.",
                "highlightWords": ["tres", "metros", "tres metros"],
                "sfxEntrada": "whoosh",
                "sfxEnPalabra": [{"palabra": "tres", "efecto": "impacto"}],
                "background": {"type": "gradient", "colors": ["#1A0E18", "#2B1624", "#120B16"], "direction": "180deg"},
                "character": {"type": "guerrero", "position": "center", "scale": 1.25},
                "visualAtmosphere": "glow"
            },
            {
                "id": 4,
                "durationInSeconds": 5,
                "badge": "EL PASTOR",
                "text": "David, un joven pastor, solo iba a llevarle comida a sus hermanos. Y escuchó el desafío.",
                "highlightWords": ["pastor", "pastor,"],
                "sfxEntrada": "pop",
                "sfxEnPalabra": [{"palabra": "pastor", "efecto": "pop"}, {"palabra": "desafío", "efecto": "whoosh"}],
                "background": {"type": "gradient", "colors": ["#0E2018", "#1E2F1A", "#14222A"], "direction": "180deg"},
                "character": {"type": "pastor", "position": "center", "scale": 1},
                "visualAtmosphere": "stars"
            },
            {
                "id": 5,
                "durationInSeconds": 5,
                "badge": "LA ARMADURA",
                "text": "El rey Saúl le ofreció su armadura. Pero a David le pesaba, y se la quitó.",
                "highlightWords": ["se", "la", "quitó", "quitó.", "se la quitó"],
                "sfxEntrada": "whoosh",
                "sfxEnPalabra": [{"palabra": "quitó", "efecto": "impacto"}],
                "background": {"type": "gradient", "colors": ["#1F1612", "#332318", "#1A151A"], "direction": "180deg"},
                "character": {"type": "pastor", "position": "center", "scale": 1},
                "visualAtmosphere": "glow"
            },
            {
                "id": 6,
                "durationInSeconds": 5,
                "badge": "EL ARROYO",
                "text": "Eligió cinco piedras lisas del arroyo. Su honda. Y su bastón.",
                "highlightWords": ["cinco", "piedras", "cinco piedras"],
                "sfxEntrada": "whoosh",
                "sfxEnPalabra": [{"palabra": "cinco", "efecto": "pop"}, {"palabra": "piedras", "efecto": "pop"}],
                "background": {"type": "gradient", "colors": ["#0F1B26", "#192B38", "#12202C"], "direction": "180deg"},
                "character": {"type": "pastor", "position": "center", "scale": 1},
                "visualAtmosphere": "stars"
            },
            {
                "id": 7,
                "durationInSeconds": 6,
                "badge": "LA FE",
                "text": "Goliat se burló. David respondió: tú vienes con espada y lanza; yo vengo en el nombre del Señor.",
                "highlightWords": ["en", "el", "nombre", "del", "Señor", "Señor."],
                "sfxEntrada": "suspenso",
                "sfxEnPalabra": [{"palabra": "Señor", "efecto": "brillo"}, {"palabra": "espada", "efecto": "whoosh"}],
                "background": {"type": "gradient", "colors": ["#0B142B", "#1C2541", "#241A30"], "direction": "180deg"},
                "character": {"type": "duelo", "position": "center", "scale": 1.05},
                "visualAtmosphere": "glow"
            },
            {
                "id": 8,
                "durationInSeconds": 5,
                "badge": "LA VICTORIA",
                "text": "Una piedra. Un solo tiro. Y el gigante cayó.",
                "highlightWords": ["cayó", "cayó."],
                "sfxEntrada": "whoosh",
                "sfxEnPalabra": [{"palabra": "cayó", "efecto": "impacto"}],
                "background": {"type": "gradient", "colors": ["#1A0C12", "#2B141C", "#0D0914"], "direction": "180deg"},
                "character": {"type": "guerrero", "position": "center", "scale": 1.15},
                "visualAtmosphere": "glow"
            },
            {
                "id": 9,
                "durationInSeconds": 5,
                "badge": "REFLEXIÓN",
                "text": "Tu gigante puede parecer enorme. Pero Dios no te pide armadura, te pide fe. Sígueme para más historias de la Biblia.",
                "highlightWords": ["fe", "fe."],
                "footer": "1 Samuel 17",
                "sfxEntrada": "brillo",
                "sfxEnPalabra": [{"palabra": "fe", "efecto": "campana"}],
                "background": {"type": "gradient", "colors": ["#081224", "#152846", "#1D3557"], "direction": "180deg"},
                "character": {"type": "tunica", "position": "center", "scale": 1},
                "visualAtmosphere": "sunbeam"
            }
        ]
    },
    "moises": {
        "title": "Moisés y el Mar Rojo (Éxodo 14)",
        "badge": "ÉXODO 14",
        "scenes": [
            {
                "id": 1,
                "durationInSeconds": 4,
                "badge": "ÉXODO 14",
                "text": "Atrapados entre el ejército egipcio y un mar infinito. Sin salida humana.",
                "highlightWords": ["Atrapados", "mar", "infinito."],
                "sfxEntrada": "trueno",
                "sfxEnPalabra": [{"palabra": "infinito", "efecto": "suspenso"}],
                "background": {"type": "gradient", "colors": ["#080C1A", "#141C30"], "direction": "180deg"},
                "character": {"type": "multitud", "position": "center", "scale": 0.95},
                "visualAtmosphere": "lightning"
            },
            {
                "id": 2,
                "durationInSeconds": 5,
                "badge": "EL CLAMOR",
                "text": "El pueblo tembló de pánico. Pero Moisés dijo: No teman; vean la salvación de Dios.",
                "highlightWords": ["No", "teman;", "salvación", "Dios."],
                "sfxEntrada": "suspenso",
                "sfxEnPalabra": [{"palabra": "Dios", "efecto": "brillo"}],
                "background": {"type": "gradient", "colors": ["#1A1612", "#2E241A"], "direction": "180deg"},
                "character": {"type": "tunica", "position": "center", "scale": 1},
                "visualAtmosphere": "glow"
            },
            {
                "id": 3,
                "durationInSeconds": 5,
                "badge": "EL CAYADO",
                "text": "Moisés alzó su cayado sobre las aguas. Un viento poderoso sopló toda la noche.",
                "highlightWords": ["cayado", "aguas.", "viento", "poderoso"],
                "sfxEntrada": "whoosh",
                "sfxEnPalabra": [{"palabra": "viento", "efecto": "whoosh"}, {"palabra": "aguas", "efecto": "impacto"}],
                "background": {"type": "gradient", "colors": ["#0F1E28", "#1A3240"], "direction": "180deg"},
                "character": {"type": "pastor", "position": "center", "scale": 1},
                "visualAtmosphere": "stars"
            },
            {
                "id": 4,
                "durationInSeconds": 5,
                "badge": "EL MILAGRO",
                "text": "El mar se partió en dos murallas líquidas. Y el pueblo cruzó en tierra seca.",
                "highlightWords": ["mar", "se", "partió", "tierra", "seca."],
                "sfxEntrada": "whoosh",
                "sfxEnPalabra": [{"palabra": "partió", "efecto": "impacto"}, {"palabra": "seca", "efecto": "brillo"}],
                "background": {"type": "gradient", "colors": ["#0B2238", "#173B5C", "#0D1E30"], "direction": "180deg"},
                "character": {"type": "multitud", "position": "center", "scale": 1},
                "visualAtmosphere": "sunbeam"
            },
            {
                "id": 5,
                "durationInSeconds": 5,
                "badge": "REFLEXIÓN",
                "text": "Cuando no veas salida en tu camino, recuerda: Dios abre caminos donde no los hay. Sígueme para más fe.",
                "highlightWords": ["Dios", "abre", "caminos", "fe."],
                "footer": "Éxodo 14:13-14",
                "sfxEntrada": "brillo",
                "sfxEnPalabra": [{"palabra": "Dios", "efecto": "campana"}, {"palabra": "fe", "efecto": "campana"}],
                "background": {"type": "gradient", "colors": ["#091326", "#172A4A", "#1F3B66"], "direction": "180deg"},
                "character": {"type": "tunica", "position": "center", "scale": 1},
                "visualAtmosphere": "sunbeam"
            }
        ]
    },
    "daniel": {
        "title": "Daniel en el Foso de los Leones (Daniel 6)",
        "badge": "DANIEL 6",
        "scenes": [
            {
                "id": 1,
                "durationInSeconds": 4,
                "badge": "DANIEL 6",
                "text": "Un decreto real prohibió orar. Su única culpa fue arrodillarse tres veces al día.",
                "highlightWords": ["decreto", "arrodillarse", "orar."],
                "sfxEntrada": "whoosh",
                "sfxEnPalabra": [{"palabra": "decreto", "efecto": "impacto"}],
                "background": {"type": "gradient", "colors": ["#160F1E", "#281834"], "direction": "180deg"},
                "character": {"type": "tunica", "position": "center", "scale": 1},
                "visualAtmosphere": "glow"
            },
            {
                "id": 2,
                "durationInSeconds": 5,
                "badge": "EL CASTIGO",
                "text": "Arrojado a una fosa de leones hambrientos. La piedra cerró la salida en la oscuridad.",
                "highlightWords": ["leones", "hambrientos.", "oscuridad."],
                "sfxEntrada": "trueno",
                "sfxEnPalabra": [{"palabra": "leones", "efecto": "suspenso"}, {"palabra": "cerró", "efecto": "impacto"}],
                "background": {"type": "gradient", "colors": ["#0D0B10", "#1C1520"], "direction": "180deg"},
                "character": {"type": "guerrero", "position": "center", "scale": 1.1},
                "visualAtmosphere": "glow"
            },
            {
                "id": 3,
                "durationInSeconds": 5,
                "badge": "EL ÁNGEL",
                "text": "Pero Dios envió a su ángel, y cerró la boca de los leones. Ni un rasguño le hicieron.",
                "highlightWords": ["cerró", "la", "boca", "ángel,"],
                "sfxEntrada": "brillo",
                "sfxEnPalabra": [{"palabra": "ángel", "efecto": "brillo"}, {"palabra": "boca", "efecto": "impacto"}],
                "background": {"type": "gradient", "colors": ["#0B1B2B", "#18334D"], "direction": "180deg"},
                "character": {"type": "tunica", "position": "center", "scale": 1},
                "visualAtmosphere": "sunbeam"
            },
            {
                "id": 4,
                "durationInSeconds": 5,
                "badge": "LA VICTORIA",
                "text": "Al amanecer, el rey corrió al foso: ¡Daniel, tu Dios te libró! Y el mundo conoció su poder.",
                "highlightWords": ["Dios", "te", "libró!", "poder."],
                "footer": "Daniel 6:22",
                "sfxEntrada": "campana",
                "sfxEnPalabra": [{"palabra": "Dios", "efecto": "campana"}, {"palabra": "poder", "efecto": "brillo"}],
                "background": {"type": "gradient", "colors": ["#081224", "#172A4C", "#1F3864"], "direction": "180deg"},
                "character": {"type": "tunica", "position": "center", "scale": 1},
                "visualAtmosphere": "sunbeam"
            }
        ]
    },
    "jonas": {
        "title": "Jonás y el Gran Pez (Jonás 1-2)",
        "badge": "JONÁS 1",
        "scenes": [
            {
                "id": 1,
                "durationInSeconds": 4,
                "badge": "LA HUIDA",
                "text": "Dios le dijo: Ve a Nínive. Pero Jonás tomó un barco en dirección contraria.",
                "highlightWords": ["huyó", "barco", "contraria."],
                "sfxEntrada": "whoosh",
                "sfxEnPalabra": [{"palabra": "contraria", "efecto": "suspenso"}],
                "background": {"type": "gradient", "colors": ["#08101C", "#122034"], "direction": "180deg"},
                "character": {"type": "pastor", "position": "center", "scale": 1},
                "visualAtmosphere": "stars"
            },
            {
                "id": 2,
                "durationInSeconds": 5,
                "badge": "LA TEMPESTAD",
                "text": "Una tempestad feroz sacudió el barco. Sabía que era por su desobediencia y fue arrojado al mar.",
                "highlightWords": ["tempestad", "feroz", "mar."],
                "sfxEntrada": "trueno",
                "sfxEnPalabra": [{"palabra": "tempestad", "efecto": "whoosh"}, {"palabra": "mar", "efecto": "impacto"}],
                "background": {"type": "gradient", "colors": ["#050B14", "#0C1724"], "direction": "180deg"},
                "character": {"type": "multitud", "position": "center", "scale": 0.95},
                "visualAtmosphere": "lightning"
            },
            {
                "id": 3,
                "durationInSeconds": 5,
                "badge": "EL GRAN PEZ",
                "text": "Dios preparó un gran pez que se tragó a Jonás. Tres días en la oscuridad orando con el corazón.",
                "highlightWords": ["gran", "pez", "orando"],
                "sfxEntrada": "suspenso",
                "sfxEnPalabra": [{"palabra": "pez", "efecto": "impacto"}, {"palabra": "orando", "efecto": "brillo"}],
                "background": {"type": "gradient", "colors": ["#07141E", "#0F283C"], "direction": "180deg"},
                "character": {"type": "tunica", "position": "center", "scale": 1},
                "visualAtmosphere": "glow"
            },
            {
                "id": 4,
                "durationInSeconds": 5,
                "badge": "SEGUNDA OPORTUNIDAD",
                "text": "El pez lo dejó en tierra. Dios no te descarta por tus errores: siempre da una segunda oportunidad.",
                "highlightWords": ["Dios", "segunda", "oportunidad."],
                "footer": "Jonás 2:9",
                "sfxEntrada": "brillo",
                "sfxEnPalabra": [{"palabra": "Dios", "efecto": "campana"}, {"palabra": "oportunidad", "efecto": "brillo"}],
                "background": {"type": "gradient", "colors": ["#081224", "#1A3252"], "direction": "180deg"},
                "character": {"type": "tunica", "position": "center", "scale": 1},
                "visualAtmosphere": "sunbeam"
            }
        ]
    }
}


def build_story_with_gemini(prompt: str, api_key: str, voice: str = "es-AR-TomasNeural", num_scenes: int = 5) -> Dict[str, Any]:
    """Genera una historia usando Gemini API estructurada en formato JSON estricto."""
    system_instruction = f"""
Eres un guionista experto en reels verticales virales de historias bíblicas (1080x1920, 30 fps).
Crea un reel bíblico en formato JSON basado estrictamente en el texto bíblico y en el tema pedido por el usuario.

REGLAS OBLIGATORIAS:
1. Respeto bíblico: NUNCA representes el rostro de Dios ni de Jesús. No inventes hechos extrabíblicos.
2. Ritmo rápido viral: exactamente {num_scenes} escenas. Cada escena debe tener narración concisa (1 o 2 frases máximo, no más de 14 palabras).
3. Formato JSON estricto sin markdown envolvente.

ESQUEMA JSON REQUERIDO:
{{
  "title": "Título corto y atractivo",
  "fps": 30,
  "voice": "{voice}",
  "backgroundMusic": "music/background.mp3",
  "volumes": {{ "voice": 1.0, "sfx": 0.5, "music": 0.12 }},
  "scenes": [
    {{
      "id": 1,
      "durationInSeconds": 4,
      "badge": "GANCHO BÍBLICO",
      "text": "Frase impactante de 10 a 14 palabras máximo.",
      "highlightWords": ["palabra1", "palabra2"],
      "sfxEntrada": "whoosh" o "trueno" o "pop" o "suspenso" o "brillo",
      "sfxEnPalabra": [{{ "palabra": "palabra1", "efecto": "impacto" }}],
      "background": {{
        "type": "gradient",
        "colors": ["#080D1A", "#14213D"],
        "direction": "180deg"
      }},
      "character": {{
        "type": "pastor" | "guerrero" | "tunica" | "multitud" | "duelo",
        "position": "center",
        "scale": 1.0
      }},
      "visualAtmosphere": "stars" | "sunbeam" | "glow" | "lightning" | "none",
      "footer": "Cita bíblica (solo en la última escena, ej: '1 Samuel 17')"
    }}
  ]
}}

Efectos permitidos: whoosh, impacto, trueno, campana, suspenso, brillo, pop.
"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [
            {"parts": [{"text": f"Tema: {prompt}\nGenera exactamente {num_scenes} escenas siguiendo el formato JSON especificado."}]}
        ],
        "systemInstruction": {"parts": [{"text": system_instruction}]},
        "generationConfig": {
            "temperature": 0.3,
            "responseMimeType": "application/json"
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )

    with urllib.request.urlopen(req, timeout=30) as resp:
        res_data = json.loads(resp.read().decode("utf-8"))
        text_content = res_data["candidates"][0]["content"]["parts"][0]["text"]
        # Limpiar si viene con bloques ```json
        cleaned = re.sub(r"^```json\s*", "", text_content.strip())
        cleaned = re.sub(r"\s*```$", "", cleaned)
        story_obj = json.loads(cleaned)
        story_obj["fps"] = 30
        story_obj["voice"] = voice
        return story_obj


def build_story_offline(prompt: str, voice: str = "es-AR-TomasNeural", num_scenes: int = 5) -> Dict[str, Any]:
    """Generador inteligente sin necesidad de clave API."""
    p_lower = prompt.lower()
    
    # Revisar si coincide con catálogo precargado
    for key, data in BUILTIN_STORIES.items():
        if key in p_lower:
            story = dict(data)
            story["fps"] = 30
            story["voice"] = voice
            story["backgroundMusic"] = "music/background.mp3"
            story["volumes"] = {"voice": 1.0, "sfx": 0.5, "music": 0.12}
            return story

    # Si es un tema personalizado, construir escenas temáticas dinámicamente
    title = prompt.strip().capitalize()
    words = prompt.split()
    keyword = words[0].capitalize() if words else "Fe"

    scenes = [
        {
            "id": 1,
            "durationInSeconds": 4,
            "badge": "HISTORIA BÍBLICA",
            "text": f"¿Conoces el momento en que {title} cambió la historia para siempre?",
            "highlightWords": [keyword, "historia"],
            "sfxEntrada": "trueno",
            "sfxEnPalabra": [{"palabra": keyword, "efecto": "impacto"}],
            "background": {"type": "gradient", "colors": ["#080D1A", "#14213D"], "direction": "180deg"},
            "character": {"type": "duelo", "position": "center", "scale": 1.0},
            "visualAtmosphere": "lightning"
        },
        {
            "id": 2,
            "durationInSeconds": 5,
            "badge": "LA PRUEBA",
            "text": f"En medio de la prueba más difícil, todo parecía perdido humanamente.",
            "highlightWords": ["prueba", "difícil,", "perdido"],
            "sfxEntrada": "suspenso",
            "sfxEnPalabra": [{"palabra": "difícil", "efecto": "suspenso"}],
            "background": {"type": "gradient", "colors": ["#1A1412", "#2E1E16"], "direction": "180deg"},
            "character": {"type": "multitud", "position": "center", "scale": 0.95},
            "visualAtmosphere": "glow"
        },
        {
            "id": 3,
            "durationInSeconds": 5,
            "badge": "EL PODER DE DIOS",
            "text": f"Pero Dios se manifestó con poder sobrenatural frente a todos los presentes.",
            "highlightWords": ["Dios", "poder", "sobrenatural"],
            "sfxEntrada": "whoosh",
            "sfxEnPalabra": [{"palabra": "Dios", "efecto": "brillo"}, {"palabra": "poder", "efecto": "impacto"}],
            "background": {"type": "gradient", "colors": ["#0C1628", "#1E3A5F"], "direction": "180deg"},
            "character": {"type": "tunica", "position": "center", "scale": 1.0},
            "visualAtmosphere": "sunbeam"
        },
        {
            "id": 4,
            "durationInSeconds": 5,
            "badge": "REFLEXIÓN",
            "text": f"Recuerda: ningún gigante es más grande que el Dios que camina contigo. Sígueme para más.",
            "highlightWords": ["Dios", "camina", "contigo."],
            "footer": "Palabra de Dios",
            "sfxEntrada": "brillo",
            "sfxEnPalabra": [{"palabra": "Dios", "efecto": "campana"}, {"palabra": "contigo", "efecto": "brillo"}],
            "background": {"type": "gradient", "colors": ["#071020", "#152644"], "direction": "180deg"},
            "character": {"type": "tunica", "position": "center", "scale": 1.0},
            "visualAtmosphere": "sunbeam"
        }
    ]

    return {
        "title": title,
        "fps": 30,
        "voice": voice,
        "backgroundMusic": "music/background.mp3",
        "volumes": {"voice": 1.0, "sfx": 0.5, "music": 0.12},
        "scenes": scenes
    }


def generate_story(prompt: str, api_key: Optional[str] = None, voice: str = "es-AR-TomasNeural", num_scenes: int = 5) -> Dict[str, Any]:
    """Punto de entrada principal para generar la historia con o sin API Key."""
    key = api_key or os.environ.get("GEMINI_API_KEY")
    if key:
        try:
            return build_story_with_gemini(prompt, key, voice, num_scenes)
        except Exception as e:
            print(f"Advertencia: Falló llamada a Gemini API ({e}). Usando generador inteligente offline.")
    return build_story_offline(prompt, voice, num_scenes)


if __name__ == "__main__":
    import sys
    test_prompt = sys.argv[1] if len(sys.argv) > 1 else "Moisés y el Mar Rojo"
    res = generate_story(test_prompt)
    print(json.dumps(res, indent=2, ensure_ascii=False))
