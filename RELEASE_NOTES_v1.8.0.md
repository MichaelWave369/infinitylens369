# InfinityLens369 v1.8.0 — Recording Studio

Sprint 8 adds **Recording Studio** as a boot-safe sidecar for short local WebM visual clips.

## What shipped

- Added `src/recording-studio.ts`.
- Added `src/recording-studio-loader.ts` so dynamic import targets a real ES module.
- Added `src/recording-studio.css`.
- Loaded Recording Studio after the core app, Preset Studio, and Capture Studio.
- Added canvas-only WebM recording from the live visualizer.
- Added Start / Stop controls.
- Added automatic 30-second max clip length to keep browser memory manageable.
- Added Download latest WebM clip.
- Added recording manifest export with metadata only.
- Bumped package version to `1.8.0`.
- Updated README documentation.

## Privacy / claim boundary

Recording Studio records the canvas output only. It does not embed the user's audio file, upload files, or store video bytes in manifests.

Recording manifests are creative replay/export metadata. They are not scientific evidence, medical data, consciousness proof, or physics proof.

## Test flow

1. Load a fresh GitHub Pages instance.
2. Confirm the visualizer renders before sidecars.
3. Drop or play an audio file.
4. Click **Start clip**.
5. Let the visualizer run for a few seconds.
6. Click **Stop**.
7. Click **Download latest** and confirm a `.webm` file downloads.
8. Click **Export manifest** and confirm metadata-only JSON downloads.
9. Refresh the page and confirm the app still boots cleanly.

## Known limits

- Recording support depends on browser support for `canvas.captureStream()` and `MediaRecorder`.
- Clips are intentionally short in this sprint.
- Audio is intentionally not embedded.
- The latest clip is memory-only; download before refreshing.
