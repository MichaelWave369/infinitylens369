# InfinityLens369

**Drop a song. Open a portal.**

InfinityLens369 is a public, browser-based fractal atlas and audio-reactive visualization engine. It turns local audio files into live Mandelbrot/Julia motion, symbolic geometry overlays, palette shifts, and replayable visual addresses.

This project is intentionally claim-safe: it is an art, math, and software visualization tool. It is **not** a physics proof, consciousness proof, medical tool, or scientific claim engine.

## v0.1 features

- Drag/drop an `.mp3`, `.wav`, `.ogg`, or `.m4a` audio file
- Web Audio analysis for bass, mids, highs, waveform energy, and beat pulses
- GPU fractal canvas using WebGL2
- Mandelbrot and Julia modes
- Audio-reactive zoom, rotation, glow, and palette motion
- Phi spiral overlay
- 3-6-9 geometry grid overlay
- Equation/signal HUD overlay
- Replayable visual address receipts
- Screenshot export
- Local-first: your audio stays in your browser

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

## Visual addresses

Every scene can be saved as a portable address:

```text
INFINITYLENS369://scene?mode=mandelbrot&center=-0.743643887037151,0.13182590420533&zoom=1.000e+0&palette=violet-gold-duality&overlays=phi,369,equations&audio=bass-reactive&time=42.369
```

The address is not a scientific claim. It is a replay cue for the visual state: formula, center, zoom, palette, overlays, and audio time.

## Project stance

InfinityLens369 is for:

- Fractal exploration
- Music video source visuals
- Live projection / ambient art
- Math-inspired creativity
- Parallax-style symbolic overlays with clean boundaries

InfinityLens369 is not for:

- Claiming proof of hidden physics
- Medical, psychological, or spiritual diagnosis
- Representing generated visuals as empirical evidence

## Roadmap

### v0.1 — Fractal song portal

- Local audio drop
- Web Audio features
- Mandelbrot/Julia shader
- Phi + 369 overlays
- Screenshot export
- Visual address receipts

### v0.2 — Atlas bookmarks

- Saved scene gallery
- Import/export visual address JSON
- More palettes
- Better deep zoom controls

### v0.3 — Video loops

- WebM capture
- Beat-synced camera paths
- Preset song-video templates

### v0.4 — Shader pack

- Burning Ship
- Newton fractals
- Strange attractors
- Reaction-diffusion fields

### v1.0 — Fractal Atlas Studio

- Scene timeline
- Preset packs
- Performance mode
- Shareable visual-address links

## License

MIT — see `LICENSE`.
