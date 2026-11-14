#!/usr/bin/env python3
"""
Genera efectos de sonido y música de fondo de muestra en MP3 de alta calidad para el proyecto.
El usuario puede utilizarlos directamente o reemplazarlos con sus propios audios en public/sfx/ y public/music/.
"""

import math
import random
import struct
from pathlib import Path
import lameenc

SAMPLE_RATE = 44100
SFX_DIR = Path("public/sfx")
MUSIC_DIR = Path("public/music")

SFX_DIR.mkdir(parents=True, exist_ok=True)
MUSIC_DIR.mkdir(parents=True, exist_ok=True)


def encode_and_save(samples: list, filepath: Path, sample_rate: int = SAMPLE_RATE):
    """Codifica una lista de enteros PCM 16-bit a MP3 (192 kbps) y lo guarda."""
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(192)
    encoder.set_in_sample_rate(sample_rate)
    encoder.set_channels(1)
    encoder.set_quality(2)

    raw_data = struct.pack(f"<{len(samples)}h", *samples)
    mp3_data = encoder.encode(raw_data) + encoder.flush()

    with open(filepath, "wb") as f:
        f.write(mp3_data)
    print(f"   ✓ Creado: {filepath} ({len(samples)/sample_rate:.2f}s)")


def gen_whoosh():
    """Whoosh suave: ruido blanco filtrado con barrido de volumen ascendente y descendente."""
    duration = 0.55
    total_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    # Ruido con envolvente suave (Hann / Gaussiana)
    for i in range(total_samples):
        t = i / total_samples
        # Envolvente acampanada
        env = math.sin(math.pi * t) ** 2.2
        # Tono de aire modulado
        freq = 300 + 700 * math.sin(math.pi * t)
        noise = (random.random() * 2 - 1) * 0.7
        sine = math.sin(2 * math.pi * freq * (i / SAMPLE_RATE)) * 0.3
        val = int(32767 * 0.5 * env * (noise + sine))
        samples.append(max(-32767, min(32767, val)))
        
    encode_and_save(samples, SFX_DIR / "whoosh.mp3")


def gen_impacto():
    """Impacto cinematográfico: sub-bajo profundo con golpe inicial y caída."""
    duration = 1.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    for i in range(total_samples):
        t = i / SAMPLE_RATE
        # Golpe inicial decae exponencialmente
        env = math.exp(-4.5 * t)
        # Frecuencia desciende de 110Hz a 42Hz
        freq = 42 + 68 * math.exp(-12.0 * t)
        bass = math.sin(2 * math.pi * freq * t)
        # Transitorio rápido inicial
        transient = (random.random() * 2 - 1) * math.exp(-45 * t) * 0.35
        val = int(32767 * 0.75 * env * (bass + transient))
        samples.append(max(-32767, min(32767, val)))
        
    encode_and_save(samples, SFX_DIR / "impacto.mp3")


def gen_trueno():
    """Trueno profundo: estruendo de frecuencias bajas con modulaciones orgánicas."""
    duration = 2.2
    total_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    smooth_noise = 0.0
    for i in range(total_samples):
        t = i / SAMPLE_RATE
        # Envolvente con inicio rápido y resonancia larga
        attack = min(1.0, t / 0.15)
        decay = math.exp(-1.4 * t)
        env = attack * decay
        
        # Filtro paso-bajo simple para crear rugido
        white = random.random() * 2 - 1
        smooth_noise = smooth_noise * 0.94 + white * 0.06
        
        sub = math.sin(2 * math.pi * 50 * t + smooth_noise * 2) * 0.5
        val = int(32767 * 0.65 * env * (smooth_noise * 2.5 + sub))
        samples.append(max(-32767, min(32767, val)))
        
    encode_and_save(samples, SFX_DIR / "trueno.mp3")


def gen_campana():
    """Campana solemne: tono armónico con rica reverberación metálica."""
    duration = 2.4
    total_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    # Frecuencias armónicas de campana tubular
    harmonics = [
        (440.0, 1.0, 2.0),
        (884.0, 0.6, 2.8),
        (1320.0, 0.4, 3.5),
        (1760.0, 0.25, 4.5),
        (2200.0, 0.15, 6.0),
    ]
    
    for i in range(total_samples):
        t = i / SAMPLE_RATE
        sig = 0.0
        for freq, amp, dec in harmonics:
            sig += amp * math.sin(2 * math.pi * freq * t) * math.exp(-dec * t)
        val = int(32767 * 0.4 * sig)
        samples.append(max(-32767, min(32767, val)))
        
    encode_and_save(samples, SFX_DIR / "campana.mp3")


def gen_suspenso():
    """Drone de suspenso: acorde menor sostenido con oscilaciones lentas."""
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    freqs = [110.0, 130.81, 164.81] # La menor
    
    for i in range(total_samples):
        t = i / SAMPLE_RATE
        env = math.sin(math.pi * (t / duration)) ** 0.5
        tremolo = 0.85 + 0.15 * math.sin(2 * math.pi * 3.5 * t)
        sig = 0.0
        for f in freqs:
            sig += math.sin(2 * math.pi * f * t)
        val = int(32767 * 0.25 * env * tremolo * (sig / len(freqs)))
        samples.append(max(-32767, min(32767, val)))
        
    encode_and_save(samples, SFX_DIR / "suspenso.mp3")


def gen_brillo():
    """Brillo celestial: arpegio pentatónico cristalino ascendente."""
    duration = 1.3
    total_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    # Notas agudas cristalinas (C6, E6, G6, B6, C7)
    notes = [
        (0.00, 1046.5),
        (0.12, 1318.5),
        (0.24, 1567.9),
        (0.36, 1975.5),
        (0.48, 2093.0),
    ]
    
    for i in range(total_samples):
        t = i / SAMPLE_RATE
        sig = 0.0
        for start_t, freq in notes:
            if t >= start_t:
                dt = t - start_t
                sig += math.sin(2 * math.pi * freq * dt) * math.exp(-4.5 * dt)
        val = int(32767 * 0.35 * sig)
        samples.append(max(-32767, min(32767, val)))
        
    encode_and_save(samples, SFX_DIR / "brillo.mp3")


def gen_pop():
    """Pop suave: golpe corto con caída de tono."""
    duration = 0.09
    total_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    for i in range(total_samples):
        t = i / SAMPLE_RATE
        env = math.sin(math.pi * (i / total_samples)) ** 2
        freq = 300 + 650 * (1 - i / total_samples)
        val = int(32767 * 0.45 * env * math.sin(2 * math.pi * freq * t))
        samples.append(max(-32767, min(32767, val)))
        
    encode_and_save(samples, SFX_DIR / "pop.mp3")


def gen_background_music():
    """Música de fondo bíblica: pad ambiental solemne, cálido y envolvente en loop."""
    duration = 20.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    # Acordes solemnes cálidos: D, F#, A (Re mayor / espiritual)
    chords = [
        # (t_inicio, t_fin, [frecuencias])
        (0.0, 7.0, [146.83, 220.0, 293.66, 370.0]),     # Re mayor
        (6.5, 13.5, [130.81, 196.0, 261.63, 329.63]),   # Do mayor / esperanza
        (13.0, 20.0, [146.83, 220.0, 293.66, 370.0]),   # Vuelve a Re mayor
    ]
    
    for i in range(total_samples):
        t = i / SAMPLE_RATE
        sig = 0.0
        for start_t, end_t, freqs in chords:
            if start_t <= t <= end_t:
                dur = end_t - start_t
                local_t = t - start_t
                env = math.sin(math.pi * (local_t / dur))
                for f in freqs:
                    sig += math.sin(2 * math.pi * f * t) * env
        
        # Leve sub-bajo continuo para calidez
        sub = math.sin(2 * math.pi * 73.41 * t) * 0.35
        val = int(32767 * 0.22 * (sig * 0.25 + sub))
        samples.append(max(-32767, min(32767, val)))
        
    encode_and_save(samples, MUSIC_DIR / "background.mp3")


def main():
    print("=== Generador de Efectos y Música de Fondo ===")
    print("1. Creando efectos de sonido en public/sfx/...")
    gen_whoosh()
    gen_impacto()
    gen_trueno()
    gen_campana()
    gen_suspenso()
    gen_brillo()
    gen_pop()
    print("2. Creando música de fondo en public/music/...")
    gen_background_music()
    print("✅ ¡Todos los efectos y música de muestra han sido generados exitosamente!")


if __name__ == "__main__":
    main()
