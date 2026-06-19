# InfinityLens369 v1.11.0 — Launch Console

## What shipped

v1.11.0 adds **Launch Console**, a boot-safe public onboarding sidecar for first-time users and live demos.

Launch Console gives visitors a clear path into the app:

- **First Run Guide** — explains the shortest flow: drop audio, play portal, try trips, go cinematic/fullscreen.
- **Demo Journey** — cycles safe live controls without touching local audio files.
- **Copy Share Link** — copies the current public GitHub Pages URL for easy sharing.
- **Shortcut Map** — opens the performance shortcut overlay.

## Boot-safety boundary

Launch Console loads after the core React/WebGL visualizer and after the existing studio sidecars. If Launch Console fails, the main visualizer should remain available.

## Privacy / claim boundary

- No audio is uploaded.
- No audio is embedded in shared links.
- Demo Journey only clicks existing safe live controls.
- InfinityLens369 remains an art/math/software visualizer, not a scientific claim engine.

## Test flow

1. Fresh-load the app.
2. Confirm the visualizer appears before side panels finish loading.
3. Scroll to **Launch Console**.
4. Click **First Run Guide**.
5. Click **Demo Journey**.
6. Click **Copy Share Link**.
7. Click **Shortcut Map**.
8. Confirm the visible version labels sync to `v1.11.0`.
