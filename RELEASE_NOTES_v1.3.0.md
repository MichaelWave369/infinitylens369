# InfinityLens369 v1.3.0 — Audio Engine v2

Sprint 3 toward v2.0 focuses on making music reaction feel more intentional, controllable, and performance-ready.

## Highlights

- Added Audio Engine v2 shaping before signals reach the shaders.
- Added separate controls for Bass impact, Mids motion, High sparkle, and Beat punch.
- Added Smooth / Snappy response control.
- Added onset-assisted beat shaping so pulses can respond to rising energy, not only raw beat values.
- Updated trip presets with per-band audio behavior.
- Updated motion profiles with audio response values.
- Added Audio Engine v2 settings to exported JSON receipts.
- Updated README with the v1.3 control model.

## Why this matters

Earlier versions could move too quickly when audio-reactive mode was active. v1.3 keeps the same shader modes, but gives the user finer control over how raw audio becomes visual motion.

Use:

- Lower **Audio speed / drive** for calmer motion.
- Lower **Response** for smoother drift.
- Raise **Beat punch** for stronger rhythmic hits.
- Raise **High sparkle** for more shimmer and fine detail.
- Press **S** for Slow Flow.
- Press **0** for Safe Mode.

## Claim boundary

InfinityLens369 is an open-source art, math, and software visualizer. Audio Engine v2 is a creative signal-shaping layer, not a scientific measurement system, medical tool, or consciousness/physics proof.

## Suggested test flow

1. Pull the latest main branch.
2. Run `npm install`.
3. Run `npm run build`.
4. Run `npm run dev`.
5. Drop in a song.
6. Test Black Hole Lens, Kaleido Trip, and Pixel Melt with Response low, medium, and high.
7. Confirm JSON receipts include the Audio Engine v2 block.
