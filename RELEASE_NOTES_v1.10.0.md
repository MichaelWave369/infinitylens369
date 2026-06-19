# InfinityLens369 v1.10.0 — Layer Console

## Status

v1.10.0 adds the first boot-safe Layer Console sprint on the path to v2.0.

The goal is to let performers control symbolic overlay stacks without touching the shader core. The core React/WebGL visualizer still renders first, and the Layer Console loads later as a sidecar.

## Shipped

- Added `src/layer-console.ts`
- Added `src/layer-console-loader.ts`
- Added `src/layer-console.css`
- Wired Layer Console into `src/main.tsx` after Performance Console
- Added v1.10 version sync for Layer Console labels
- Added one-click layer scenes:
  - Clean Lens
  - Geometry Stack
  - Symbolic Field
  - Grid Beam
  - Performer Stack
- Added `L` hotkey to cycle layer scenes
- Updated README
- Bumped package version to `1.10.0`

## Test flow

1. Pull the repo.
2. Run `npm install`.
3. Run `npm run build`.
4. Run `npm run dev`.
5. Open the app and confirm the visualizer appears before sidecars.
6. Scroll the right dock to **Layer Console**.
7. Click each layer scene.
8. Press `L` to cycle scenes.
9. Confirm version labels show `v1.10.0` after boot.

## Claim boundary

Layer Console is a visual performance control layer. It is not a scientific measurement layer and does not change the claim-safe status of InfinityLens369.
