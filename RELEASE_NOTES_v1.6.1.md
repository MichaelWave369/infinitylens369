# InfinityLens369 v1.6.1 — GitHub Pages Boot Hotfix

## Why this release exists

After v1.6.0, the app could pass CI but hang on a fresh GitHub Pages load with a black screen and loading spinner. The likely cause was the new Preset Studio sidecar being loaded as part of the critical startup path and watching the full document for mutations.

v1.6.1 keeps the Preset Studio feature but makes it non-blocking and safer.

## Changes

- Render the core React/WebGL visualizer first.
- Load Preset Studio asynchronously after the app has mounted.
- Catch Preset Studio loading failures so the core visualizer still opens.
- Replace the broad page-wide mutation observer with a debounced root-scoped bootstrap.
- Add safer localStorage write handling.
- Bump package version to `1.6.1`.

## Test flow

1. Open the GitHub Pages site in a fresh/private window.
2. Confirm the visualizer renders before interacting with controls.
3. Confirm the right panel appears normally.
4. Confirm Preset Studio appears after the app loads.
5. Save a preset, randomize the trip, then load the saved preset.
6. Refresh and confirm the page still boots.

## Claim boundary

This is a public reliability hotfix. It does not change the creative claim boundary: InfinityLens369 is an open-source local-first art and math visualizer, not a physics, medical, spiritual, or consciousness proof.
