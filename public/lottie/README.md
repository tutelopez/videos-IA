# Carpeta de Animaciones Lottie

Coloca aquí los archivos .json de animación Lottie para los personajes bíblicos.

## Cómo encontrar Lottie gratuitos
1. Ve a https://lottiefiles.com/
2. Busca: "shepherd", "warrior ancient", "pray silhouette", "crowd people"
3. Descarga el archivo .json
4. Renómbralo según el tipo de personaje:
   - pastor_anim.json
   - guerrero_anim.json
   - tunica_anim.json
   - multitud_anim.json

## Uso en story.json
Agrega en el personaje de la escena:
```json
"character": {
  "type": "pastor",
  "useLottie": true,
  "lottieFile": "pastor_anim.json"
}
```

## Links recomendados
- https://lottiefiles.com/animations/shepherd
- https://lottiefiles.com/animations/ancient-warrior
- https://lottiefiles.com/animations/pray-hands
- https://lottiefiles.com/animations/crowd
