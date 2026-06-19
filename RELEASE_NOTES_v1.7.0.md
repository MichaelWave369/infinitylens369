# InfinityLens369 v1.7.0 — Capture Studio

Sprint 7 adds the first Capture Studio layer.

## What shipped

- Added `src/capture-studio.ts` as a boot-safe sidecar module.
- Added `src/capture-studio.css` for gallery and capture controls.
- Capture Studio loads asynchronously after the React/WebGL app has mounted.
- Capture the current canvas as a local PNG frame.
- Keep a compact local browser gallery of recent captures.
- Click a thumbnail to download that PNG.
- Download the latest capture with one button.
- Export a JSON capture manifest with metadata only.
- Clear the local gallery.
- Package version bumped to `1.7.0`.
- README updated for Capture Studio.

## Safety and privacy boundary

Capture Studio is local-first. It does not upload audio, images, presets, receipts, or manifests.

Capture manifests intentionally exclude audio files and image bytes. They are creative session metadata, not scientific evidence.

## Boot safety note

Following the v1.6.1 GitHub Pages boot fix, Capture Studio follows the same sidecar rule: the core visualizer mounts first. If Capture Studio fails, the core visualizer should remain available.

## Suggested test flow

1. `git pull`
2. `npm install`
3. `npm run build`
4. `npm run dev`
5. Open a fresh browser tab.
6. Confirm the visualizer appears before sidecars.
7. Drop/play a song.
8. Click **Capture frame**.
9. Click the thumbnail to download the PNG.
10. Click **Download latest**.
11. Click **Export manifest** and confirm it contains metadata only.
12. Clear the gallery and refresh.

## Known next opportunities

- Add WebM clip recording.
- Add poster-frame export sizes.
- Add optional GIF loops.
- Add a deeper React-integrated gallery for v2.0.
