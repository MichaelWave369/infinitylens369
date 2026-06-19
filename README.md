# InfinityLens369

**Drop a song. Open a portal.**

InfinityLens369 is a public, browser-based fractal atlas and audio-reactive visualization engine. It turns local audio files into live GPU visuals, trip modes, symbolic geometry overlays, palette shifts, cinematic performance controls, transition bridges, audio-engine shaping, Liquid Light presets, and replayable visual-address receipts.

This project is intentionally claim-safe: it is an art, math, and software visualization tool. It is **not** a physics proof, consciousness proof, medical tool, or scientific claim engine.

## v1.4 Liquid Light Pack release

v1.4 keeps the v1.3 Audio Engine v2 and wires the first **Liquid Light Pack** directly into the live app. These are softer, calmer, more hypnotic trip experiences built from the stable shader engine so the public build can stay green while the visual family grows.

New Liquid Light presets:

- **Aurora Veil** — soft aurora curtains with calm shimmer.
- **Liquid Glass** — refractive glass flow and watery ribbons.
- **Plasma Garden** — organic mandala blooms with gentle pulse.
- **Dream Pool** — slow reflective cosmic pool.

The app now launches into the calmer Aurora Veil-style v1.4 default scene and exposes Liquid Light one-click preset chips in the control panel.

## Core features

- Drag/drop `.mp3`, `.wav`, `.ogg`, `.oga`, `.m4a`, `.aac`, `.flac`, or `.webm` audio files
- Local-first playback: your audio stays in your browser
- Web Audio analysis for bass, mids, highs, waveform energy, and beat pulses
- Audio Engine v2 signal shaping before the shader engine
- GPU visual engine using WebGL2
- Eight visual shader modes:
  - Black Hole Lens
  - Cosmic Drift
  - Pixel Melt
  - Kaleido Trip
  - Tunnel Bloom
  - Acid Melt
  - Mandelbrot
  - Julia Mirror
- Liquid Light Pack presets built from stable shader routes
- Trip presets and random trip generation
- Transition Engine for smoother mode/preset bridges
- Safe Mode and Reset Visuals for public demos
- Auto Trip mode for cycling presets during playback
- Audio speed / drive plus per-band impact controls
- Motion profiles: Dream, Cruise, Live, and Warp
- Cinematic view and browser fullscreen control
- Keyboard performance shortcuts
- Phi spiral, 3-6-9 grid, and equation/signal overlays
- Replayable visual-address receipts
- PNG screenshot export
- JSON receipt export

## Quick start

```bash
npm install
npm run dev
```

Then open the local Vite URL, drop an audio file, press play, and start steering the lens.

## Build

```bash
npm run build
npm run preview
```

## Deploy

This repo includes a GitHub Pages workflow at `.github/workflows/deploy.yml`.

After pushing to `main`, enable GitHub Pages in the repository settings and choose **GitHub Actions** as the Pages source.

## Performance controls

The app can be used with the side panel or as a full-screen visual instrument.

### Keyboard shortcuts

```text
Space  play / pause
C      cinematic view
F      browser fullscreen
N      next trip preset
R      random trip
T      cycle transition style
S      slow flow
A      auto trip
0      safe mode
1      Dream motion profile
2      Cruise motion profile
3      Live motion profile
4      Warp motion profile
```

### Liquid Light Pack

Liquid Light is a softer preset family for public demos, ambient music, projector use, chill sessions, and slower visual journeys.

- **Aurora Veil** uses Cosmic Drift with Aurora Phi, very low audio drive, soft high sparkle, and slow motion.
- **Liquid Glass** uses Acid Melt with Abyss Cyan, lower beat punch, and smooth midrange flow.
- **Plasma Garden** uses Kaleido Trip with gentle mid-driven bloom.
- **Dream Pool** uses Cosmic Drift with low response, moderate glow, and reflective slow motion.

### Audio Engine v2

Audio Engine v2 shapes the raw Web Audio analysis before it reaches the visual shaders.

Controls:

- **Audio speed / drive** — global reactivity level
- **Response** — smooth drift at low values, snappy stage motion at high values
- **Bass impact** — how much bass pushes the visuals
- **Mids motion** — how much midrange drives flow and geometry
- **High sparkle** — how much highs add shimmer, detail, and pixel/glow activity
- **Beat punch** — how strongly beat/onset pulses land

If audio-reactive motion feels too fast, lower **Audio speed / drive**, lower **Response**, press **S** for Slow Flow, or press **0** for Safe Mode.

### Transition Engine

The Transition Engine creates a bridge overlay before visual-state changes land. It does not replace the shader engine; it wraps it with stage-level motion so changes feel intentional instead of abrupt.

Available transition styles:

- **Bloom Flash** — bright portal flare
- **Warp Tunnel** — radial lens sweep
- **Glitch Cut** — pixel tear jump
- **Soft Fade** — gentle crossfade veil
- **Beat Pulse** — ring pulse bridge

Use the **Morph speed** slider to tune how long the bridge lasts.

### Motion profiles

- **Dream** — slow ambient drift
- **Cruise** — smooth balanced motion
- **Live** — stage-ready energy
- **Warp** — maximum face-melt

## Safe Mode

Safe Mode switches the engine into a calmer, lower-motion configuration:

- Cosmic Drift mode
- Audio reactive off
- Low motion pressure
- Low audio drive
- Gentle Audio Engine v2 band settings
- Lower glow
- Geometry/equation overlays off

It is meant for public demos, older hardware, browser uncertainty, and projection setups where stability matters more than maximum intensity.

## Visual addresses

Every scene can be saved as a portable address:

```text
INFINITYLENS369://scene?mode=cosmic-drift&center=-0.743643887037151,0.13182590420533&zoom=1.000e+0&palette=aurora-phi&overlays=phi&audio=bass-reactive&time=42.369
```

The address is not a scientific claim. It is a replay cue for the visual state: formula/mode, center, zoom, palette, overlays, and audio time. v1.4 receipts include Transition Engine and Audio Engine v2 settings.

## Project stance

InfinityLens369 is for:

- Fractal and shader exploration
- Music video source visuals
- Live projection / ambient art
- Math-inspired creativity
- Local-first audio-reactive visuals
- Parallax-style symbolic overlays with clean boundaries

InfinityLens369 is not for:

- Claiming proof of hidden physics
- Medical, psychological, or spiritual diagnosis
- Representing generated visuals as empirical evidence

## v2.0 direction

The v2.0 roadmap can add standalone Liquid Light shaders, machine/circuit modes, preset studio, WebM/GIF recording, performance controller support, and composable visual layers.

## License

MIT — see `LICENSE`.
