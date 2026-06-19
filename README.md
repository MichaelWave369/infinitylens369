# InfinityLens369

**Drop a song. Open a portal.**

InfinityLens369 is a public, browser-based fractal atlas and audio-reactive visualization engine. It turns local audio files into live GPU visuals, trip modes, symbolic geometry overlays, palette shifts, cinematic performance controls, and replayable visual-address receipts.

This project is intentionally claim-safe: it is an art, math, and software visualization tool. It is **not** a physics proof, consciousness proof, medical tool, or scientific claim engine.

## v1.1 public hardening release

v1.1 keeps the v1.0 visual engine intact and adds first-wave public release hardening:

- WebGL2 support check with a clear fallback message
- Safe Mode for older laptops, projectors, and lower-performance devices
- Reset Visuals button to return to the default release scene
- Better unsupported-file messaging for audio imports
- Playback/decode notices for browser audio errors
- Visible system-status card in the control panel
- Stage notice overlay for important runtime messages
- `0` hotkey for Safe Mode
- Issue templates for bug reports, visual ideas, and feature requests

## Core features

- Drag/drop `.mp3`, `.wav`, `.ogg`, `.oga`, `.m4a`, `.aac`, `.flac`, or `.webm` audio files
- Local-first playback: your audio stays in your browser
- Web Audio analysis for bass, mids, highs, waveform energy, and beat pulses
- GPU visual engine using WebGL2
- Eight visual modes:
  - Black Hole Lens
  - Cosmic Drift
  - Pixel Melt
  - Kaleido Trip
  - Tunnel Bloom
  - Acid Melt
  - Mandelbrot
  - Julia Mirror
- Trip presets and random trip generation
- Safe Mode and Reset Visuals for public demos
- Auto Trip mode for cycling presets during playback
- Audio speed / drive control for calming or intensifying audio-reactive motion
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
S      slow flow
A      auto trip
0      safe mode
1      Dream motion profile
2      Cruise motion profile
3      Live motion profile
4      Warp motion profile
```

### Motion profiles

- **Dream** — slow ambient drift
- **Cruise** — smooth balanced motion
- **Live** — stage-ready energy
- **Warp** — maximum face-melt

If audio-reactive motion feels too fast, lower **Audio speed / drive**, press **S** for Slow Flow, or press **0** for Safe Mode.

## Safe Mode

Safe Mode switches the engine into a calmer, lower-motion configuration:

- Cosmic Drift mode
- Audio reactive off
- Low motion pressure
- Low audio drive
- Lower glow
- Geometry/equation overlays off

It is meant for public demos, older hardware, browser uncertainty, and projection setups where stability matters more than maximum intensity.

## Visual addresses

Every scene can be saved as a portable address:

```text
INFINITYLENS369://scene?mode=black-hole-lens&center=-0.743643887037151,0.13182590420533&zoom=1.000e+0&palette=solar-ember&overlays=none&audio=bass-reactive&time=42.369
```

The address is not a scientific claim. It is a replay cue for the visual state: formula/mode, center, zoom, palette, overlays, and audio time.

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

The v2.0 roadmap can add smooth mode transitions, audio engine v2, liquid light modes, machine/circuit modes, preset studio, WebM/GIF recording, performance controller support, and composable visual layers.

## License

MIT — see `LICENSE`.
