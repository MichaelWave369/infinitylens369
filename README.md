# InfinityLens369

**Drop a song. Open a portal.**

InfinityLens369 is a public, browser-based fractal atlas and audio-reactive visualization engine. It turns local audio files into live GPU visuals, trip modes, symbolic geometry overlays, palette shifts, cinematic performance controls, and replayable visual-address receipts.

This project is intentionally claim-safe: it is an art, math, and software visualization tool. It is **not** a physics proof, consciousness proof, medical tool, or scientific claim engine.

## v1.0 features

- Drag/drop `.mp3`, `.wav`, `.ogg`, or `.m4a` audio files
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

If audio-reactive motion feels too fast, lower **Audio speed / drive** or press **S** for Slow Flow.

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

## v1.0 release stance

v1.0 is the first public studio release. It is stable enough to demo, perform with, remix, and build on. It is not the final engine. Future work can add saved preset galleries, shareable URL state, WebM capture, deep-zoom fractal math, and additional shader packs.

## License

MIT — see `LICENSE`.
