# InfinityLens369 v1.9.0 — Performance Console

v1.9.0 adds a boot-safe **Performance Console** sidecar for live demos, public playback, and fast operator control during visual sessions.

## Added

- Performance Console sidecar loaded after the core React/WebGL app
- Dedicated `?` keyboard overlay with the live shortcut map
- Quick action buttons for Cinematic, Fullscreen, Next, Random, Auto Trip, Slow Flow, Safe Mode, and Reset
- Performer contrast toggle for higher stage readability during live use
- Version sync now includes Performance Console labels
- Performance Console styling and overlay layout

## Boot safety

The core visualizer renders first. Performance Console loads after Preset Studio, Capture Studio, and Recording Studio. If Performance Console fails, the main visualizer should remain usable.

## Test flow

1. Fresh-load the app.
2. Confirm the visualizer appears before sidecars matter.
3. Press `?` to open the keyboard performance map.
4. Click Performance Console actions: Cinematic, Fullscreen, Next, Random, Auto Trip, Slow Flow, Safe, Reset.
5. Toggle Performer contrast.
6. Run `npm run build`.

## Claim boundary

Performance Console is a live UI/control helper. It does not add audio upload, tracking, analytics, external services, or scientific claims.
