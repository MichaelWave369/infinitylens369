# InfinityLens369 v1.6.0 — Preset Studio

Sprint 6 toward v2.0 adds the first Preset Studio layer.

## What changed

- Added a local-first Preset Studio sidecar module.
- Added a Preset Studio panel to the existing control panel.
- Saved presets now store visual mode, palette, overlay toggles, visual pressure, glow, Audio Engine v2 controls, transition style, and transition duration.
- Presets are stored in browser `localStorage` under `infinitylens369:preset-studio:v1`.
- Added load latest, per-preset reload, delete, export preset pack, and import preset pack.
- Exported preset packs are JSON files and do not include audio files.
- Added Preset Studio styling.
- Bumped package version to `1.6.0`.
- Updated README for v1.6.

## Test flow

1. `npm install`
2. `npm run build`
3. `npm run dev`
4. Open the app and tune any scene.
5. Use Preset Studio → Save current.
6. Change the scene with Random Trip or any pack preset.
7. Use Preset Studio → Load latest.
8. Export a preset pack.
9. Import that preset pack and confirm the presets appear in the local library.

## Claim boundary

Preset Studio saves creative visual recipes only. It does not save audio. It does not create scientific, medical, spiritual, or physics evidence.

## Notes

This is intentionally shipped as a sidecar module so the large, green React/WebGL core does not need risky surgery during the sprint. A later v2.0 pass can fold Preset Studio deeper into app state, share links, and community packs.
