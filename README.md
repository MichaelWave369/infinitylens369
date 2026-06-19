# InfinityLens369

**Drop a song. Open a portal.**

InfinityLens369 is a public, browser-based fractal atlas and audio-reactive visualization engine. It turns local audio files into live GPU visuals, trip modes, symbolic geometry overlays, palette shifts, cinematic performance controls, transition bridges, audio-engine shaping, Liquid Light presets, Machine Cathedral presets, local preset saving, local frame capture, local WebM clip recording, Performance Console live controls, and replayable visual-address receipts.

This project is intentionally claim-safe: it is an art, math, and software visualization tool. It is **not** a physics proof, consciousness proof, medical tool, or scientific claim engine.

## v1.9 Performance Console release

v1.9 adds a boot-safe **Performance Console** sidecar for live demos and public playback. It loads after the core React/WebGL app, Preset Studio, Capture Studio, and Recording Studio, then adds a compact live-control panel plus a `?` keyboard overlay.

Performance Console features:

- Keyboard shortcut overlay with the current live performance map
- Quick actions for Cinematic, Fullscreen, Next Trip, Random Trip, Auto Trip, Slow Flow, Safe Mode, and Reset
- Performer contrast toggle for higher stage readability
- Boot-safe loading after the visualizer is already mounted
- Version sync for Performance Console labels

## v1.8.1 UI sync and studio dock hotfix

v1.8.1 syncs the visible release labels across the public GitHub Pages UI and docks the right-side studio menu inside the viewport. The control panel now owns its own scroll lane, stays available in normal view, and disappears cleanly when Cinematic mode/fullscreen presentation takes over.

Hotfix features:

- Visible InfinityLens369 badge syncs to the current release
- Capture Studio and Recording Studio labels sync to the current release
- Right-side studio panel stays inside the browser viewport
- Panel gets its own scrollbar instead of relying on the whole page
- Sticky panel header keeps the upload/play controls close while scrolling
- Cinematic/fullscreen mode keeps the stage clean

## v1.8 Recording Studio release

v1.8 keeps the boot-safe sidecar pattern and adds **Recording Studio**. The studio loads after the core visualizer, Capture Studio, and Preset Studio so the React/WebGL app remains the priority. It records short canvas-only WebM clips from the live visual canvas, lets users download the latest clip, and exports a JSON recording manifest with metadata only.

Recording Studio features:

- Canvas-only WebM recording from the live visualizer
- Start / stop controls in the right-side panel
- Automatic 30-second max clip length to keep browser memory manageable
- Download the latest local WebM clip
- Export a recording manifest with metadata only
- No audio embedding and no upload path
- Boot-safe loading after the core visualizer is already mounted

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
- Machine Cathedral Pack presets built from stable shader routes
- Preset Studio for local save/load/import/export of trip recipes
- Capture Studio for local frame gallery and capture manifests
- Recording Studio for local canvas-only WebM clips and recording manifests
- Performance Console for live shortcut overlays and fast stage controls
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

Press `?` in the app to open the Performance Console keyboard map. The core keyboard shortcuts remain local and browser-only.
