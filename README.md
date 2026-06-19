# InfinityLens369

**Drop a song. Open a portal.**

InfinityLens369 is a public, browser-based fractal atlas and audio-reactive visualization engine. It turns local audio files into live GPU visuals, trip modes, symbolic geometry overlays, palette shifts, cinematic performance controls, transition bridges, audio-engine shaping, Liquid Light presets, Machine Cathedral presets, local preset saving, local frame capture, local WebM clip recording, Performance Console live controls, Layer Console overlay scenes, Launch Console onboarding helpers, Gallery Console scene discovery, Roadmap Console feedback/runway tools, System Health Console browser readiness checks, and replayable visual-address receipts.

This project is intentionally claim-safe: it is an art, math, and software visualization tool. It is **not** a physics proof, consciousness proof, medical tool, or scientific claim engine.

## v1.14 System Health Console release

v1.14 adds a boot-safe **System Health Console** sidecar for local browser readiness checks. It loads after the core React/WebGL app and existing studios, then reports whether this browser supports the runtime features InfinityLens369 uses.

System Health Console features:

- WebGL2 renderer readiness check
- Live canvas mount check
- Web Audio support check
- Local storage support check for local preset/studio metadata
- Canvas recording support check for captureStream and MediaRecorder
- Clipboard and fullscreen support checks
- Copy Diagnostics for clean feedback reports
- Soft Reload for safe browser refresh recovery
- Boot-safe loading after the visualizer is already mounted
- Version sync for System Health Console labels

## v1.13 Roadmap Console release

v1.13 adds a boot-safe **Roadmap Console** sidecar for public feedback and v2.0 runway visibility. It loads after the core React/WebGL app and existing studios, then gives testers a clean way to understand progress, copy structured feedback, and open the issue tracker.

Roadmap Console features:

- v2 runway status cards for the stable core, creator studios, feedback loop, and launch runway
- Copy Feedback Note for testers who want to report what they tried, loved, or found confusing
- Copy v2 Runway for sharing the current public release stack
- Open Issue Tracker for bugs, visual ideas, and public feedback receipts
- Release Stack note showing the build path from the core visualizer to the current roadmap layer
- Boot-safe loading after the visualizer is already mounted
- Version sync for Roadmap Console labels

## v1.12 Gallery Console release

v1.12 adds a boot-safe **Gallery Console** sidecar for public scene discovery. It loads after the core React/WebGL app and existing studios, then gives visitors curated one-click entry points into the best starting experiences.

Gallery Console features:

- Liquid Light entry path for soft aurora and dream-pool lanes
- Machine Cathedral entry path for cyber-temple and vector-shrine lanes
- Deep Portal entry path for black-hole/fractal depth exploration
- Performance Ready entry path for safe/cinematic staging
- Copy Gallery Note for sharing the public page with a short starter guide
- v2 runway status note for public-facing progress
- Boot-safe loading after the visualizer is already mounted
- Version sync for Gallery Console labels

## v1.11 Launch Console release

v1.11 adds a boot-safe **Launch Console** sidecar for public onboarding. It loads after the core React/WebGL app and existing studios, then gives first-time visitors a simple path into the experience.

Launch Console features:

- First Run Guide for new users
- Demo Journey that cycles safe live controls without touching user audio
- Copy Share Link for sending the public GitHub Page
- Shortcut Map action for opening the performance help overlay
- Boot-safe loading after the visualizer is already mounted
- Version sync for Launch Console labels

## v1.10 Layer Console release

v1.10 adds a boot-safe **Layer Console** sidecar for live overlay staging. It loads after the core React/WebGL app and existing studios, then adds one-click layer scenes for quickly shaping the symbolic overlay stack during public playback.

Layer Console features:

- Clean Lens: stage-only view for pure color and motion
- Geometry Stack: phi spiral, 3-6-9 grid, and equations together
- Symbolic Field: phi spiral plus equations without the grid
- Grid Beam: 3-6-9 grid discipline over the live scene
- Performer Stack: readable geometry with minimal text clutter
- `L` hotkey to cycle layer scenes
- Boot-safe loading after the visualizer is already mounted
- Version sync for Layer Console labels

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
