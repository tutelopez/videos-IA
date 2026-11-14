import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterType } from "../data/story";

interface SilhouetteProps {
  type: CharacterType;
  position?: "center" | "left" | "right";
  scale?: number;
  flip?: boolean;
}

export const Silhouette: React.FC<SilhouetteProps> = ({
  type,
  position = "center",
  scale = 1,
  flip = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (type === "none") {
    return null;
  }

  // Animación de entrada suave
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Movimiento sutil de respiración/viento
  const breathe = Math.sin((frame / fps) * 2) * 5;

  // Alineación horizontal
  let alignStyle: React.CSSProperties = {
    left: "50%",
    transform: `translateX(-50%) scale(${scale * enterSpring}) ${
      flip ? "scaleX(-1)" : ""
    }`,
  };

  if (position === "left") {
    alignStyle = {
      left: "15%",
      transform: `scale(${scale * enterSpring}) ${flip ? "scaleX(-1)" : ""}`,
    };
  } else if (position === "right") {
    alignStyle = {
      right: "15%",
      transform: `scale(${scale * enterSpring}) ${flip ? "scaleX(-1)" : ""}`,
    };
  }

  const renderSvg = () => {
    switch (type) {
      case "pastor":
        return (
          // Pastor bíblico: túnica corta café cálido, cayado, bolsa, manto beige cubriendo cabeza
          <svg
            width="420"
            height="620"
            viewBox="0 0 420 620"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradiente cuerpo/túnica */}
              <linearGradient id="pst-tunica" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C49A6C" />
                <stop offset="40%" stopColor="#8B5E3C" />
                <stop offset="100%" stopColor="#5C3A1E" />
              </linearGradient>
              {/* Gradiente manto cabeza */}
              <linearGradient id="pst-manto" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E8D5A3" />
                <stop offset="60%" stopColor="#D4A373" />
                <stop offset="100%" stopColor="#B8865A" />
              </linearGradient>
              {/* Gradiente manto exterior */}
              <linearGradient id="pst-capa" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C8A87A" />
                <stop offset="100%" stopColor="#6B4226" />
              </linearGradient>
              {/* Gradiente cayado de madera */}
              <linearGradient id="pst-cayado" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A0714F" />
                <stop offset="50%" stopColor="#C49A6C" />
                <stop offset="100%" stopColor="#7A5230" />
              </linearGradient>
              {/* Gradiente piel */}
              <linearGradient id="pst-piel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4956A" />
                <stop offset="100%" stopColor="#A86840" />
              </linearGradient>
              {/* Gradiente bolsa */}
              <linearGradient id="pst-bolsa" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B6914" />
                <stop offset="100%" stopColor="#5C4510" />
              </linearGradient>
              {/* Resplandor dorado rim */}
              <radialGradient id="pst-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D4A017" stopOpacity="0.0" />
                <stop offset="70%" stopColor="#D4A017" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#D4A017" stopOpacity="0.35" />
              </radialGradient>
              {/* Filtro sombra del suelo */}
              <filter id="pst-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                <feColorMatrix in="blur" type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" result="shadow" />
              </filter>
              {/* Filtro glow exterior */}
              <filter id="pst-rimglow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="glow" />
                <feColorMatrix in="glow" type="matrix"
                  values="1 0.8 0 0 0  0.8 0.6 0 0 0  0 0 0 0 0  0 0 0 0.7 0" />
              </filter>
              <clipPath id="pst-clip">
                <rect width="420" height="620" />
              </clipPath>
            </defs>

            {/* Sombra elíptica en el suelo */}
            <ellipse cx="210" cy="608" rx="130" ry="10" fill="#1A0E00" opacity="0.55" />
            <ellipse cx="210" cy="608" rx="90" ry="6" fill="#100800" opacity="0.45" />

            {/* Resplandor dorado de fondo (rim light) */}
            <ellipse cx="215" cy="320" rx="130" ry="280" fill="url(#pst-glow)" filter="url(#pst-rimglow)" />

            {/* ===== CAYADO / VARA ===== */}
            {/* Mango curvo del cayado */}
            <path
              d="M108 170 C108 140 120 118 142 110 C160 104 175 112 178 128 C181 144 170 155 155 155 C145 155 138 148 138 140"
              stroke="url(#pst-cayado)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            {/* Palo del cayado */}
            <rect x="104" y="140" width="8" height="440" rx="4" fill="url(#pst-cayado)" />
            {/* Detalle nudo de madera */}
            <ellipse cx="108" cy="310" rx="6" ry="8" fill="#7A5230" opacity="0.6" />
            <ellipse cx="108" cy="420" rx="5" ry="6" fill="#7A5230" opacity="0.5" />
            {/* Punta inferior del cayado */}
            <path d="M104 575 L112 575 L108 590 Z" fill="#5C3A1E" />

            {/* ===== BOLSA DE CUERO ===== */}
            <path
              d="M270 290 C265 285 262 295 260 310 L258 340 C258 352 265 360 275 360 L295 360 C305 360 310 352 310 342 L312 312 C312 298 308 288 300 285 Z"
              fill="url(#pst-bolsa)"
            />
            {/* Correa de la bolsa */}
            <path
              d="M275 285 C272 265 265 245 258 232"
              stroke="#8B6914"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cierre bolsa */}
            <path d="M262 300 L308 300" stroke="#D4A017" strokeWidth="2" opacity="0.7" />
            <ellipse cx="285" cy="325" rx="10" ry="10" fill="#D4A017" opacity="0.3" />

            {/* ===== PIERNAS Y SANDALIAS ===== */}
            {/* Pierna izquierda */}
            <path
              d="M177 440 C172 480 168 530 165 580 L190 580 C193 530 197 480 200 440 Z"
              fill="url(#pst-tunica)"
            />
            {/* Pierna derecha */}
            <path
              d="M238 440 C242 480 246 530 248 580 L273 580 C271 530 268 480 263 440 Z"
              fill="url(#pst-tunica)"
            />
            {/* Sandalia izquierda */}
            <path d="M155 580 C155 585 162 590 177 592 C192 594 202 590 205 586 L202 580 Z" fill="#7A5230" />
            <path d="M160 582 L200 580" stroke="#5C3A1E" strokeWidth="2" opacity="0.7" />
            <path d="M168 578 L168 590 M180 577 L180 591" stroke="#5C3A1E" strokeWidth="1.5" opacity="0.5" />
            {/* Sandalia derecha */}
            <path d="M242 580 L240 586 C243 590 253 594 268 592 C283 590 290 585 290 580 Z" fill="#7A5230" />
            <path d="M242 582 L288 580" stroke="#5C3A1E" strokeWidth="2" opacity="0.7" />
            <path d="M252 577 L252 591 M264 578 L264 590" stroke="#5C3A1E" strokeWidth="1.5" opacity="0.5" />

            {/* ===== TÚNICA PRINCIPAL ===== */}
            {/* Cuerpo de la túnica */}
            <path
              d="M155 230 C148 300 142 380 138 460 L282 460 C278 380 272 300 265 230 C248 240 230 245 210 244 C190 244 172 238 155 230 Z"
              fill="url(#pst-tunica)"
            />
            {/* Pliegue central de túnica */}
            <path
              d="M210 240 C208 310 206 390 205 460"
              stroke="#5C3A1E"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.5"
              fill="none"
            />
            {/* Pliegue lateral izquierdo */}
            <path
              d="M178 250 C174 320 170 400 168 460"
              stroke="#5C3A1E"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.35"
              fill="none"
            />
            {/* Pliegue lateral derecho */}
            <path
              d="M242 250 C246 320 250 400 252 460"
              stroke="#5C3A1E"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.35"
              fill="none"
            />
            {/* Dobladillo inferior de la túnica */}
            <path
              d="M140 455 C160 450 200 448 220 448 C240 448 275 450 282 455 L284 465 C265 462 240 460 220 460 C200 460 165 462 138 465 Z"
              fill="#7A4A28"
              opacity="0.7"
            />

            {/* ===== CAPA / MANTO EXTERIOR ===== */}
            {/* Manto ondeante sobre los hombros */}
            <path
              d="M140 200 C130 240 125 300 128 360 C140 345 160 325 175 310 C178 280 175 250 170 230 Z"
              fill="url(#pst-capa)"
              opacity="0.9"
            />
            {/* Pliegue de la capa */}
            <path
              d="M148 220 C142 270 138 330 140 360"
              stroke="#6B4226"
              strokeWidth="2"
              opacity="0.5"
              fill="none"
            />

            {/* ===== BRAZOS ===== */}
            {/* Brazo izquierdo (sosteniendo el cayado) */}
            <path
              d="M155 230 C145 240 132 258 118 272 C112 278 110 285 114 290 C118 295 126 292 132 285 C148 268 162 250 170 240 Z"
              fill="url(#pst-piel)"
            />
            {/* Mano izquierda */}
            <ellipse cx="112" cy="291" rx="10" ry="8" fill="url(#pst-piel)" />
            {/* Brazo derecho (con bolsa) */}
            <path
              d="M265 230 C272 242 278 258 275 272 C272 282 265 285 258 280 C255 268 252 250 248 238 Z"
              fill="url(#pst-piel)"
            />

            {/* ===== CUELLO ===== */}
            <path
              d="M200 165 C200 158 207 152 215 152 C223 152 230 158 230 165 L228 195 C225 200 220 202 215 202 C210 202 205 200 202 195 Z"
              fill="url(#pst-piel)"
            />

            {/* ===== CABEZA CON MANTO (sin rostro detallado) ===== */}
            {/* Base de la cabeza */}
            <ellipse cx="215" cy="135" rx="42" ry="46" fill="url(#pst-piel)" />
            {/* Manto/kufiyah beige sobre la cabeza - capa base */}
            <path
              d="M172 118 C170 95 180 68 215 62 C250 62 262 85 262 108 C262 130 258 148 252 158 C240 170 220 175 205 170 C188 164 174 148 172 118 Z"
              fill="url(#pst-manto)"
            />
            {/* Manto cayendo sobre los hombros */}
            <path
              d="M172 120 C165 140 158 165 155 190 C160 196 170 200 182 200 C190 185 196 165 200 148 Z"
              fill="url(#pst-manto)"
              opacity="0.9"
            />
            <path
              d="M262 115 C268 135 272 162 275 188 C270 196 260 202 248 202 C242 188 238 165 236 148 Z"
              fill="url(#pst-manto)"
              opacity="0.85"
            />
            {/* Banda del manto (agal) - correa oscura que lo sujeta */}
            <path
              d="M174 118 C175 108 190 102 215 102 C240 102 256 108 258 118"
              stroke="#8B6914"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Pliegues del manto sobre la cabeza */}
            <path
              d="M200 70 C198 90 196 110 196 130"
              stroke="#C4904A"
              strokeWidth="2"
              opacity="0.4"
              fill="none"
            />
            <path
              d="M220 65 C220 85 219 108 218 128"
              stroke="#C4904A"
              strokeWidth="2"
              opacity="0.4"
              fill="none"
            />
            {/* Sombra facial (oscurece la zona del "rostro" sin detallarlo) */}
            <path
              d="M183 125 C183 110 192 98 215 96 C238 96 248 108 249 122 C250 138 244 152 236 158 C225 165 205 165 196 158 C187 150 183 138 183 125 Z"
              fill="#8B5E3C"
              opacity="0.55"
            />
            {/* Luz dorada en la frente del manto */}
            <ellipse cx="215" cy="90" rx="22" ry="12" fill="#E5C88A" opacity="0.3" />

            {/* ===== LUZ/HIGHLIGHT en la túnica ===== */}
            <path
              d="M210 240 C213 300 215 380 215 450"
              stroke="#D4A373"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.25"
              fill="none"
            />
          </svg>
        );

      case "guerrero":
        return (
          // Guerrero bíblico antiguo (Goliat) - grande e imponente
          <svg
            width="480"
            height="660"
            viewBox="0 0 480 660"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradiente armadura plateada/dorada */}
              <linearGradient id="gue-armadura" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8BAFC4" />
                <stop offset="30%" stopColor="#2C4A6E" />
                <stop offset="70%" stopColor="#1A3050" />
                <stop offset="100%" stopColor="#0E1E34" />
              </linearGradient>
              {/* Gradiente metal brillante */}
              <linearGradient id="gue-metal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4A6E8C" />
                <stop offset="40%" stopColor="#A8C4D8" />
                <stop offset="60%" stopColor="#D4E8F0" />
                <stop offset="100%" stopColor="#2C4A6E" />
              </linearGradient>
              {/* Gradiente escudo */}
              <radialGradient id="gue-escudo" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#A8C4D8" />
                <stop offset="40%" stopColor="#2C4A6E" />
                <stop offset="100%" stopColor="#0E1E34" />
              </radialGradient>
              {/* Gradiente dorado acento */}
              <linearGradient id="gue-oro" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B6914" />
                <stop offset="50%" stopColor="#D4A017" />
                <stop offset="100%" stopColor="#8B6914" />
              </linearGradient>
              {/* Gradiente casco */}
              <linearGradient id="gue-casco" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9AB8CC" />
                <stop offset="45%" stopColor="#2C4A6E" />
                <stop offset="100%" stopColor="#0E1E34" />
              </linearGradient>
              {/* Gradiente lanza */}
              <linearGradient id="gue-lanza" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B6914" />
                <stop offset="45%" stopColor="#D4A017" />
                <stop offset="100%" stopColor="#8B6914" />
              </linearGradient>
              {/* Gradiente rojo drama (plumas casco) */}
              <linearGradient id="gue-plumas" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF4444" />
                <stop offset="60%" stopColor="#C41E3A" />
                <stop offset="100%" stopColor="#8B0000" />
              </linearGradient>
              {/* Gradiente piel oscura */}
              <linearGradient id="gue-piel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B6040" />
                <stop offset="100%" stopColor="#5C3820" />
              </linearGradient>
              {/* Gradiente botas */}
              <linearGradient id="gue-botas" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A3020" />
                <stop offset="100%" stopColor="#2A1810" />
              </linearGradient>
              {/* Resplandor imponente */}
              <radialGradient id="gue-glow" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#D4A017" stopOpacity="0.0" />
                <stop offset="65%" stopColor="#D4A017" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#D4A017" stopOpacity="0.3" />
              </radialGradient>
              <filter id="gue-rimglow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="glow" />
                <feColorMatrix in="glow" type="matrix"
                  values="0.8 0.6 0 0 0  0.6 0.5 0 0 0  0 0.1 0.2 0 0  0 0 0 0.65 0" />
              </filter>
              <filter id="gue-metalglow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="glow" />
                <feColorMatrix in="glow" type="matrix"
                  values="0.5 0.6 0.8 0 0.1  0.4 0.5 0.7 0 0.1  0.3 0.4 0.6 0 0.2  0 0 0 0.5 0" />
              </filter>
            </defs>

            {/* Sombra en el suelo */}
            <ellipse cx="230" cy="650" rx="175" ry="11" fill="#050F1A" opacity="0.65" />
            <ellipse cx="230" cy="650" rx="110" ry="6" fill="#030A12" opacity="0.5" />

            {/* Resplandor imponente de fondo */}
            <ellipse cx="235" cy="340" rx="175" ry="310" fill="url(#gue-glow)" filter="url(#gue-rimglow)" />

            {/* ===== LANZA LARGA ===== */}
            {/* Mango de la lanza */}
            <rect x="358" y="90" width="10" height="530" rx="5" fill="url(#gue-lanza)" />
            {/* Punta de lanza (hoja) */}
            <path
              d="M356 90 L363 55 L370 90 Z"
              fill="#E5C88A"
            />
            <path
              d="M360 90 L363 60 L366 90"
              fill="url(#gue-oro)"
            />
            {/* Reflejo de la punta */}
            <path d="M362 65 L363 58 L364 65" fill="white" opacity="0.6" />
            {/* Travesaño decorativo */}
            <rect x="350" y="168" width="26" height="6" rx="3" fill="url(#gue-oro)" />

            {/* ===== PIERNAS (muy gruesas, musculosas) ===== */}
            {/* Faldón de combate / kilt de cuero con tiras */}
            <path
              d="M155 390 L335 390 L340 440 L150 440 Z"
              fill="url(#gue-armadura)"
            />
            {/* Tiras del faldón */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={i}
                x={162 + i * 29}
                y={392}
                width="20"
                height="46"
                rx="4"
                fill="url(#gue-armadura)"
                stroke="#D4A017"
                strokeWidth="1"
                opacity="0.85"
              />
            ))}
            {/* Pierna izquierda */}
            <path
              d="M162 436 C155 468 150 510 148 560 C148 575 158 582 172 582 L200 582 C214 582 222 574 222 560 L218 436 Z"
              fill="url(#gue-armadura)"
            />
            {/* Rodillera izquierda */}
            <ellipse cx="185" cy="500" rx="28" ry="18" fill="url(#gue-metal)" />
            <ellipse cx="185" cy="500" rx="18" ry="12" fill="url(#gue-armadura)" />
            {/* Pierna derecha */}
            <path
              d="M262 436 C262 468 264 510 264 560 C264 575 272 582 288 582 L316 582 C330 582 338 574 336 560 L330 436 Z"
              fill="url(#gue-armadura)"
            />
            {/* Rodillera derecha */}
            <ellipse cx="299" cy="500" rx="28" ry="18" fill="url(#gue-metal)" />
            <ellipse cx="299" cy="500" rx="18" ry="12" fill="url(#gue-armadura)" />

            {/* ===== BOTAS ===== */}
            {/* Bota izquierda */}
            <path
              d="M148 560 C145 575 142 592 140 610 C138 622 148 630 165 630 C182 630 198 625 202 615 L204 582 C192 578 175 575 162 578 Z"
              fill="url(#gue-botas)"
            />
            {/* Correa de la bota izquierda */}
            <path d="M142 572 L200 568" stroke="#D4A017" strokeWidth="2.5" opacity="0.7" />
            <path d="M140 582 L202 578" stroke="#D4A017" strokeWidth="2.5" opacity="0.7" />
            {/* Bota derecha */}
            <path
              d="M264 560 C264 575 262 592 260 610 C258 622 268 630 285 630 C302 630 318 625 320 615 L318 582 C306 575 288 572 272 575 Z"
              fill="url(#gue-botas)"
            />
            {/* Correa de la bota derecha */}
            <path d="M262 572 L318 568" stroke="#D4A017" strokeWidth="2.5" opacity="0.7" />
            <path d="M260 582 L316 578" stroke="#D4A017" strokeWidth="2.5" opacity="0.7" />

            {/* ===== TORSO / ARMADURA ===== */}
            {/* Pechera de armadura - pieza principal */}
            <path
              d="M120 220 C115 265 112 320 115 385 L375 385 C378 320 375 265 370 220 C340 230 300 238 240 238 C180 238 150 230 120 220 Z"
              fill="url(#gue-armadura)"
            />
            {/* Pechera central */}
            <path
              d="M180 225 C175 270 172 330 175 385 L305 385 C308 330 305 270 300 225 C280 235 260 240 240 240 C220 240 200 235 180 225 Z"
              fill="url(#gue-metal)"
              opacity="0.5"
            />
            {/* Escamas de la armadura */}
            {[-30, -15, 0, 15, 30].map((dx, i) => (
              <ellipse
                key={i}
                cx={240 + dx}
                cy={295}
                rx={18}
                ry={22}
                fill="url(#gue-armadura)"
                stroke="#4A6E8C"
                strokeWidth="1.5"
                opacity="0.7"
              />
            ))}
            {[-22, -7, 7, 22].map((dx, i) => (
              <ellipse
                key={i}
                cx={240 + dx}
                cy={330}
                rx={18}
                ry={22}
                fill="url(#gue-armadura)"
                stroke="#4A6E8C"
                strokeWidth="1.5"
                opacity="0.7"
              />
            ))}
            {/* Cinturón dorado */}
            <path
              d="M115 382 L375 382 L375 395 L115 395 Z"
              fill="url(#gue-oro)"
              opacity="0.9"
            />
            {/* Hebilla del cinturón */}
            <rect x="225" y="380" width="30" height="18" rx="3" fill="#D4A017" />
            <rect x="230" y="383" width="20" height="12" rx="2" fill="#8B6914" />

            {/* ===== HOMBRERAS IMPONENTES ===== */}
            {/* Hombrera izquierda */}
            <path
              d="M80 185 C75 165 85 148 108 142 C125 138 140 145 145 158 C150 170 145 185 138 192 C120 202 95 198 80 185 Z"
              fill="url(#gue-metal)"
            />
            <path
              d="M80 185 C75 165 85 148 108 142 C125 138 140 145 145 158"
              stroke="url(#gue-oro)"
              strokeWidth="3"
              fill="none"
            />
            {/* Platos de hombrera izquierda */}
            <path d="M68 198 C65 185 75 172 90 170 C100 168 112 175 115 185 L110 200 C95 205 75 205 68 198 Z"
              fill="url(#gue-metal)" opacity="0.9" />
            {/* Hombrera derecha */}
            <path
              d="M400 185 C405 165 395 148 372 142 C355 138 340 145 335 158 C330 170 335 185 342 192 C360 202 385 198 400 185 Z"
              fill="url(#gue-metal)"
            />
            <path
              d="M400 185 C405 165 395 148 372 142 C355 138 340 145 335 158"
              stroke="url(#gue-oro)"
              strokeWidth="3"
              fill="none"
            />
            {/* Platos de hombrera derecha */}
            <path d="M412 198 C415 185 405 172 390 170 C380 168 368 175 365 185 L370 200 C385 205 405 205 412 198 Z"
              fill="url(#gue-metal)" opacity="0.9" />

            {/* ===== ESCUDO REDONDO ===== */}
            {/* Sombra del escudo */}
            <ellipse cx="88" cy="300" rx="68" ry="72" fill="#030A12" opacity="0.4" />
            {/* Escudo principal */}
            <ellipse cx="85" cy="295" rx="66" ry="70" fill="url(#gue-escudo)" />
            {/* Borde dorado del escudo */}
            <ellipse cx="85" cy="295" rx="66" ry="70" fill="none" stroke="url(#gue-oro)" strokeWidth="5" />
            {/* Anillo interno */}
            <ellipse cx="85" cy="295" rx="52" ry="55" fill="none" stroke="#D4A017" strokeWidth="2" opacity="0.5" />
            {/* Decoración del escudo - estrella/cruz */}
            <path d="M85 248 L85 342 M38 295 L132 295" stroke="url(#gue-oro)" strokeWidth="3" opacity="0.6" />
            {/* Umbo (centro del escudo) */}
            <ellipse cx="85" cy="295" rx="20" ry="20" fill="url(#gue-metal)" />
            <ellipse cx="85" cy="295" rx="20" ry="20" stroke="#D4A017" strokeWidth="2" fill="none" />
            <ellipse cx="85" cy="295" rx="10" ry="10" fill="#D4A017" opacity="0.8" />
            {/* Reflejo del escudo */}
            <ellipse cx="62" cy="265" rx="20" ry="15" fill="white" opacity="0.12" transform="rotate(-20 62 265)" />

            {/* ===== BRAZO DERECHO (con lanza) ===== */}
            <path
              d="M340 192 C350 215 355 245 355 275 C355 288 348 295 340 292 C332 289 328 280 328 268 C328 245 330 218 335 198 Z"
              fill="url(#gue-piel)"
            />
            {/* Brazalete derecho */}
            <rect x="327" y="265" width="30" height="12" rx="4" fill="url(#gue-oro)" />
            {/* Mano derecha */}
            <ellipse cx="342" cy="295" rx="12" ry="10" fill="url(#gue-piel)" />

            {/* ===== BRAZO IZQUIERDO (con escudo) ===== */}
            <path
              d="M140 192 C128 215 122 245 120 275 C118 290 128 298 138 294 C148 290 152 278 152 262 C152 240 148 215 142 196 Z"
              fill="url(#gue-piel)"
            />
            {/* Brazalete izquierdo */}
            <rect x="118" y="260" width="30" height="12" rx="4" fill="url(#gue-oro)" />

            {/* ===== CUELLO ===== */}
            <path
              d="M210 162 C210 155 220 148 240 148 C260 148 270 155 270 162 L268 196 C262 202 252 206 240 206 C228 206 218 202 212 196 Z"
              fill="url(#gue-piel)"
            />
            {/* Gorjal (protección de cuello) */}
            <path
              d="M200 185 C205 175 220 170 240 170 C260 170 275 175 280 185 C278 195 268 202 240 204 C212 202 202 195 200 185 Z"
              fill="url(#gue-metal)"
              opacity="0.7"
            />

            {/* ===== CASCO ===== */}
            {/* Plumas del casco - decoración dramática */}
            <path
              d="M220 42 C218 25 225 10 240 8 C255 10 262 25 260 42 C265 35 275 20 285 18 C298 20 302 38 295 52 C305 40 318 32 328 36 C340 44 338 62 328 72"
              fill="none"
              stroke="url(#gue-plumas)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M220 42 C215 28 205 15 198 18 C188 25 190 44 200 55"
              fill="none"
              stroke="url(#gue-plumas)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Plumas en silueta */}
            <path
              d="M200 55 C205 35 215 20 230 20 C242 20 252 35 258 55 C265 38 278 24 292 28 C304 36 305 55 298 68"
              fill="url(#gue-plumas)"
              opacity="0.85"
            />
            {/* Base del casco */}
            <path
              d="M174 100 C174 72 190 52 240 50 C290 52 306 72 306 100 C306 128 300 148 292 162 C278 178 260 184 240 184 C220 184 202 178 188 162 C180 148 174 128 174 100 Z"
              fill="url(#gue-casco)"
            />
            {/* Reflejo metálico del casco */}
            <path
              d="M188 88 C190 72 202 60 220 56 C230 54 238 56 240 60"
              stroke="url(#gue-metal)"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.6"
              fill="none"
            />
            {/* Nasal del casco (protección de nariz, oculta el rostro) */}
            <path
              d="M232 128 C232 110 234 95 240 88 C246 95 248 110 248 128 C248 148 244 162 240 168 C236 162 232 148 232 128 Z"
              fill="url(#gue-metal)"
              opacity="0.9"
            />
            {/* Carrilleras del casco */}
            <path
              d="M174 110 C172 128 174 148 180 165 L200 170 C190 155 184 136 184 118 Z"
              fill="url(#gue-casco)"
              opacity="0.9"
            />
            <path
              d="M306 110 C308 128 306 148 300 165 L280 170 C290 155 296 136 296 118 Z"
              fill="url(#gue-casco)"
              opacity="0.9"
            />
            {/* Cresta del casco dorada */}
            <path
              d="M200 55 C210 48 225 44 240 44 C255 44 270 48 280 55"
              stroke="url(#gue-oro)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Reflejo de luz en el casco */}
            <ellipse cx="210" cy="80" rx="22" ry="14" fill="white" opacity="0.1" transform="rotate(-15 210 80)" />
            {/* Brillo metálico en el casco */}
            <path
              d="M188 95 C195 82 210 74 228 74"
              stroke="white"
              strokeWidth="3"
              opacity="0.15"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        );

      case "tunica":
        return (
          // Figura en túnica azul profundo, brazos alzados, cabeza inclinada
          <svg
            width="500"
            height="620"
            viewBox="0 0 500 620"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradiente túnica azul profundo */}
              <linearGradient id="tun-azul" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2C6098" />
                <stop offset="40%" stopColor="#1E3A5F" />
                <stop offset="100%" stopColor="#0D1F38" />
              </linearGradient>
              {/* Gradiente manto exterior */}
              <linearGradient id="tun-manto" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3A7AB8" />
                <stop offset="50%" stopColor="#1E3A5F" />
                <stop offset="100%" stopColor="#0A1526" />
              </linearGradient>
              {/* Gradiente resplandor celestial */}
              <radialGradient id="tun-luz" cx="50%" cy="10%" r="70%">
                <stop offset="0%" stopColor="#E5C88A" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#D4A017" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#D4A017" stopOpacity="0.0" />
              </radialGradient>
              {/* Gradiente manto cabeza */}
              <linearGradient id="tun-capucha" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2C6098" />
                <stop offset="100%" stopColor="#0D1F38" />
              </linearGradient>
              {/* Gradiente piel */}
              <linearGradient id="tun-piel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C4845A" />
                <stop offset="100%" stopColor="#8B5A30" />
              </linearGradient>
              {/* Gradiente faja/cinta */}
              <linearGradient id="tun-faja" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B6914" />
                <stop offset="50%" stopColor="#D4A017" />
                <stop offset="100%" stopColor="#8B6914" />
              </linearGradient>
              {/* Resplandor celestial de fondo */}
              <radialGradient id="tun-glow" cx="50%" cy="20%" r="60%">
                <stop offset="0%" stopColor="#D4A017" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#D4A017" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#D4A017" stopOpacity="0.0" />
              </radialGradient>
              <filter id="tun-rimglow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="glow" />
                <feColorMatrix in="glow" type="matrix"
                  values="1 0.8 0.2 0 0  0.8 0.6 0.1 0 0  0.1 0.2 0 0 0  0 0 0 0.75 0" />
              </filter>
              <filter id="tun-lightray" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="glow" />
                <feColorMatrix in="glow" type="matrix"
                  values="1 0.9 0.5 0 0  0.9 0.8 0.3 0 0  0.3 0.3 0 0 0  0 0 0 0.6 0" />
              </filter>
            </defs>

            {/* Sombra en el suelo */}
            <ellipse cx="250" cy="612" rx="145" ry="9" fill="#040A14" opacity="0.6" />
            <ellipse cx="250" cy="612" rx="90" ry="5" fill="#020609" opacity="0.5" />

            {/* Haz de luz celestial desde arriba */}
            <path
              d="M200 0 L160 250 L340 250 L300 0 Z"
              fill="url(#tun-luz)"
              opacity="0.5"
              filter="url(#tun-lightray)"
            />

            {/* Resplandor dorado de fondo (fe/alabanza) */}
            <ellipse cx="250" cy="300" rx="175" ry="290" fill="url(#tun-glow)" filter="url(#tun-rimglow)" />

            {/* ===== PIERNAS ===== */}
            {/* Pierna izquierda */}
            <path
              d="M200 460 C195 490 190 540 186 590 L218 590 C220 540 222 490 222 460 Z"
              fill="url(#tun-azul)"
            />
            {/* Pierna derecha */}
            <path
              d="M278 460 C282 490 285 540 284 590 L316 590 C313 540 308 490 302 460 Z"
              fill="url(#tun-azul)"
            />
            {/* Pies / sandalias */}
            <path d="M176 588 C175 596 182 602 200 604 C218 606 228 601 230 594 L218 590 Z" fill="#6B4226" />
            <path d="M270 588 C269 594 280 601 298 604 C316 607 323 601 322 594 L310 588 Z" fill="#6B4226" />

            {/* ===== TÚNICA LARGA PRINCIPAL ===== */}
            {/* Vuelo de la túnica - forma ondeante */}
            <path
              d="M148 265 C138 350 125 440 115 580 L385 580 C375 440 362 350 352 265 C320 278 290 285 250 285 C210 285 180 278 148 265 Z"
              fill="url(#tun-azul)"
            />
            {/* Pliegue central de la túnica */}
            <path
              d="M250 280 C248 360 246 460 244 570"
              stroke="#0D1F38"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.5"
              fill="none"
            />
            {/* Pliegues laterales */}
            <path
              d="M210 278 C205 360 200 455 198 568"
              stroke="#0D1F38"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.4"
              fill="none"
            />
            <path
              d="M290 278 C295 360 300 455 302 568"
              stroke="#0D1F38"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.4"
              fill="none"
            />
            {/* Pliegues adicionales ondeantes */}
            <path
              d="M175 290 C170 370 165 450 162 560"
              stroke="#2C6098"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.3"
              fill="none"
            />
            <path
              d="M325 290 C330 370 335 450 338 560"
              stroke="#2C6098"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.3"
              fill="none"
            />
            {/* Dobladillo inferior ondeante */}
            <path
              d="M115 572 C140 565 190 560 250 560 C310 560 360 565 385 572 L388 585 C360 578 310 574 250 574 C190 574 140 578 112 585 Z"
              fill="#0D1F38"
              opacity="0.7"
            />
            {/* Faja/cinturón dorado */}
            <path
              d="M175 268 L325 268 L325 280 L175 280 Z"
              fill="url(#tun-faja)"
              opacity="0.85"
            />
            <ellipse cx="250" cy="274" rx="15" ry="8" fill="#D4A017" opacity="0.6" />

            {/* ===== TELA ONDEANTE LATERAL (manto exterior) ===== */}
            {/* Manto izquierdo al viento */}
            <path
              d="M148 260 C132 285 118 320 110 365 C105 395 108 428 118 458 C130 442 142 412 148 380 C150 348 148 310 148 280 Z"
              fill="url(#tun-manto)"
              opacity="0.9"
            />
            {/* Pliegues del manto izquierdo */}
            <path
              d="M130 290 C122 330 118 380 122 425"
              stroke="#0A1526"
              strokeWidth="2"
              opacity="0.5"
              fill="none"
            />
            {/* Manto derecho al viento */}
            <path
              d="M352 260 C368 285 382 320 390 365 C395 395 392 428 382 458 C370 442 358 412 352 380 C350 348 352 310 352 280 Z"
              fill="url(#tun-manto)"
              opacity="0.9"
            />
            {/* Pliegues del manto derecho */}
            <path
              d="M370 290 C378 330 382 380 378 425"
              stroke="#0A1526"
              strokeWidth="2"
              opacity="0.5"
              fill="none"
            />

            {/* ===== BRAZOS ALZADOS EN ALABANZA ===== */}
            {/* Brazo izquierdo alzado */}
            <path
              d="M148 262 C128 240 108 215 88 192 C80 184 74 180 72 185 C70 192 75 202 85 210 C102 225 118 248 132 268 Z"
              fill="url(#tun-piel)"
            />
            {/* Manga izquierda ondeante */}
            <path
              d="M148 262 C138 248 125 232 108 215 C100 207 92 200 86 198 C100 215 118 240 132 262 Z"
              fill="url(#tun-azul)"
              opacity="0.85"
            />
            {/* Mano izquierda */}
            <path
              d="M68 182 C65 176 68 170 74 170 C76 168 80 170 82 174 L88 192 C82 196 73 192 68 182 Z"
              fill="url(#tun-piel)"
            />
            {/* Dedos de la mano izquierda */}
            <path d="M68 182 L62 174 M72 180 L66 170 M76 180 L72 169 M82 183 L80 171"
              stroke="url(#tun-piel)" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Brazo derecho alzado */}
            <path
              d="M352 262 C372 240 392 215 412 192 C420 184 426 180 428 185 C430 192 425 202 415 210 C398 225 382 248 368 268 Z"
              fill="url(#tun-piel)"
            />
            {/* Manga derecha ondeante */}
            <path
              d="M352 262 C362 248 375 232 392 215 C400 207 408 200 414 198 C400 215 382 240 368 262 Z"
              fill="url(#tun-azul)"
              opacity="0.85"
            />
            {/* Mano derecha */}
            <path
              d="M432 182 C435 176 432 170 426 170 C424 168 420 170 418 174 L412 192 C418 196 427 192 432 182 Z"
              fill="url(#tun-piel)"
            />
            {/* Dedos de la mano derecha */}
            <path d="M432 182 L438 174 M428 180 L434 170 M424 180 L428 169 M418 183 L420 171"
              stroke="url(#tun-piel)" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* ===== TORSO / HOMBROS ===== */}
            <path
              d="M148 262 C148 248 155 235 165 228 C185 218 215 215 250 215 C285 215 315 218 335 228 C345 235 352 248 352 262 Z"
              fill="url(#tun-azul)"
            />

            {/* ===== CUELLO ===== */}
            <path
              d="M220 185 C220 175 232 168 250 168 C268 168 280 175 280 185 L278 215 C272 222 262 226 250 226 C238 226 228 222 222 215 Z"
              fill="url(#tun-piel)"
            />

            {/* ===== CABEZA INCLINADA HACIA ADELANTE (perfil / sin rostro) ===== */}
            {/* Cabeza inclinada en reverencia/oración */}
            <ellipse cx="250" cy="150" rx="44" ry="48" fill="url(#tun-piel)" transform="rotate(15 250 150)" />
            {/* Manto que cubre la cabeza */}
            <path
              d="M205 118 C205 88 220 65 250 62 C280 65 295 90 295 120 C295 148 285 165 272 175 C258 185 240 188 228 182 C212 174 205 148 205 118 Z"
              fill="url(#tun-capucha)"
            />
            {/* Pliegues del manto de cabeza */}
            <path
              d="M220 72 C218 92 216 112 215 132"
              stroke="#2C6098"
              strokeWidth="2"
              opacity="0.4"
              fill="none"
            />
            <path
              d="M238 66 C236 86 235 108 234 128"
              stroke="#2C6098"
              strokeWidth="2"
              opacity="0.4"
              fill="none"
            />
            {/* Manto cayendo de la cabeza hacia los hombros */}
            <path
              d="M205 120 C200 140 196 162 194 185 C200 192 212 198 225 200 C220 180 215 158 212 136 Z"
              fill="url(#tun-capucha)"
              opacity="0.9"
            />
            <path
              d="M295 120 C300 140 304 162 306 185 C300 192 288 198 275 200 C280 180 285 158 288 136 Z"
              fill="url(#tun-capucha)"
              opacity="0.9"
            />
            {/* Zona del "rostro" cubierta por sombra de la cabeza inclinada */}
            <path
              d="M220 130 C220 115 230 108 250 106 C270 108 280 115 280 130 C280 148 272 162 258 170 C248 175 240 174 232 168 C222 160 220 146 220 130 Z"
              fill="#1E3A5F"
              opacity="0.8"
            />
            {/* Luz dorada en la parte superior de la cabeza */}
            <ellipse cx="250" cy="78" rx="30" ry="16" fill="#E5C88A" opacity="0.4" />
            <ellipse cx="250" cy="70" rx="18" ry="10" fill="#E5C88A" opacity="0.5" />

            {/* ===== HIGHLIGHTS DE LA TÚNICA ===== */}
            {/* Reflejo de la luz celestial en la tela */}
            <path
              d="M250 282 C248 362 246 462 244 562"
              stroke="#3A7AB8"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.2"
              fill="none"
            />
            {/* Brillos dorados de la luz */}
            <path
              d="M220 270 C215 320 212 390 210 460"
              stroke="#D4A017"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.15"
              fill="none"
            />
          </svg>
        );

      case "multitud":
        return (
          // Multitud de 7 personas a distintas distancias con profundidad
          <svg
            width="580"
            height="500"
            viewBox="0 0 580 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradientes para la multitud - variedad de colores */}
              <linearGradient id="mul-rojo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C41E3A" />
                <stop offset="100%" stopColor="#6B0F1E" />
              </linearGradient>
              <linearGradient id="mul-azul" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2C6098" />
                <stop offset="100%" stopColor="#0D1F38" />
              </linearGradient>
              <linearGradient id="mul-cafe" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A0714F" />
                <stop offset="100%" stopColor="#5C3A1E" />
              </linearGradient>
              <linearGradient id="mul-verde" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2D5A3D" />
                <stop offset="100%" stopColor="#132A1C" />
              </linearGradient>
              <linearGradient id="mul-arena" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4A373" />
                <stop offset="100%" stopColor="#8B6040" />
              </linearGradient>
              <linearGradient id="mul-violeta" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B3A8C" />
                <stop offset="100%" stopColor="#3A1A50" />
              </linearGradient>
              <linearGradient id="mul-dorado" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4A017" />
                <stop offset="100%" stopColor="#8B6914" />
              </linearGradient>
              {/* Gradiente piel */}
              <linearGradient id="mul-piel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C4845A" />
                <stop offset="100%" stopColor="#8B5A30" />
              </linearGradient>
              {/* Resplandor de multitud */}
              <radialGradient id="mul-glow" cx="50%" cy="60%" r="55%">
                <stop offset="0%" stopColor="#D4A017" stopOpacity="0.0" />
                <stop offset="70%" stopColor="#D4A017" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#D4A017" stopOpacity="0.25" />
              </radialGradient>
              <filter id="mul-rimglow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="glow" />
                <feColorMatrix in="glow" type="matrix"
                  values="1 0.8 0 0 0  0.8 0.6 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
              </filter>
            </defs>

            {/* Sombra en el suelo */}
            <ellipse cx="290" cy="494" rx="275" ry="10" fill="#05080F" opacity="0.7" />

            {/* Resplandor de fondo */}
            <ellipse cx="290" cy="300" rx="270" ry="220" fill="url(#mul-glow)" filter="url(#mul-rimglow)" />

            {/* ============================================================ */}
            {/* FILA DEL FONDO - 3 personas, más pequeñas, opacidad reducida  */}
            {/* ============================================================ */}

            {/* Persona fondo 1 - izquierda, túnica verde */}
            <g opacity="0.45">
              <ellipse cx="92" cy="490" rx="38" ry="4" fill="#020508" />
              <ellipse cx="92" cy="225" rx="22" ry="24" fill="url(#mul-verde)" />
              <path d="M68 252 C66 310 64 380 62 490 L122 490 L120 380 L118 252 C108 258 100 262 92 262 C84 262 76 258 68 252 Z"
                fill="url(#mul-verde)" />
              <path d="M68 254 C58 240 48 225 40 215 L44 232 L60 258 Z" fill="url(#mul-verde)" />
              <path d="M118 254 C122 240 128 225 132 212 L128 230 L118 258 Z" fill="url(#mul-verde)" />
              <path d="M78 268 C76 330 74 405 73 480" stroke="#132A1C" strokeWidth="2" opacity="0.4" fill="none" />
            </g>

            {/* Persona fondo 2 - centro, túnica azul, brazos alzados */}
            <g opacity="0.48">
              <ellipse cx="295" cy="490" rx="40" ry="4" fill="#020508" />
              <ellipse cx="295" cy="205" rx="24" ry="26" fill="url(#mul-azul)" />
              <path d="M268 234 C266 295 264 370 262 490 L328 490 L326 370 L324 234 C314 240 306 244 295 244 C284 244 276 240 268 234 Z"
                fill="url(#mul-azul)" />
              {/* Brazos alzados - de fondo */}
              <path d="M268 236 C255 218 244 198 238 185 L242 202 L260 240 Z" fill="url(#mul-azul)" />
              <path d="M324 236 C337 218 348 198 354 185 L350 202 L332 240 Z" fill="url(#mul-azul)" />
              <path d="M276 248 C274 318 272 398 272 478" stroke="#0D1F38" strokeWidth="2" opacity="0.4" fill="none" />
            </g>

            {/* Persona fondo 3 - derecha, túnica dorada */}
            <g opacity="0.42">
              <ellipse cx="490" cy="490" rx="38" ry="4" fill="#020508" />
              <ellipse cx="490" cy="220" rx="22" ry="24" fill="url(#mul-dorado)" />
              <path d="M466 248 C464 308 462 380 460 490 L520 490 L518 380 L516 248 C506 254 498 258 490 258 C482 258 474 254 466 248 Z"
                fill="url(#mul-dorado)" />
              <path d="M466 250 C458 235 452 218 448 208 L452 224 L464 254 Z" fill="url(#mul-dorado)" />
              <path d="M516 250 C522 235 528 218 532 208 L528 225 L518 254 Z" fill="url(#mul-dorado)" />
            </g>

            {/* ============================================================ */}
            {/* FILA DEL MEDIO - 2 personas, tamaño medio, opacidad media     */}
            {/* ============================================================ */}

            {/* Persona medio 1 - izquierda, túnica violeta */}
            <g opacity="0.72">
              <ellipse cx="155" cy="492" rx="48" ry="5" fill="#030610" />
              <ellipse cx="155" cy="208" rx="27" ry="29" fill="url(#mul-violeta)" />
              <path d="M124 240 C122 305 118 385 116 492 L194 492 L192 385 L188 240 C178 248 168 254 155 254 C142 254 132 248 124 240 Z"
                fill="url(#mul-violeta)" />
              <path d="M124 242 C112 225 100 205 92 192 L96 210 L118 248 Z" fill="url(#mul-violeta)" />
              <path d="M136 258 C134 332 132 418 130 480" stroke="#3A1A50" strokeWidth="2.5" opacity="0.4" fill="none" />
              <path d="M158 258 C157 332 156 418 155 480" stroke="#3A1A50" strokeWidth="2.5" opacity="0.35" fill="none" />
            </g>

            {/* Persona medio 2 - derecha, túnica roja, brazo en alto */}
            <g opacity="0.75">
              <ellipse cx="420" cy="492" rx="48" ry="5" fill="#030610" />
              <ellipse cx="420" cy="205" rx="27" ry="30" fill="url(#mul-rojo)" />
              <path d="M390 238 C388 302 386 382 384 492 L456 492 L454 382 L450 238 C440 246 430 252 420 252 C410 252 400 246 390 238 Z"
                fill="url(#mul-rojo)" />
              {/* Brazo derecho en alto */}
              <path d="M450 240 C462 222 474 202 480 188 L476 206 L454 246 Z" fill="url(#mul-rojo)" />
              {/* Mano en alto */}
              <ellipse cx="482" cy="183" rx="10" ry="12" fill="url(#mul-piel)" transform="rotate(-20 482 183)" />
              <path d="M402 252 C400 328 398 418 397 480" stroke="#6B0F1E" strokeWidth="2.5" opacity="0.4" fill="none" />
            </g>

            {/* ============================================================ */}
            {/* PRIMER PLANO - 2 personas, más grandes y detalladas           */}
            {/* ============================================================ */}

            {/* Persona primer plano 1 - izquierda, túnica arena/cálida */}
            <g opacity="0.95">
              <ellipse cx="170" cy="494" rx="60" ry="6" fill="#04080F" />
              {/* Cabeza */}
              <ellipse cx="170" cy="188" rx="34" ry="37" fill="url(#mul-piel)" />
              {/* Manto cabeza */}
              <path d="M136 175 C135 148 148 128 170 125 C192 128 205 148 205 175 C205 198 198 215 188 222 C178 228 158 228 150 220 C140 212 136 196 136 175 Z"
                fill="url(#mul-arena)" />
              <path d="M136 178 C128 198 124 222 122 248 C130 258 145 265 158 265 C152 242 148 218 146 194 Z"
                fill="url(#mul-arena)" opacity="0.9" />
              {/* Cuerpo */}
              <path d="M128 258 C122 335 116 415 112 496 L228 496 L224 415 L218 258 C206 268 190 274 170 274 C150 274 134 268 128 258 Z"
                fill="url(#mul-arena)" />
              {/* Pliegues */}
              <path d="M168 272 C166 350 164 430 162 486" stroke="#8B6040" strokeWidth="2.5" opacity="0.4" fill="none" />
              <path d="M185 272 C187 350 188 430 188 486" stroke="#8B6040" strokeWidth="2" opacity="0.3" fill="none" />
              {/* Brazos */}
              <path d="M128 260 C115 243 102 222 95 208 L99 226 L122 268 Z" fill="url(#mul-arena)" />
              <path d="M218 260 C228 244 238 224 244 210 L240 228 L222 268 Z" fill="url(#mul-arena)" />
              {/* Mano en alto */}
              <ellipse cx="92" cy="203" rx="11" ry="13" fill="url(#mul-piel)" transform="rotate(10 92 203)" />
              {/* Dobladillo */}
              <path d="M112 488 C140 483 160 480 170 480 C180 480 200 483 228 488 L228 496 L112 496 Z"
                fill="#6B4A28" opacity="0.6" />
            </g>

            {/* Persona primer plano 2 - centro-derecha, túnica café, dos brazos en alto */}
            <g opacity="0.98">
              <ellipse cx="380" cy="494" rx="65" ry="6" fill="#04080F" />
              {/* Cabeza */}
              <ellipse cx="380" cy="175" rx="36" ry="40" fill="url(#mul-piel)" />
              {/* Manto cabeza azul */}
              <path d="M344 162 C343 132 357 110 380 108 C403 110 417 132 417 162 C417 188 410 206 400 214 C388 221 368 222 360 214 C348 205 344 188 344 162 Z"
                fill="url(#mul-azul)" />
              <path d="M344 165 C335 188 330 215 328 244 C338 255 354 262 368 262 C362 236 356 210 353 185 Z"
                fill="url(#mul-azul)" opacity="0.9" />
              <path d="M417 165 C425 188 430 215 432 244 C422 255 406 262 392 262 C398 236 404 210 407 185 Z"
                fill="url(#mul-azul)" opacity="0.9" />
              {/* Cuerpo */}
              <path d="M328 248 C320 328 314 415 310 496 L450 496 L446 415 L440 248 C428 260 406 268 380 268 C354 268 332 260 328 248 Z"
                fill="url(#mul-cafe)" />
              {/* Pliegues */}
              <path d="M378 265 C376 345 374 428 373 485" stroke="#5C3A1E" strokeWidth="3" opacity="0.4" fill="none" />
              <path d="M355 265 C352 345 350 428 349 485" stroke="#5C3A1E" strokeWidth="2" opacity="0.3" fill="none" />
              <path d="M400 265 C403 345 404 428 405 485" stroke="#5C3A1E" strokeWidth="2" opacity="0.3" fill="none" />
              {/* Brazos alzados en alabanza */}
              <path d="M328 250 C312 228 296 204 285 188 L290 208 L322 260 Z" fill="url(#mul-cafe)" />
              <path d="M440 250 C455 228 468 204 480 185 L476 206 L444 260 Z" fill="url(#mul-cafe)" />
              {/* Manos alzadas */}
              <ellipse cx="282" cy="183" rx="12" ry="14" fill="url(#mul-piel)" transform="rotate(-10 282 183)" />
              <ellipse cx="483" cy="180" rx="12" ry="14" fill="url(#mul-piel)" transform="rotate(10 483 180)" />
              {/* Dedos de las manos */}
              <path d="M276 180 L270 170 M280 177 L275 166 M285 176 L282 165 M290 178 L288 167"
                stroke="url(#mul-piel)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M488 177 L494 167 M484 174 L489 163 M479 174 L482 163 M474 176 L476 165"
                stroke="url(#mul-piel)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Dobladillo */}
              <path d="M310 488 C340 483 362 480 380 480 C398 480 420 483 450 488 L450 496 L310 496 Z"
                fill="#3A2010" opacity="0.6" />
            </g>
          </svg>
        );

      case "duelo":
        return (
          // Duelo bíblico: David (joven con honda/cayado) frente al gigante Goliat en el valle de Ela
          <svg
            width="620"
            height="620"
            viewBox="0 0 620 620"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0 20px 35px rgba(0,0,0,0.75))" }}
          >
            <defs>
              <linearGradient id="due-david" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C49A6C" />
                <stop offset="50%" stopColor="#8B5E3C" />
                <stop offset="100%" stopColor="#4A2E18" />
              </linearGradient>
              <linearGradient id="due-goliat" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3A2C38" />
                <stop offset="60%" stopColor="#1E1622" />
                <stop offset="100%" stopColor="#0B0810" />
              </linearGradient>
              <radialGradient id="due-aura-david" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.0" />
              </radialGradient>
            </defs>

            {/* Suelo y sombras del valle */}
            <ellipse cx="140" cy="580" rx="90" ry="12" fill="#0A0604" opacity="0.6" />
            <ellipse cx="440" cy="585" rx="150" ry="16" fill="#060308" opacity="0.75" />

            {/* Aura dorada de fe detrás de David */}
            <circle cx="140" cy="400" r="140" fill="url(#due-aura-david)" />

            {/* ===== JOVEN DAVID (Izquierda, altura moderada ~330px) ===== */}
            <g id="david-figure">
              {/* Cayado de pastor en la mano */}
              <line x1="75" y1="260" x2="70" y2="580" stroke="#D4A373" strokeWidth="6" strokeLinecap="round" />
              <path d="M75 260 C75 235 90 220 105 228 C115 235 110 250 95 245" stroke="#D4A373" strokeWidth="6" fill="none" />

              {/* Cabeza de David con manto sencillo */}
              <ellipse cx="140" cy="290" rx="28" ry="32" fill="#E8D5A3" />
              <path d="M120 280 C120 255 140 240 160 240 C175 240 185 252 185 275 C185 295 175 315 165 320 L135 320 Z" fill="url(#due-david)" />

              {/* Túnica ágil de pastor */}
              <path d="M115 320 C105 370 95 440 90 530 L195 530 C190 440 180 370 170 320 Z" fill="url(#due-david)" />
              {/* Pliegues de túnica */}
              <line x1="140" y1="330" x2="138" y2="525" stroke="#FBBF24" strokeWidth="2.5" opacity="0.6" />

              {/* Brazo con honda preparada */}
              <path d="M165 340 L205 385 L215 425" stroke="url(#due-david)" strokeWidth="14" strokeLinecap="round" fill="none" />
              <line x1="215" y1="425" x2="225" y2="480" stroke="#FBBF24" strokeWidth="3" />
              {/* Bolsa de piedras al cinto */}
              <ellipse cx="120" cy="410" rx="14" ry="18" fill="#8B6914" />
            </g>

            {/* ===== GOLIAT EL GIGANTE (Derecha, altura masiva ~560px) ===== */}
            <g id="goliat-figure">
              {/* Lanza monumental de bronce */}
              <line x1="535" y1="40" x2="525" y2="585" stroke="#C49A45" strokeWidth="10" strokeLinecap="round" />
              {/* Punta de lanza de bronce */}
              <polygon points="536,15 522,55 550,55" fill="#EAB308" />

              {/* Penacho rojo del casco */}
              <path d="M420 85 C430 45 465 40 480 60 C495 78 480 100 475 108 Z" fill="#DC2626" />

              {/* Casco imponente de bronce */}
              <path d="M405 105 C405 75 435 65 465 65 C495 65 520 80 520 110 C520 145 510 168 505 178 L415 178 Z" fill="url(#due-goliat)" />
              {/* Banda dorada del casco */}
              <path d="M410 145 L515 145" stroke="#EAB308" strokeWidth="6" />

              {/* Hombros gigantescos con coraza de escamas */}
              <path d="M340 185 C370 170 435 175 470 175 C510 175 565 170 590 190 C600 240 590 320 585 365 L345 365 C340 320 330 240 340 185 Z" fill="url(#due-goliat)" />
              <line x1="360" y1="210" x2="570" y2="210" stroke="#C49A45" strokeWidth="4" opacity="0.6" />
              <line x1="370" y1="250" x2="560" y2="250" stroke="#C49A45" strokeWidth="4" opacity="0.5" />

              {/* Escudo colosal redondo */}
              <ellipse cx="365" cy="350" rx="55" ry="110" fill="#1C1824" stroke="#EAB308" strokeWidth="7" />
              <ellipse cx="365" cy="350" rx="20" ry="40" fill="#EAB308" opacity="0.7" />

              {/* Piernas y falda de combate con canilleras de bronce */}
              <path d="M375 365 L555 365 L575 530 L355 530 Z" fill="url(#due-goliat)" />
              <rect x="390" y="515" width="55" height="70" rx="10" fill="#C49A45" />
              <rect x="495" y="515" width="55" height="70" rx="10" fill="#C49A45" />
            </g>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: `calc(120px + ${breathe}px)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        zIndex: 10,
        pointerEvents: "none",
        ...alignStyle,
      }}
    >
      {renderSvg()}
    </div>
  );
};
