# 📁 Fondos PNG para Escenas

Esta carpeta contiene las imágenes de fondo de alta calidad para cada escena del reel bíblico.

## ¿Cómo funciona?

Cada imagen se referencia en `src/data/story.json` mediante el campo `sceneImage` en cada escena:

```json
{
  "id": 1,
  "sceneImage": "scene_1.png",
  "imageOpacity": 0.85
}
```

- Si `sceneImage` **no está definido**, la escena usará el gradiente CSS de siempre (comportamiento por defecto).
- Si `sceneImage` **está definido**, la imagen se superpone sobre el gradiente con la opacidad especificada.
- `imageOpacity` va de `0.0` (transparente) a `1.0` (totalmente opaca). Por defecto es `0.85`.

## Especificaciones de las imágenes

| Campo        | Valor                |
|-------------|----------------------|
| Formato     | PNG (o JPEG/WEBP)    |
| Resolución  | 1080 × 1920 px       |
| Orientación | Vertical (9:16)      |
| Modo color  | RGB                  |
| Tamaño max  | ~5 MB por imagen     |

## Archivos esperados (historia: David y Goliat)

| Archivo       | Escena | Descripción                                              |
|--------------|--------|----------------------------------------------------------|
| `scene_1.png` | 1      | Cielo nocturno estrellado sobre colinas desérticas palestinas |
| `scene_2.png` | 2      | Campo de batalla bíblico antiguo con sol dramático        |
| `scene_3.png` | 3      | Alba dorada sobre el desierto de Judea, luz divina        |

## Cómo generar las imágenes

Consulta los prompts listos para copiar en:

```
src/data/imagePrompts.json
```

O ejecuta directamente desde la terminal:

```bash
npm run prompts
```

## Cómo activar una imagen en una escena

1. Coloca el archivo PNG aquí: `public/scenes/scene_1.png`
2. Edita `src/data/story.json` y agrega en la escena correspondiente:
   ```json
   "sceneImage": "scene_1.png",
   "imageOpacity": 0.85
   ```
3. Guarda y el Remotion Studio mostrará el fondo inmediatamente.

## Consejos

- Usa `imageOpacity: 0.6` a `0.75` si el texto resulta difícil de leer sobre la imagen.
- Puedes ajustar la opacidad por escena independientemente.
- El gradiente CSS sigue renderizándose debajo de la imagen, así que imágenes con canal alpha funcionan bien.
