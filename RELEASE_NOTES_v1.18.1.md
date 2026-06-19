# InfinityLens369 v1.18.1 — Visual Cleanup Hotfix

## What changed

- Activated the Visual Cleanup sidecar after the public launch packet sidecars.
- Hid the on-stage version/mode badge so the visual field no longer flashes labels in the top-left.
- Hid the bottom stage notice to keep public demo mode clean.
- Clipped transition overlay text/pseudo-elements to reduce the left-middle line artifact seen during transitions.
- Retuned Circuit Cathedral toward a structured cyber-cathedral identity using the existing controls: Kaleido Trip, Abyss Cyan, 3-6-9 grid, equation overlay, lower glow, and calmer audio response.
- Added a subtle circuit/cathedral overlay for the retuned Circuit Cathedral scene.

## Build boundary

This is a polish hotfix only. It does not change shader core, audio ingestion, recording, or local-first privacy boundaries.

## Test flow

1. Fresh load the app.
2. Confirm the top-left stage version/mode badge is hidden.
3. Confirm the bottom stage notice is hidden.
4. Click Machine Cathedral → Circuit Cathedral.
5. Confirm Circuit Cathedral shifts toward a cleaner structured/circuit-window look.
6. Run `npm run build`.
